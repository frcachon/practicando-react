import React from 'react';
import {Box, Typography} from "@mui/material";

const HolaChau = ({myprop}) => {

    const boxStyle = {
        color: "Red",
        background: "lightpink"
    };

    return (
        <div>
            <Box sx={boxStyle}>
                <Typography variant="h4" component="h2">
                    Componente HolaChau
                </Typography>
            </Box>

        </div>
    );

}

export default HolaChau;
