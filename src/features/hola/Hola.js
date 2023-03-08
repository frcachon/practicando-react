import React from 'react';
import {Box, Typography} from "@mui/material";
import Counter from "../counter/Counter.js";
import axios from "axios";
import {useQuery} from "react-query";

const Hola = () => {

    let config = {
        baseURL: 'http://localhost:3004'
    }

    const useGetContainers = () => {
        return useQuery('containers',
            () => axios.get('/containers', config).then(res => console.log(res.data)),
            {
                refetchInterval: 2000,
                refetchIntervalInBackground: false // default to true
            });
    }

    function ContainersList() {
        const {isLoading, data} = useGetContainers()
        if (isLoading) {
            return (
                <Typography>Loading...</Typography>
            );
        } else {
            return (
                <Box>
                    <Typography>Fetched data</Typography>
                </Box>
            );
        }
    }

    return (
        <Box>
            <Counter/>
            <ContainersList/>
        </Box>
    );

}

export default Hola;