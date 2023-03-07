import React from 'react';
import {Box, Typography} from "@mui/material";

const Hola = ({myprop}) => {

    const boxStyle = {
        color: "Red",
        background: "lightpink",
        marginTop: "10px",
        marginBottom: "10px"
    };

    return (
        <Box sx={boxStyle}>
            <Typography variant="h5">Componente Hola</Typography>
        </Box>
    );

}

export default Hola;
