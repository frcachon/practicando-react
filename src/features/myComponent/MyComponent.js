import React, {useEffect, useState} from 'react';
import {Box, Button, TextField, Typography} from "@mui/material";
import styles from "./MyComponent.module.css";
import axios from "axios";
import {useForm} from "react-hook-form";
import ContainerForm from "../containerForm/ContainerForm";

const MyComponent = () => {

    const [containers, setContainers] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [title, setTitle] = useState("Log in");
    const [message, setMessage] = useState("Please insert the token you were given.");
    const {register: registerToken, handleSubmit: handleSubmitToken} = useForm();

    let config = {
        baseURL: 'http://localhost:3004'
    }

    function TokenForm() {
        return (
            <Box>
                <form onSubmit={handleSubmitToken(handleRetrieveToken)}>
                    <Box sx={{display: "flex", flexDirection: "row", maxHeight: "60px"}}>
                        <Box sx={{flexGrow: "10", paddingRight: "10px"}}>
                            <TextField {...registerToken("token", {required: 'true'})} id="token" label="Token"
                                       variant="outlined" sx={{marginRight: "10px", height: "100%", width: "100%"}}
                                       error={false}/>
                        </Box>
                        <Box sx={{flexGrow: "1"}}>
                            <Button variant="contained" type="submit" sx={{height: "100%", width: "100%"}}>Submit token</Button>
                        </Box>
                    </Box>
                </form>
                <Typography component="span" sx={{ display: 'block', paddingTop: "10px"}}>{message}</Typography>
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
            config['headers'] = {'Authorization': `Bearer ${response.data.accessToken}` }; // according to docs: "Bearer ..." -> "Token ..."
            localStorage.setItem("accessToken", response.data.accessToken);
            console.log(response.data.accessToken);
            setAuthenticated(true);
            setTitle("Weight and balance")
            setMessage("Successfully authenticated.")
        } catch (error) {
            console.log(error.message)
            setMessage("Invalid token.")
        }
    }

    useEffect(() => {
        axios.get('/containers', config)
            .then((response) => {
                setContainers(response.data)
            });
        if (localStorage.getItem("accessToken") !== null) {
            setTitle("Weight and balance")
            setMessage("Successfully authenticated.")
            setAuthenticated(true)
        }

    }, []);

    return (
        <Box className={styles.mainBox}>
            <Typography variant="h4" sx={{paddingBottom: "10px"}}>{title}</Typography>
            {authenticated ? (<ContainerForm/>) : <TokenForm/>}
        </Box>
    );

}

export default MyComponent;