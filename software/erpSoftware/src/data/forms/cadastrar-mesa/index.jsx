import { useState } from "react"
import { CadastrarMesa } from '../../../service/mesa-service/MesaService'
import '../styles-from/Form-styles.css'

export const FormCadastrarMesa = () => {
    const [numeroMesa, setNumeroMesa] = useState('')
    const [erro, setErro] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(null)

        if (e.value == '') {
            setErro('Informe um número da mesa')
        }

        try {
            // Monta o objeto com campos exatamente como o backend espera
            const data = {
                NumeroMesa: Number(numeroMesa),  // usa Número maiúsculo e converte para number
                StatusMesa: false
            }

            await CadastrarMesa(data)

            alert('Mesa cadastrada com sucesso!')
            setNumeroMesa('')
        } catch (error) {
            console.error("Erro.", error)
            setErro(error.message)
        }
    }



    return (
       
        <div className='container-form' style={{padding: 70}}>
            <button className="buttom-mesa">
                <p>NOVA MESA</p>
            </button>
            <button className="buttom-mesa">
                <p>DELETAR MESA</p>
            </button>
            <button className="buttom-mesa">
                <p>ATUALIZAR MESA</p>
            </button>
        </div>

       
    )
}