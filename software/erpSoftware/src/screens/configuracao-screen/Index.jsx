import { useState } from "react"
import { BtnCriarAdicional } from "../../components/btn-configuracao/btnAdd-adicional"
import { BtnCriarMesa } from "../../components/btn-configuracao/btnAdd-mesa"
import { BtnCriarProduto } from "../../components/btn-configuracao/btnAdd-produto"
import { BtnCriarSaborDrink } from "../../components/btn-configuracao/btnAdd-saborDrink"
import './Config-Screen-Styles.css'
import { FormCadastrarMesa } from "../../data/forms/cadastrar-mesa"
import { FormCadastrarProduto } from "../../data/forms/cadastrar-produto/Infex"
import { FormCadastrarAdicional } from "../../data/forms/cadastrar-adicional/Index"
import { FormCadastrarSabor } from "../../data/forms/cadastrar-sabor/Index"

export const ConfiguracaoScreen = () => {
    const [titulo, setTitulo] = useState('')
    const [ativo, setAtivo] = useState(false)
    const [formAtivo, setFormAtivo] = useState(false)

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10}}>
            <div className="container-configScreen">
                <div className="container-btn-configScreen">
                    <BtnCriarAdicional
                        ativo={ativo == 'adicional'}
                        setTitulo={setTitulo}
                        onClick={() => {
                            setAtivo('adicional')
                            setFormAtivo('adicionalForm')
                        }}
                    />
                    <BtnCriarMesa
                        ativo={ativo == 'mesa'}
                        onClick={() => {
                            setAtivo('mesa')
                            setFormAtivo('mesaForm')
                        
                        }}
                        setTitulo={setTitulo}
                        
                    />
                    <BtnCriarProduto
                        ativo={ativo == 'produto'}
                        onClick={() => {
                            setAtivo('produto')
                            setFormAtivo('produtoForm')
                        }}
                        setTitulo={setTitulo}   
                    />
                    <BtnCriarSaborDrink
                        ativo={ativo == 'sabor'}
                         onClick={() => {
                            setAtivo('sabor')
                            setFormAtivo('saborForm')
                        }}
                        setTitulo={setTitulo}
                    />
                </div>

                <div className="container-conteudo-configScreen">
                    <div className="div-title-configScreen">
                        <div className="div-linha"/>
                        <h3>{titulo}</h3>
                        <div className="div-linha"/>
                    </div>
                    <div className="div-form-configScreen">
                        {formAtivo == 'mesaForm' && <FormCadastrarMesa/>}
                        {formAtivo == 'adicionalForm' && <FormCadastrarAdicional/>}
                        {formAtivo == 'produtoForm' && <FormCadastrarProduto/>}
                        {formAtivo == 'saborForm' && <FormCadastrarSabor/>}
                        

                    </div>

                </div>

            </div>
        </div>
       
    )
}