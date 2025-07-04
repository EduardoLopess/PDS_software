import { useState } from 'react'
import { BtnAlaminutaVenda } from '../../components/btn-categoria-venda/BtnAlaminutaScreenVenda'
import { BtnCervejaVenda } from '../../components/btn-categoria-venda/BtnCervejaScreenVenda'
import { BtnDrinkVenda } from '../../components/btn-categoria-venda/BtnDrinkScreenVenda'
import { BtnPastelVenda } from '../../components/btn-categoria-venda/BtnPastelScreenVenda'
import { BtnPorcaoVenda } from '../../components/btn-categoria-venda/BtnPorcaoScreenVenda'
import { BtnSemAlcoolVenda } from '../../components/btn-categoria-venda/BtnSemAlcoolScreenVenda'
import './Venda-Screen-Style.css'
import Modal from 'react-modal';
import './Modal-Venda-Screen-Style.css'

export const VendaScreen = () => {
    const [tituloCategoria, setTituloCategoria] = useState('')
    const [ativo, setAtivo] = useState('')

    const [modalBtnMaisVisivel, setModalBtnMaisVisivel] = useState(false)
    const [modalPagamentoVisivel, setModalPagamentoVisivel] = useState(false)

    const fecharModalBtnMais = () => setModalBtnMaisVisivel(false)
    const abrirModalBtnMais = () => setModalBtnMaisVisivel(true)

    const fecharModalPagamento = () => setModalPagamentoVisivel(false)

    const renderModalBtnMais = () => {
        return (
            <Modal
                isOpen={modalBtnMaisVisivel}
                onRequestClose={fecharModalBtnMais}
                className='container-modal-btnMais'
                style={{
                    overlay: {
                        backgroundColor: 'transparent',
                    }
                }}

            >
                <div>
                    <button>
                        <p>DESCONTO</p>
                    </button>
                    <button>
                        <p>EDITAR</p>
                    </button>

                </div>

            </Modal>
        )
    }

    const renderModalPagamento = () => {

    }




    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <div className="container-vendaScreen">
                <div className='container-esquerda-vendaScreen'>
                    <div className='container-btn-categorias-vendaScreen'>
                        <BtnPastelVenda
                            ativo={ativo === 'pastel'}
                            setTituloCategoria={setTituloCategoria}
                            onClick={() => setAtivo('pastel')}
                        />
                        <BtnCervejaVenda
                            ativo={ativo === 'cerveja'}
                            setTituloCategoria={setTituloCategoria}
                            onClick={() => setAtivo('cerveja')}
                        />
                        <BtnDrinkVenda
                            ativo={ativo === 'drink'}
                            setTituloCategoria={setTituloCategoria}
                            onClick={() => setAtivo('drink')}
                        />
                        <BtnSemAlcoolVenda
                            ativo={ativo === 'semAlcool'}
                            setTituloCategoria={setTituloCategoria}
                            onClick={() => setAtivo('semAlcool')}
                        />
                        <BtnPorcaoVenda
                            ativo={ativo === 'porcao'}
                            setTituloCategoria={setTituloCategoria}
                            onClick={() => setAtivo('porcao')}
                        />
                        <BtnAlaminutaVenda
                            ativo={ativo === 'alaminuta'}
                            setTituloCategoria={setTituloCategoria}
                            onClick={() => setAtivo('alaminuta')}
                        />
                    </div>

                    <div className='container-conteudoBtn-vendaScreen'>
                        <div className='container-titulo-conteudoBtn'>
                            <h2>{tituloCategoria}</h2>
                        </div>
                    </div>

                </div>
                <div className='linha' />

                <div className='container-direita-vendaScreen'>
                    <div className='container-titulo-carrinho'>
                        <h2>CARRINHO</h2>
                    </div>
                    <div className='container-conteudo-direita'>
                        <div className='container-btn-conteudo-direita'>
                            <button className='btn-direita' style={{ background: '#E90000' }}>
                                <p>CANCELAR VENDA</p>
                            </button>
                            <button className='btn-direita' style={{ background: 'green' }}>
                                <p>COBRAR</p>
                            </button>
                            <button className='btn-direita' style={{ background: 'blue' }}>
                                <p>DIVIDIR</p>
                            </button>
                            <button className='btn-direita' style={{ background: 'rgb(94, 93, 90' }}>
                                <p>MAIS</p>
                            </button>
                        </div>
                        {renderModalBtnMais()}


                    </div>
                </div>
            </div>
        </div>
    )
}