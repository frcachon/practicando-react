import { useState } from 'react';
import axios from 'axios';
import {Box} from "@mui/material";
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
        <Box className={styles.formBox}>
            <form>
                <select id="plane-type" value={planeType} onChange={handlePlaneTypeChange}>
                    <option value="" disabled selected>Select your option</option>
                    <option value="type1">Type 1</option>
                    <option value="type2">Type 2</option>
                    <option value="type3">Type 3</option>
                </select>
                {formFields.map((form, index) => {
                    return (
                        <div key={index}>
                            <select name='container_type'
                                    onChange={event => handleFormChange(event, index)}
                                    value={form.container_type}>
                                <option value="" disabled selected>Select your option</option>
                                <option value="type1">Type 1</option>
                                <option value="type2">Type 2</option>
                                <option value="type3">Type 3</option>
                            </select>
                            <input
                                name='weight'
                                placeholder='Weight'
                                onChange={event => handleFormChange(event, index)}
                                value={form.weight}
                                type='number'
                                min="1"
                            />
                            <button onClick={() => removeFields(index)}>Remove row</button>
                        </div>
                    )
                })}
            </form>
            <span>{message}</span>
            <button onClick={addFields}>Add row</button>
            <br />
            <button onClick={submit}>Submit</button>
        </Box>
    );
}

export default ContainerForm;