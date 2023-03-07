import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './counterSlice'
import {Box, Button, Typography} from "@mui/material";

export default function Counter() {
    const count = useSelector(state => state.counter.value)
    const dispatch = useDispatch()

    return (
        <Box>
            <Button aria-label="Increment value" onClick={() => dispatch(increment())}>Increment</Button>
            <Typography>{count}</Typography>
            <Button aria-label="Decrement value" onClick={() => dispatch(decrement())}>Decrement</Button>
        </Box>
    )
}