import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import HolaChau from "../holaChau/HolaChau";
import styles from "./MyComponent.module.css";
import Counter from "../counter/Counter.js";
import axios from "axios";
import {useForm} from "react-hook-form";
import * as uuid from "uuid";

const MyComponent = () => {

    const boxStyle = {
        display: "flex",
        flexDirection: "row",
        marginRight: "300px",
        marginLeft: "300px",
        marginBottom: "20px"
    };

    const types = ["Type 1", "Type 2", "Type 3"];

    const [selectedType, setSelectedType] = useState('');
    const [posts, setPosts] = useState([]);
    const [containers, setContainers] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [message, setMessage] = useState("Debe autenticarse");
    const [title, setTitle] = useState("Ingrese su token");
    const [formFields, setFormFields] = useState(
        { count: 0, array: [0] }
    )
    const {register: registerPost, handleSubmit: handleSubmitPost} = useForm();
    const {register: registerToken, handleSubmit: handleSubmitToken} = useForm();


    function TokenForm() {
        return (
            <Box sx={boxStyle}>
                <form onSubmit={handleSubmitToken(onSubmitToken)}>
                    <TextField {...registerToken("token")} required={true} id="token" label="Token" variant="outlined" sx={{marginRight: "20px"}} error={false}/>
                    <Button variant="contained" type="submit">Enviar token</Button>
                </form>
            </Box>
        );
    }

    function ContainerForm() {
        return (
            <form onSubmit={handleSubmitPost(onSubmitContainer)}>
                {formFields.array.map((line) => {
                    return (
                        <Box sx={boxStyle} key={formFields.array[line]} >
                            <TextField {...registerPost("profit")} id="profit" required={true} label="Profit" variant="outlined" sx={{marginRight: "20px"}} error={false}/>
                            <TextField {...registerPost("weight")} id="weight" required={true} label="Weight" variant="outlined" sx={{marginRight: "20px"}} error={false}/>
                            <FormControl>
                                <Select {...registerPost("type")} id="type" required={true} value={selectedType} label="Type" onChange={handleTypeChange}>
                                    {types.map((t, index) => {
                                        return (
                                            <MenuItem key={index} value={t}>{t}</MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                            <Button variant="contained" onClick={() => removeField(line)}>Eliminar fila</Button>
                        </Box>
                )})}
                <Button variant="contained" onClick={addField}>Agregar fila</Button>
                <Button variant="contained" type="submit">Enviar</Button>
            </form>
        )
    }

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
        console.log(selectedType);
    };

    const handleProp = () => {

    };

    const addField = () => {
        setFormFields({ count: formFields.count + 1, array: [...formFields.array, formFields.count + 1] });
    }

    const removeField = (index) => {
        let data = [...formFields.array];
        let newData = data.filter((value) => parseInt(value) !== parseInt(index))
        setFormFields({ count: formFields.count, array: newData })
    }

    let config = {
        baseURL: 'http://localhost:3004'
    }

    const onSubmitToken = async (data) => {
        config['headers'] = {'Authorization': `Basic ${data.token}` };
        const response = await axios.request(config);
        if (response.statusText === 'OK') {
            localStorage.setItem("token", data.token);
            setAuthenticated(true);
            setMessage("Autenticado correctamente. Puede añadir containers")
            setTitle("Add containers")
        }
    }

    const onSubmitContainer = async (data) => {
        const request = {
            id: uuid.v4(),
            profit: data.profit,
            weight: data.weight,     // la validacion de que las props coincidan se hace en el backend
            type: data.type
        }
        try {
            const response = await axios.post('/containers', request, config)
            setContainers([...containers, response.data])
            setMessage("Se cargaron correctamente los nuevos containers")
        } catch (error) {
            if (parseInt(error.response.status) === 404) {
                setMessage("Not Found")
            }
            else if (parseInt(error.response.status) === 403) {
                setMessage("Forbidden")
            }
            else if (parseInt(error.response.status) === 400) {
                setMessage("Bad Request")
            }
            else {
                setMessage(error.message)
            }
        }
    }

    useEffect(() => {
        axios.get('/posts', config)
            .then((response) => {
                setPosts(response.data);
            });
        if (localStorage.getItem("token") !== null) {
            setMessage("Autenticado correctamente. Puede añadir containers")
            setTitle("Add containers")
            setAuthenticated(true)
        }

    }, []);

    return (
        <div>
            <Box className={styles.mainBox}>
                <Typography variant="h2" >React-training app</Typography>
                <HolaChau myprop={handleProp}/>
                <Counter/>
                <Box sx={{display: "flex", flexDirection: "column", width: "100%", height: "40vh", justifyContent: "center", alignItems: "center"}}>
                    {posts.map((post) => {
                        return (
                            <Box key={post.id} sx={{display: "flex", flexDirection: "row", marginBottom: "30px"}}>
                                <Typography sx={{marginRight: "20px"}} variant={"h5"}>{post.title}</Typography>
                                <Typography sx={{marginRight: "20px"}}>{post.author}</Typography>
                                <Button variant="contained">Eliminar posteo</Button>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
            <Box>
                <Typography variant="h2">{title}</Typography>
                {authenticated ? <ContainerForm/> : <TokenForm/>}
                <Typography variant="h5">{message}</Typography>
            </Box>
        </div>
    );

}

export default MyComponent;
