import { useEffect, useState } from 'react'
import { BtnAlaminutaVenda } from '../../components/btn-categoria-venda/BtnAlaminutaScreenVenda'
import { BtnCervejaVenda } from '../../components/btn-categoria-venda/BtnCervejaScreenVenda'
import { BtnDrinkVenda } from '../../components/btn-categoria-venda/BtnDrinkScreenVenda'
import { BtnPastelVenda } from '../../components/btn-categoria-venda/BtnPastelScreenVenda'
import { BtnPorcaoVenda } from '../../components/btn-categoria-venda/BtnPorcaoScreenVenda'
import { BtnSemAlcoolVenda } from '../../components/btn-categoria-venda/BtnSemAlcoolScreenVenda'
import './Venda-Screen-Style.css'
import Swal from 'sweetalert2';

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
import { CarrinhoVenda } from '../../components/carrinho/CarrinhoVenda'
import { useCarrinhoVenda } from '../../context/CarrinhoVendaContext'

export const VendaScreen = () => {
    const [tituloCategoria, setTituloCategoria] = useState('')
    const [ativo, setAtivo] = useState('')
    const [produtos, setProdutos] = useState([])
    // Novo estado para controlar a expansão do botão "MAIS"
    const [showMoreButtons, setShowMoreButtons] = useState(false)

    const { iniciarVenda, iniciarNovaVenda, cancelarVenda } = useCarrinhoVenda()


    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

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

    const venda = () => {
        Swal.fire({
            title: 'Iniciar venda?',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não'
        }).then(async (result) => {
            if (result.isConfirmed) {
                iniciarNovaVenda()
                Toast.fire({
                    icon: 'success',
                    title: 'Venda iniciada'
                });
            }
        });
        return
    }

    const cancelar = () => {
        Swal.fire({
            title: 'Cancelar venda?',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não'
        }).then(async (result) => {
            if (result.isConfirmed) {
                cancelarVenda()
            }
        });
        return
    }

    // Função para alternar a visibilidade dos botões "MAIS"
    const toggleMoreButtons = () => {
        setShowMoreButtons(!showMoreButtons)
    }

    // Função dummy para o modal de divisão (se você tiver uma)
    const abrirModalDivisao = () => {
        alert('Funcionalidade de dividir ainda não implementada.');
    };


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
                        <div className=''>
                            <div className='container-titulo-conteudoBtn'>
                                <h2>{tituloCategoria}</h2>
                            </div>
                            {iniciarVenda ? (
                                <>
                                    {ativo === 'pastel' && <PastelList iniciarVenda={iniciarVenda} produtos={filtrarProdutos('Pasteis')} />}
                                    {ativo === 'cerveja' && <CervejaItem iniciarVenda={iniciarVenda} produtos={filtrarProdutos('Cerveja')} />}
                                    {ativo === 'drink' && <Drink iniciarVenda={iniciarVenda} produtos={filtrarProdutos('Drink')} />}
                                    {ativo === 'porcao' && <PorcaoItem iniciarVenda={iniciarVenda} produtos={filtrarProdutos('Porcoes')} />}
                                    {ativo === 'semAlcool' && <SemAlcoolItem iniciarVenda={iniciarVenda} produtos={filtrarProdutos('SemAlcool')} />}
                                    {ativo === 'alaminuta' && <AlaminutaItem iniciarVenda={iniciarVenda} produtos={filtrarProdutos('Alaminuta')} />}
                                </>
                            ) : (
                                <p>Inicie uma venda para ver os produtos.</p>
                            )}

                        </div>
                    </div>
                </div>

                <div className='linha' />

                <div className='container-direita-vendaScreen'>
                    <div className='container-titulo-carrinho'>
                        <h2>CARRINHO</h2>
                    </div>
                    <div className='container-conteudo-direita'>
                        <div className='container-carrinhoVenda'>
                            <CarrinhoVenda />
                        </div>

                        <div className='container-btn-conteudo-direita'>
                            {iniciarVenda ? (
                                <button className='btn-direita' style={{ background: '#E90000' }} onClick={cancelar}>
                                    <p>CANCELAR VENDA</p>
                                </button>
                            ) : (
                                <button className='btn-direita' style={{ background: 'yellow' }} onClick={venda}>
                                    <p>INICIAR VENDA</p>
                                </button>
                            )}

                            <button className='btn-direita' style={{ background: 'green' }}>
                                <p> $ COBRAR</p>
                            </button>
                            <button className='btn-direita' style={{ background: 'blue' }} onClick={abrirModalDivisao}>
                                <p> % DIVIDIR</p>
                            </button>

                            <button className='btn-direita more-button' style={{ background: 'rgb(94, 93, 90)' }} onClick={toggleMoreButtons}>
                                <p> ! MAIS</p>
                            </button>

                            {showMoreButtons && (
                                <div className="expanded-buttons-container">
                                    <button className='btn-direita expanded-button' style={{ background: 'purple' }}>
                                        <p> SALVAR PEDIDO</p>
                                    </button>
                                    <button className='btn-direita expanded-button' style={{ background: 'orange' }}>
                                        <p>% DESCONTO</p>
                                    </button>
                                    <button className='btn-direita expanded-button' style={{ background: 'brown' }}>
                                        <p>OBSERVAÇÕES</p>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}