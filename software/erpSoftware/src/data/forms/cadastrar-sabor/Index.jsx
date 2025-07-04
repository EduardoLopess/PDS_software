import { useState } from 'react'
import '../styles-from/Form-styles.css'
import { postSabor } from '../../../service/api/SaborService'

export const FormCadastrarSabor = () => {

    const [formData, setFormData] = useState({
        nomeSabor: '',
        disponivel: true
    })

    const handleChange = (e) => {
        const {name, value} = e.target

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const sabor = {
            nomeSabor: formData.nomeSabor,
            disponivel: true
        }

        postSabor(formData)
            .then(res => {
                console.log('SABOR CRIADO', res.data)
                setFormData({
                    nomeSabor: ''
                })
            })
            .catch(err => {
                console.error("ERRO AO CRIAR SABOR: ", err)
            })
    }


    return (
        <form onSubmit={handleSubmit}>
            <div className='container-form'>
                <label>Nome sabor: </label>
                <input type='text' placeholder='Nome sabor..' 
                    name='nomeSabor'
                    value={formData.nomeSabor}
                    onChange={handleChange}
                />
                <div className='container-btn'>
                    <button type='submit'>CADASTRAR</button>
                </div>
            </div>
        </form>
    )
}