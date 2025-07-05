import { useEffect, useState } from 'react'
import { BtnAlaminutaVenda } from '../../components/btn-categoria-venda/BtnAlaminutaScreenVenda'
import { BtnCervejaVenda } from '../../components/btn-categoria-venda/BtnCervejaScreenVenda'
import { BtnDrinkVenda } from '../../components/btn-categoria-venda/BtnDrinkScreenVenda'
import { BtnPastelVenda } from '../../components/btn-categoria-venda/BtnPastelScreenVenda'
import { BtnPorcaoVenda } from '../../components/btn-categoria-venda/BtnPorcaoScreenVenda'
import { BtnSemAlcoolVenda } from '../../components/btn-categoria-venda/BtnSemAlcoolScreenVenda'
import './Venda-Screen-Style.css'
import Modal from 'react-modal';
import './Modal-Venda-Screen-Style.css'

import { getProdutos } from '../../service/api/ProdutoService'

// Importa os componentes de lista de produtos
import { PastelList } from '../../components/produto-categorias/pastel-categoria/PastelList'
import { CervejaItem } from '../../components/produto-categorias/cerveja-categoria/Cerveja'
import { Drink } from '../../components/produto-categorias/drink-categoria/Drink'
import { PorcaoItem } from '../../components/produto-categorias/porcao-categoria/PorcaoIten'
import { SemAlcoolItem } from '../../components/produto-categorias/semAlcool-categoria/SemAlcoolItem'
import { AlaminutaItem } from '../../components/produto-categorias/alaminuta-categoria/AlaminutaItem'

export const VendaScreen = () => {
    const [tituloCategoria, setTituloCategoria] = useState('')
    const [ativo, setAtivo] = useState('')
    const [produtos, setProdutos] = useState([])

    const [modalBtnMaisVisivel, setModalBtnMaisVisivel] = useState(false)

    useEffect(() => {
        getProdutos()
            .then(res => {
                setProdutos(res.data.data)
            })
            .catch(err => {
                console.error('Erro ao buscar produtos:', err)
            })
    }, [])

    const filtrarProdutos = (categoria) => {
        return produtos.filter(p => p.categoriaProduto?.toLowerCase() === categoria.toLowerCase());
    }

    const fecharModalBtnMais = () => setModalBtnMaisVisivel(false)
    const abrirModalBtnMais = () => setModalBtnMaisVisivel(true)

    const renderModalBtnMais = () => (
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

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <div className="container-vendaScreen">
                {/* Lado esquerdo: botões de categorias e conteúdo */}
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

                        <div className=''>
                            {ativo === 'pastel' && <PastelList produtos={filtrarProdutos('Pasteis')} />}
                            {ativo === 'cerveja' && <CervejaItem produtos={filtrarProdutos('Cerveja')} />}
                            {ativo === 'drink' && <Drink produtos={filtrarProdutos('Drink')} />}
                            {ativo === 'porcao' && <PorcaoItem produtos={filtrarProdutos('Porcoes')} />}
                            {ativo === 'semAlcool' && <SemAlcoolItem produtos={filtrarProdutos('SemAlcool')} />}
                            {ativo === 'alaminuta' && <AlaminutaItem produtos={filtrarProdutos('Alaminuta')} />}
                        </div>
                    </div>
                </div>

                <div className='linha' />

                {/* Lado direito: carrinho e ações */}
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
                            <button className='btn-direita' style={{ background: 'rgb(94, 93, 90)' }} onClick={abrirModalBtnMais}>
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
