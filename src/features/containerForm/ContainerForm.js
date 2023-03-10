import React, { useState } from 'react';
import axios from 'axios';
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import styles from './ContainerForm.module.css';

function ContainerForm() {

    //const [containers, setContainers] = useState([]);
    const [planeType, setPlaneType] = useState('');
    const [message, setMessage] = useState('');
    const [formFields, setFormFields] = useState([
        { container_type: '', weight: '' },
    ])

    // axios.get('/containers', config)
    //     .then((response) => {
    //         setContainers(response.data)
    //     });

    const handlePlaneTypeChange = (event) => {
        setPlaneType(event.target.value);
    };

    const handleContainerTypeChange = (event, index) => {
        let data = [...formFields];
        data[index]["container_type"] = event.target.value;
        setFormFields(data);
    }

    const handleWeightChange = (event, index) => {
        let data = [...formFields];
        data[index]["weight"] = event.target.value;
        setFormFields(data);
    }

    const submit = async (e) => {
        e.preventDefault();
        const containerTypeIsSelected = formFields.every(item => item.container_type !== "")
        const weightIsValid = formFields.every(item => item.weight > 0)
        if (planeType === "") {
            setMessage("Select a plane type.")
            return;
        }
        if (!containerTypeIsSelected) {
            setMessage("Select every container type.")
            return;
        }
        if (!weightIsValid) {
            setMessage("Weight must be positive.")
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
                            <MenuItem value="planetype1">Plane type 1</MenuItem>
                            <MenuItem value="planetype2">Plane type 2</MenuItem>
                            <MenuItem value="planetype3">Plane type 3</MenuItem>
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
                                        onChange={event => handleContainerTypeChange(event, index)}
                                        variant="outlined"
                                    >
                                        <MenuItem value="containertype1">Container type 1</MenuItem>
                                        <MenuItem value="containertype2">Container type 2</MenuItem>
                                        <MenuItem value="containertype3">Container type 3</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={ {flexGrow: "6", paddingRight: "10px"} }>
                                <TextField
                                    name='weight'
                                    placeholder='Weight'
                                    onChange={event => handleWeightChange(event, index)}
                                    value={form.weight}
                                    type='number'
                                    min="1"
                                    sx={{height: "100%", width: "100%"}}
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={ {flexGrow: "1"} } >
                                <Button sx={{height: "100%", width: "100%"}} variant="contained"
                                        onClick={() => removeFields(index)}>Remove row</Button>
                            </Box>
                        </Box>
                    )
                })}
            </form>
            {(message !== "") ? <Box component="span" sx={{ display: 'block', paddingTop: "10px", paddingBottom: "20px" }}>
                {message}</Box> : <Box/>}

            <Box sx={{display: "flex", flexDirection: "row", height: "60px"}}>

                <Box sx={{flexGrow: "1", paddingRight: "20px"}}>
                    <Button sx={{height: "100%", width: "100%"}} variant="contained" onClick={addFields}>Add row</Button>
                </Box>
                <Box sx={{flexGrow: "7"}}/>
                <Box sx={{flexGrow: "1"}}>
                    <Button sx={{height: "100%", width: "100%"}} variant="contained" onClick={submit}>Submit</Button>
                </Box>
            </Box>

        </Box>
    );
}

export default ContainerForm;