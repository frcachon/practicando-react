import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    TextField,
    Typography
} from "@mui/material";
import HolaChau from "../holaChau/HolaChau";
import styles from "./MyComponent.module.css";
import Counter from "../counter/Counter.js";
import axios from "axios";
import {useForm} from "react-hook-form";
import ContainerForm from "../containerForm/ContainerForm";

const MyComponent = () => {

    const boxStyle = {
        display: "flex",
        flexDirection: "row",
        marginRight: "300px",
        marginLeft: "300px",
        marginBottom: "20px"
    };

    const [containers, setContainers] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [message, setMessage] = useState("Debe autenticarse");
    const [title, setTitle] = useState("Ingrese su token");
    const {register: registerToken, handleSubmit: handleSubmitToken} = useForm();

    let config = {
        baseURL: 'http://localhost:3004'
    }

    function TokenForm() {
        return (
            <Box sx={boxStyle}>
                <form onSubmit={handleSubmitToken(handleRetrieveToken)}>
                    <TextField {...registerToken("token", {required: 'true'})} id="token" label="Token" variant="outlined" sx={{marginRight: "20px"}} error={false}/>
                    <Button variant="contained" type="submit">Enviar token</Button>
                </form>
            </Box>
        );
    }

    const handleRetrieveToken = async (data) => {
        const request = {
            email: "coti@coti.com",
            password: "coti"
        }
        try {
            const response = await axios.post('http://localhost:3004/login', request)
            config['headers'] = {'Authorization': `Bearer ${response.data.accessToken}` };
            localStorage.setItem("accessToken", response.data.accessToken);
            console.log(response.data.accessToken);
            setAuthenticated(true);
            setMessage("Autenticado correctamente. Puede añadir containers")
            setTitle("Add containers")
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleProp = () => {
        console.log("hola")
    };

    useEffect(() => {
        axios.get('/containers', config)
            .then((response) => {
                setContainers(response.data)
            });
        if (localStorage.getItem("accessToken") !== null) {
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
                    {containers.map((c) => {
                        return (
                            <Box key={c.id} sx={{display: "flex", flexDirection: "row", marginBottom: "30px"}}>
                                <Typography sx={{marginRight: "20px"}} variant={"h5"}>{c.id}</Typography>
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
