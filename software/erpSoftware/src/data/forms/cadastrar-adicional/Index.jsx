import { useState } from 'react'
import '../styles-from/Form-styles.css'
import { postAdicional } from '../../../service/api/AdicionalService'

export const FormCadastrarAdicional = () => {
    const [formData, setFormData] = useState({
        adicionalNome: '',
        precoAdicional: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const adicional = {
            adicionalNome: formData.adicionalNome,
            precoAdicional: parseFloat(formData.precoAdicional.replace(',', '.'))
        }

        postAdicional(formData)
            .then(res => {
                console.log('ADICIONAL CRIADO', res.data)
                setFormData({
                    adicionalNome: '',
                    precoAdicional: ''
                    
                })
            })
            .catch(err => {
                console.error("ERRO AO CADASTRAR ADICIONAL.", err)
            })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='container-form' style={{ padding: 70 }}>

                <label>Nome do adicional: </label>
                <input
                    type='text'
                    placeholder='Nome...'
                    required
                    name="adicionalNome"
                    value={formData.adicionalNome}
                    onChange={(e) => {
                        const apenasLetras = e.target.value.replace(/[0-9]/g, '')
                        handleChange({ target: { name: 'adicionalNome', value: apenasLetras } })
                    }}
                />

                <label>Valor adicional: </label>
                <input
                    type='text'
                    placeholder='R$: '
                    required
                    name="precoAdicional"
                    value={formData.precoAdicional}
                    onChange={(e) => {
                        const onlyNumbers = e.target.value
                            .replace(',', '.')
                            .replace(/[^0-9.]/g, '')
                            .replace(/(\..*)\./g, '$1');
                        handleChange({ target: { name: 'precoAdicional', value: onlyNumbers } })
                    }}
                />

                <div className='container-btn'>
                    <button type='submit'>CADASTRAR</button>
                </div>

            </div>
        </form>
    )
}
