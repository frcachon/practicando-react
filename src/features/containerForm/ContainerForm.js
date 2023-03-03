import { useState } from 'react';
import axios from 'axios';
import * as uuid from "uuid";

function ContainerForm() {

    const [message, setMessage] = useState('');
    const [formFields, setFormFields] = useState([
        { profit: '', weight: '', type: ''},
    ])

    const handleFormChange = (event, index) => {
        let data = [...formFields];
        data[index][event.target.name] = event.target.value;
        setFormFields(data);
    }

    const submit = async (e) => {
        e.preventDefault();
        const profitIsValid = formFields.every(item => item.profit > 0)
        const weightIsValid = formFields.every(item => item.weight > 0)
        const typeIsSelected = formFields.every(item => item.type !== "")
        if (!weightIsValid || !profitIsValid) {
            setMessage("Verifique que los campos profit y weight siempre sean mayores a cero.")
            return;
        }
        if (!typeIsSelected) {
            setMessage("Seleccione tipo.")
            return;
        }

        const request = {
            id: uuid.v4(),
            containers: formFields
        }

        try {
            const response = await axios.post('http://localhost:3004/containers', request)
            setFormFields([
                { profit: '', weight: '', type: ''},
            ])
            console.log(response.status)

        } catch (error) {
            console.log(error.message)
        }
    }

    const addFields = () => {
        let object = {
            profit: '',
            weight: '',
            type: ''
        }

        setFormFields([...formFields, object])
    }

    const removeFields = (index) => {
        let data = [...formFields];
        data.splice(index, 1)
        setFormFields(data)
    }

    return (
        <div className="App">
            <form onSubmit={submit}>
                {formFields.map((form, index) => {
                    return (
                        <div key={index}>
                            <span>Agrague containers</span>
                            <input
                                name='profit'
                                placeholder='Profit'
                                onChange={event => handleFormChange(event, index)}
                                value={form.profit}
                                type='number'
                                min="1"
                            />
                            <input
                                name='weight'
                                placeholder='Weight'
                                onChange={event => handleFormChange(event, index)}
                                value={form.weight}
                                type='number'
                                min="1"
                            />
                            <select name='type'
                                    onChange={event => handleFormChange(event, index)}
                                    value={form.type}>
                                <option></option>
                                <option value="type1">Type 1</option>
                                <option value="type2">Type 2</option>
                                <option value="type3">Type 3</option>
                            </select>
                            <button onClick={() => removeFields(index)}>Remove</button>
                        </div>
                    )
                })}
            </form>
            <span>{message}</span>
            <button onClick={addFields}>Add More..</button>
            <br />
            <button onClick={submit}>Submit</button>
        </div>
    );
}

export default ContainerForm;