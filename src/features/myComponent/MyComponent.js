import React, {useEffect, useState} from 'react';
import {Box, Button, TextField, Typography} from "@mui/material";
import HolaChau from "../holaChau/HolaChau";
import styles from "./MyComponent.module.css";
import Counter from "../counter/Counter.js";
import axios from "axios";
import {useForm} from "react-hook-form";
import * as uuid from "uuid";

const MyComponent = () => {

    const boxStyle = {
        display: "flex",
        flexDirection: "column",
        marginRight: "300px",
        marginLeft: "300px",
        marginBottom: "20px"
    };

    const [posts, setPosts] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [message, setMessage] = useState("Debe autenticarse");
    const [title, setTitle] = useState("Ingrese su token");
    const [formFields, setFormFields] = useState(
        { count: 0, array: [0] }
    )
    const {register: registerPost, handleSubmit: handleSubmitPost} = useForm();
    const {register: registerToken, handleSubmit: handleSubmitToken} = useForm();

    function Forms({auth}) {
        if (auth) {
            return (
                <Box sx={boxStyle}>
                    <form onSubmit={handleSubmitPost(onSubmitPost)}>
                        <TextField {...registerPost("title")} id="title" label="Title" variant="outlined" sx={{marginRight: "20px"}}/>
                        <TextField {...registerPost("author")} id="author" label="Author" variant="outlined" sx={{marginRight: "20px"}}/>
                        <Button variant="contained" type="submit">Enviar</Button>
                        <Button variant="contained" onClick={addFields}>Agregar fila</Button>
                    </form>
                </Box>
            );
        }
        return (
            <Box sx={boxStyle}>
                <form onSubmit={handleSubmitToken(onSubmitToken)}>
                    <TextField {...registerToken("token")} id="token" label="Token" variant="outlined" sx={{marginRight: "20px"}}/>
                    <Button variant="contained" type="submit">Enviar token</Button>
                </form>
            </Box>
        );
    }

    const handleProp = () => {

    };

    const addFields = () => {
        setFormFields({ count: formFields.count + 1, array: [...formFields.array, formFields.count + 1] });
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
            setMessage("Autenticado correctamente. Puede postear")
            setTitle("Crear post")
        }
    }

    const onSubmitPost = async (data) => {
        if (data.title !== "" && data.author !== "") {
            const request = {
                id: uuid.v4(),
                title: data.title,
                author: data.author     // la validacion de que las props coincidan se hace en el backend
            }
            try {
                const response = await axios.post('/posts', request, config)
                setPosts([...posts, response.data])
                setMessage("Se cargó correctamente el nuevo posteo")
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
    }

    useEffect(() => {
        axios.get('/posts', config)
            .then((response) => {
                setPosts(response.data);
            });
        if (localStorage.getItem("token") !== null) {
            setMessage("Puede postear")
            setTitle("Crear post")
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
                {formFields.array.map((index) => {
                    return (
                        <Forms key={formFields.array[index]} auth={authenticated}></Forms>
                    )})
                }
                <Typography variant="h5">{message}</Typography>
            </Box>
        </div>
    );

}

export default MyComponent;
