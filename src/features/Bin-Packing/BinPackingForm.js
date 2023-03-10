import React, {useState} from "react";
import axios from "axios";
import {Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import styles from "../containerForm/ContainerForm.module.css";


function BinPackingForm() {

    const [flightWeightCapacity, setFlightWeightCapacity] = useState('');
    const [message, setMessage] = useState('');
    const [containerFields, setContainerFields] = useState([
        {container_type: '', config: ''},])
    const [abwsFields, setabwsFields] = useState([
        {
            type: '', uld_identifiers: '', priority: '', awb_number: ''
            , shc: '', weight: '', volume: '', dimensions: ''
        },])


    const submit = async (e) => {
        e.preventDefault();

        const configIsValid = containerFields.every(item => item.config !== '' &&  item.config > 0)
        const priorityIsValid= abwsFields.every(item => item.priority !== '' && Number(item.priority) > 0)
        const awbNumberIsValid= abwsFields.every(item=> item.awb_number!== '' && Number(item.awb_number) > 0)
        const weightIsValid = abwsFields.every(item => item.weight !== '' && typeof Number(item.weight) === 'number' && Number(item.weight) > 0)
        const volumeIsValid = abwsFields.every(item => item.volume !== '' && typeof Number(item.volume) === 'number' && Number(item.volume) > 0)

        const awbNumbers = abwsFields.map(item => item.awb_number);
        if (awbNumbers.length !== [...new Set(awbNumbers)].length) {//tiene q ser unico probar si eso funciona
            setMessage("Awb number must be unique.");
            return;
        }

        //Me falta ver las que los campos pueden ser mandados sin nada

        if (!configIsValid) {
            setMessage("Weight must be positive.")
            return;
        }
        if (!weightIsValid) {
            setMessage("Weight must be a positive number.")
            return;
        }
        if (!volumeIsValid) {
            setMessage("Volume must be a positive number.")
            return;
        }
        if (!awbNumberIsValid) {
            setMessage("Awb number must be a positive number.")
            return;
        }
        if (!priorityIsValid) {
            setMessage("Priority must be a positive number.")
            return;
        }
        if (containerFields.length === 0) {
            setMessage("You must submit containers.")
            return;
        }
        if (abwsFields.length === 0) {
            setMessage("You must submit abws.")
            return;
        }

        const request = {
            flight: flightWeightCapacity,
            containers: containerFields,
            abws: abwsFields.map((abw) => {
                if (abw.type === null || abw.type === 'BULK' || abw.type === 'BUP' ) {
                    // Remove the 'uld_identifiers' property from the object
                    const { uld_identifiers, ...rest } = abw;
                    return rest;
                }if (abw.type === 'BUP' || abw.type === 'SSPD'){
                    // Remove the 'dimension' property from the object
                    const { dimensions, ...rest } = abw;
                    return rest;
                }
                else {
                    return abw;
                }
            }),
        }

        try {
            const response = await axios.post('http://localhost:3004/BPP', request)
            setContainerFields([
                {container_type: '', config: ''},])
            setabwsFields([
                {
                    type: '', uld_identifiers: '', priority: '', awb_number: ''
                    , shc: '', weight: '', volume: '', dimensions: ''
                },])
            setMessage("Your containers were succesfully submitted.")
            setFlightWeightCapacity("")
            console.log(response.data)


        } catch (error) {
            console.log(error.message)
        }
    }

    const addFieldsContainer = () => {
        let object = {
            container_type: '',
            config: ''
        }

        setMessage("")
        setContainerFields([...containerFields, object])

    }
    const addFieldsAbws = () => {
        let object = {
            type: '',
            uld_identifiers: '',
            priority: '',
            awb_number: '',
            shc: '',
            weight: '',
            volume: '',
            dimensions: ''
        }
        setMessage("")
        setabwsFields([...abwsFields, object])
    }


    const removeFieldsContainer = (index) => {
        let data = [...containerFields];
        data.splice(index, 1)
        setContainerFields(data)
        setMessage("")
    }
    const removeFieldsabws = (index) => {
        let data = [...abwsFields];
        data.splice(index, 1)
        setabwsFields(data)
        setMessage("")
    }

    const handleContainerTypeChange = (event, index) => {
        let data = [...containerFields];
        data[index]["container_type"] = event.target.value;
        setContainerFields(data);
    }

    return (
        <Box>
            <form>
                <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' },}}
                     noValidate
                     autoComplete="off"
                >
                    <TextField id="flight-weight-capacity" label="Flight-Weight-Capacity" variant="standard" />
                </Box>
                {containerFields.map((form, index) => {
                    return (
                        <Box className={styles.formBox} key={index}>
                            <Box sx={ {flexGrow: "12", paddingRight: "10px"} }>
                                <FormControl sx={{height: "100%", width: "100%"}}>
                                    <InputLabel id="container-type">Container type</InputLabel>
                                    <Select
                                        labelId="container-type-label"
                                        id="container-type-select"
                                        value={form.container_type}
                                        label="Container type"
                                        onChange={event => handleContainerTypeChange(event, index)}
                                        variant="outlined"
                                    >
                                        <MenuItem value="containertype1">PMP</MenuItem>
                                        <MenuItem value="containertype2">PAG</MenuItem>
                                        <MenuItem value="containertype3">PAJ</MenuItem>
                                        <MenuItem value="containertype4">AKE</MenuItem>
                                        <MenuItem value="containertype5">RKN</MenuItem>
                                        <MenuItem value="containertype6">AKH</MenuItem>
                                        <MenuItem value="containertype7">PKC</MenuItem>
                                        <MenuItem value="containertype8">RAP</MenuItem>
                                        <MenuItem value="containertype9">BULK</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box component="form" sx={{'& > :not(style)': {m: 1, width: '25ch'},}}
                                 noValidate
                                 autoComplete="off">
                                <TextField id="config" label="type" variant="standard"/>
                            </Box>
                            <Box sx={ {flexGrow: "1"} } >
                                <Button sx={{height: "100%", width: "100%"}} variant="contained"
                                        onClick={() => removeFieldsContainer(index)}>Remove row</Button>
                            </Box>
                        </Box>
                    )
                })}
                {abwsFields.map((form, index) => {
                    return (
                        <Box className={styles.formBox}  key={index}>
                            <Box component="form" sx={{'& > :not(style)': {m: 1, width: '25ch'},}}
                                 noValidate
                                 autoComplete="off">
                                <TextField id="type" label="type" variant="standard"/>
                                <TextField id="uld_identifiers" label="uld-identifiers" variant="standard"/>
                                <TextField id="priority" label="priority" variant="standard"/>
                            </Box>
                            <Box component="form" sx={{'& > :not(style)': {m: 1, width: '25ch'},}}
                                 noValidate
                                 autoComplete="off">
                                <TextField id="awb_number" label="awb_number" variant="standard"/>
                                <TextField id="shc" label="shc" variant="standard"/>
                                <TextField id="weight" label="weight" variant="standard"/>
                            </Box>
                            <Box component="form" sx={{'& > :not(style)': {m: 1, width: '25ch'},}}
                                 noValidate
                                 autoComplete="off">
                                <TextField id="volume" label="volume" variant="standard"/>
                                <TextField id="dimensions" label="dimensions" variant="standard"/>
                            </Box>
                            <Box sx={{flexGrow: "1"}}>
                                <Button sx={{height: "100%", width: "100%"}} variant="contained"
                                        onClick={() => removeFieldsabws(index)}>Remove row</Button>
                            </Box>
                        </Box>
                    )
                })}
            </form>

            <Box sx={{display: "flex", flexDirection: "row", height: "60px", marginBottom: "10px" }}>
                <Box sx={{flexGrow: "1", paddingRight: "10px"}}>
                    <Button sx={{height: "100%", width: "100%"}} variant="contained" onClick={addFieldsContainer}>Add container row</Button>
                </Box>
                <Box sx={{flexGrow: "7"}}/>
                <Box sx={{flexGrow: "1", paddingRight: "10px", marginLeft: "10px"}}>
                    <Button sx={{height: "100%", width: "100%"}} variant="contained" onClick={addFieldsAbws}>Add abws row</Button>
                </Box>
                <Box sx={{flexGrow: "7"}}/>
                <Box sx={{flexGrow: "1"}}>
                    <Button sx={{height: "100%", width: "100%"}} variant="contained" onClick={submit}>Submit</Button>
                </Box>
            </Box>

        </Box>
    );

}

export default BinPackingForm;
