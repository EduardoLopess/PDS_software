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
        <div className="container-form-mesa">
            <div className="container-btn-mesa">
                <button>
                    <p>EDITAR MESA</p>
                </button>
                <button>
                    <p>DELETAR MESA</p>
                </button>
            </div>
            <div className="container-form">
                <form onSubmit={handleSubmit}>
                    <div className="container-input">
                        <p>*Número da mesa</p>
                        <input
                            type="text"
                            placeholder="Número da mesa"
                            value={numeroMesa}
                            onChange={(e) => {
                                const onlyNumber = e.target.value.replace(/\D/g, '')
                                setNumeroMesa(onlyNumber)
                            }
                            }
                        />
                    </div>
                    <div className="btn-form">
                        <button type='submit'>Cadastrar</button>
                    </div>
                    {erro && <p style={{ color: 'red' }}>{erro}</p>}

                </form>
            </div>
        </div>
    )
}