import React, { useState } from 'react';
import axios from 'axios';
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import styles from './ContainerForm.module.css';

function ContainerForm() {

    const [planeType, setPlaneType] = useState('');
    const [message, setMessage] = useState('');
    const [formFields, setFormFields] = useState([
        { container_type: '', weight: '' },
    ])

    const handleFormChange = (event, index) => {
        let data = [...formFields];
        data[index][event.target.name] = event.target.value;
        setFormFields(data);
    }

    const handlePlaneTypeChange = (event) => {
        setPlaneType(event.target.value);
    };

    const submit = async (e) => {
        e.preventDefault();
        const containerTypeIsSelected = formFields.every(item => item.container_type !== "")
        const weightIsValid = formFields.every(item => item.weight > 0)
        if (!weightIsValid) {

            setMessage("Weight must be positive.")
            return;
        }
        if (!containerTypeIsSelected) {
            setMessage("Select a every container type.")
            return;
        }
        if (planeType === "") {
            setMessage("Select a plane type.")
            return;
        }
        if (formFields.length === 0) {
            setMessage("You must submit containers.")
            return;
        }

        const request = {
            plane: planeType,
            containers: formFields
        }

        try {
            const response = await axios.post('http://localhost:3004/containers', request)
            setFormFields([
                { container_type: '', weight: '' },
            ])
            setMessage("Your containers were succesfully submitted.")
            setPlaneType("")
            console.log(response.data)
            //console.log(response.data.status)

        } catch (error) {
            console.log(error.message)
        }
    }

    const addFields = () => {
        let object = {
            container_type: '',
            weight: ''
        }
        setMessage("")
        setFormFields([...formFields, object])
    }

    const removeFields = (index) => {
        let data = [...formFields];
        data.splice(index, 1)
        setFormFields(data)
        setMessage("")
    }

    return (
        <Box>
            <form>
                <Box sx={ {paddingBottom: "10px"} }>
                    <FormControl sx={{height: "100%", width: "100%"}}>
                        <InputLabel id="plane-type-label">Plane type</InputLabel>
                        <Select
                            labelId="plane-type-label"
                            id="plane-type-select"
                            value={planeType}
                            label="Plane type"
                            onChange={handlePlaneTypeChange}
                            variant="outlined"
                        >
                            <MenuItem value="type1">Plane type 1</MenuItem>
                            <MenuItem value="type2">Plane type 2</MenuItem>
                            <MenuItem value="type3">Plane type 3</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {formFields.map((form, index) => {
                    return (
                        <Box className={styles.formBox} key={index}>
                            <Box sx={ {flexGrow: "12", paddingRight: "10px"} }>
                                <FormControl sx={{height: "100%", width: "100%"}}>
                                    <InputLabel id="container-type-label">Container type</InputLabel>
                                    <Select
                                        labelId="container-type-label"
                                        id="container-type-select"
                                        value={form.container_type}
                                        label="Container type"
                                        onChange={event => handleFormChange(event, index)}
                                        variant="outlined"
                                    >
                                        <MenuItem value="type1">Container type 1</MenuItem>
                                        <MenuItem value="type2">Container type 2</MenuItem>
                                        <MenuItem value="type3">Container type 3</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={ {flexGrow: "6", paddingRight: "10px"} }>
                                <TextField
                                    name='weight'
                                    placeholder='Weight'
                                    onChange={event => handleFormChange(event, index)}
                                    value={form.weight}
                                    type='number'
                                    min="1"
                                    sx={{height: "100%", width: "100%"}}
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={ {flexGrow: "1"} } >
                                <Button sx={{height: "100%", width: "100%"}} variant="contained" onClick={() => removeFields(index)}>Remove row</Button>
                            </Box>
                        </Box>
                    )
                })}
            </form>
            {(message !== "") ? <Box component="span" sx={{ display: 'block', paddingTop: "10px", paddingBottom: "20px" }}>{message}</Box> : <Box/>}

            <Box sx={{display: "flex", flexDirection: "row", height: "60px"}}>
                <Box sx={{flexGrow: "12"}}/>
                <Box sx={{flexGrow: "1", paddingRight: "10px"}}>
                    <Button sx={{height: "100%", width: "100%"}} variant="contained" onClick={addFields}>Add row</Button>
                </Box>
                <Box sx={{flexGrow: "1"}}>
                    <Button sx={{height: "100%", width: "100%"}} variant="contained" onClick={submit}>Submit</Button>
                </Box>
            </Box>

        </Box>
    );
}

export default ContainerForm;