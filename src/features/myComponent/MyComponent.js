import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    TextField,
    Typography
} from "@mui/material";
import Hola from "../hola/Hola";
import styles from "./MyComponent.module.css";
import Counter from "../counter/Counter.js";
import axios from "axios";
import {useForm} from "react-hook-form";
import ContainerForm from "../containerForm/ContainerForm";

const MyComponent = () => {

    const [containers, setContainers] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [message, setMessage] = useState("You must be authenticated.");
    const [title, setTitle] = useState("Log in");
    const {register: registerToken, handleSubmit: handleSubmitToken} = useForm();

    let config = {
        baseURL: 'http://localhost:3004'
    }

    function TokenForm() {
        return (
            <Box>
                <form onSubmit={handleSubmitToken(handleRetrieveToken)}>
                    <Box sx={{display: "flex", flexDirection: "row", maxHeight: "60px"}}>
                        <Box sx={{flexGrow: "4", paddingRight: "10px"}}>
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
            config['headers'] = {'Authorization': `Bearer ${response.data.accessToken}` };
            localStorage.setItem("accessToken", response.data.accessToken);
            console.log(response.data.accessToken);
            setAuthenticated(true);
            setMessage("Successfully authenticated. You are now able to add containers")
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
            setMessage("Successfully authenticated. You are now able to add containers")
            setTitle("Add containers")
            setAuthenticated(true)
        }

    }, []);

    return (
        <Box className={styles.mainBox}>
            <Typography variant="h2" >React-training app</Typography>
            <Hola myprop={handleProp}/>
            <Counter/>
            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingTop: "10px", paddingBottom: "10px"}}>
                {containers.map((c) => {
                    return (
                        <Box key={c.id} sx={{display: "flex", flexDirection: "row", marginBottom: "10px"}}>
                            <Typography variant="h5">{c.id}</Typography>
                        </Box>
                    );
                })}
            </Box>
            <Box>
                <Typography variant="h3" sx={{paddingBottom: "10px"}}>{title}</Typography>
                {authenticated ? (<ContainerForm/>) : <TokenForm/>}
            </Box>
        </Box>
    );

}

export default MyComponent;