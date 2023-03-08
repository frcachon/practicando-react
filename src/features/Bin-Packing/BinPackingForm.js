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
        const awbNumberIsValid= abwsFields.every(item=> item.awb_number!== '' && Number(item.awb_number) > 0) //tiene q ser unico
        const isBulkContainer = containerFields.some(item => item.container_type === 'BULK');

        //falta ahcer los chekeos de datos
        //uld_identifiers-If the type is  SSPD, this parameter must be sent. If the type is BULK, BUP or null, it should NOT be passed.
        //dimensions-If the type is BULK or null, this parameter must be sent. If the type is BUP or SSPD, it should NOT be passed.

        if (!configIsValid) {
            setMessage("Weight must be positive.")
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
            abws: abwsFields
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

    const handleConfigChange = (event, index) => {
        let data = [...containerFields];
        data[index]["weight"] = event.target.value;
        setContainerFields(data);
    }

    return (
            <Box>
                <form>
                    <Box component="form" sx={{'& > :not(style)': {m: 1, width: '25ch'},}}
                         noValidate
                         autoComplete="off"
                    >
                        <TextField id="flight-weight-capacity" label="Flight-Weight-Capacity" variant="standard"/>
                    </Box>
                    {containerFields.map((form, index) => {
                        return (
                            <Box className={styles.formBox} key={index}>
                                <Box sx={{flexGrow: "12", paddingRight: "10px"}}>
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
                                <Box sx={{flexGrow: "6", paddingRight: "10px"}}>
                                    <TextField
                                        name='config'
                                        placeholder='config'
                                        onChange={event => handleConfigChange(event, index)}
                                        value={form.config}
                                        type='number'
                                        min="1"
                                        sx={{height: "100%", width: "100%"}}
                                        variant="outlined"
                                    />
                                </Box>
                                <Box sx={{flexGrow: "1"}}>
                                    <Button sx={{height: "100%", width: "100%"}} variant="contained"
                                            onClick={() => removeFieldsContainer(index)}>Remove row</Button>
                                </Box>
                            </Box>
                        )
                    })}
                    {abwsFields.map((form, index1) => {
                        return (
                            <Box className={styles.formBox} key={index1}>
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
                                            onClick={() => removeFieldsabws(index1)}>Remove row</Button>
                                </Box>
                            </Box>
                        )
                    })}
                </form>
                {(message !== "") ?
                    <Box component="span" sx={{display: 'block', paddingTop: "10px", paddingBottom: "20px"}}>
                        {message}</Box> : <Box/>}

                <Box sx={{display: "flex", flexDirection: "row", height: "60px"}}>

                    <Box sx={{flexGrow: "1", paddingRight: "10px"}}>
                        <Button sx={{height: "100%", width: "100%"}} variant="contained" onClick={addFieldsContainer()}>Add
                            container row</Button>

                        <Button sx={{height: "100%", width: "100%"}} variant="contained" onClick={addFieldsAbws()}>Add
                            abws row</Button>
                    </Box>
                    <Box sx={{flexGrow: "7"}}/>
                    <Box sx={{flexGrow: "1"}}>
                        <Button sx={{height: "100%", width: "100%"}} variant="contained"
                                onClick={submit}>Submit</Button>
                    </Box>
                </Box>

            </Box>
        );

    }

export default BinPackingForm;

