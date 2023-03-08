import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './counterSlice'
import {Box, Button, Typography} from "@mui/material";

export default function Counter() {
    const count = useSelector(state => state.counter.value)
    const dispatch = useDispatch()

    return (
        <Box sx={{marginLeft: "50px", marginRight: "50px", marginTop: "50px", marginBottom: "50px"}}>
            <Typography variant="h6" >Redux counter</Typography>
            <Box sx={{display: "flex", flexDirection: "row", width: "100%", height: "100%", marginTop: "20px", marginBottom: "20px"}}>
                <Box sx={{flexGrow: "5"}}>
                    <Button variant="outlined" aria-label="Decrement value" onClick={() => dispatch(decrement())}>Decrement</Button>
                </Box>
                <Box sx={{flexGrow: "1", display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column"}}>
                    <Typography variant="h6" >{count}</Typography>
                </Box>
                <Box sx={{flexGrow: "5"}}>
                    <Button variant="outlined" aria-label="Increment value" onClick={() => dispatch(increment())}>Increment</Button>
                </Box>
            </Box>
        </Box>
    )
}