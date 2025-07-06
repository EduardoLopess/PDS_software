import { useEffect, useState } from 'react'
import './Produtos-Screen-Style.css'
import { PasteisCategoria } from '../../components/produto-categorias/pastel-categoria/PasteisCategoria'
import { PastelList } from '../../components/produto-categorias/pastel-categoria/PastelList'
import { CervejaCategoria } from '../../components/produto-categorias/cerveja-categoria/CervejasCategoria'
import { CervejaItem } from '../../components/produto-categorias/cerveja-categoria/Cerveja'
import { DrinkCategoria } from '../../components/produto-categorias/drink-categoria/DrinkCategoria'
import { Drink } from '../../components/produto-categorias/drink-categoria/Drink'
import { PorcaoCategoria } from '../../components/produto-categorias/porcao-categoria/PorcaoCategoria'
import { PorcaoItem } from '../../components/produto-categorias/porcao-categoria/PorcaoIten'
import { SemAlcoolCategoria } from '../../components/produto-categorias/semAlcool-categoria/SemAlcoolCategoria'
import { SemAlcoolItem } from '../../components/produto-categorias/semAlcool-categoria/SemAlcoolItem'
import { AlaMinutaCategoria } from '../../components/produto-categorias/alaminuta-categoria/AlaminutaCategoria'
import { AlaminutaItem } from '../../components/produto-categorias/alaminuta-categoria/AlaminutaItem'
import { getProdutos } from '../../service/api/ProdutoService'
import { Carrinho } from '../../components/carrinho/Carrinho'
import { useCarrinho } from '../../context/CarrinhoContext'
import { useLocation } from 'react-router-dom'
import { usePedido } from '../../context/PedidoContext'
import { useApiProduto } from '../../context/apiProdutoContext'

export const ProdutoScreen = () => {
    const { produtoData } = useApiProduto();
    const { numeroMesaContext: numeroMesaPedido } = usePedido();
    console.log("Mesa", numeroMesaPedido)

    const [tituloCategoria, setTituloCategoria] = useState('ESCOLHA UMA CATEGORIA');
    const [ativo, setAtivo] = useState('');
    const [conteudoCategoria, setConteudoCategoria] = useState();

    const filtrarProdutos = (categoria) => {
        return produtoData.filter(p => p.categoriaProduto?.toLowerCase() === categoria.toLowerCase());
    };


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <div className="container-produtosScreen">

                {/* COLUNA ESQUERDA - BOTÕES */}
                <div className='coluna-categorias'>
                    <h3 className='titulo-categorias'>CATEGORIAS</h3>
                    <div className='container-categoria-produtosScreen'>
                        <PasteisCategoria
                            ativo={ativo === 'pastel'}
                            setTituloCategoria={setTituloCategoria}
                            onClick={() => {
                                setAtivo('pastel')
                                setConteudoCategoria('pastel')
                            }}
                        />
                        <CervejaCategoria
                            ativo={ativo === 'cerveja'}
                            setTituloCategoria={setTituloCategoria}
                            onClick={() => {
                                setAtivo('cerveja')
                                setConteudoCategoria('cerveja')
                            }}
                        />
                        <SemAlcoolCategoria
                            ativo={ativo === 'semAlcool'}
                            setTituloCategoria={setTituloCategoria}
                            onClick={() => {
                                setAtivo('semAlcool')
                                setConteudoCategoria('semAlcool')
                            }}
                        />
                        <PorcaoCategoria
                            ativo={ativo === 'porcao'}
                            setTituloCategoria={setTituloCategoria}
                            onClick={() => {
                                setAtivo('porcao')
                                setConteudoCategoria('porcao')
                            }}
                        />
                        <DrinkCategoria
                            ativo={ativo === 'drink'}
                            setTituloCategoria={setTituloCategoria}
                            onClick={() => {
                                setAtivo('drink')
                                setConteudoCategoria('drink')
                            }}
                        />
                        <AlaMinutaCategoria
                            ativo={ativo === 'alaminuta'}
                            setTituloCategoria={setTituloCategoria}
                            onClick={() => {
                                setAtivo('alaminuta')
                                setConteudoCategoria('alaminuta')
                            }}
                        />
                    </div>
                </div>


                <div className='linha' />

                {/* COLUNA DIREITA - CONTEÚDO */}
                <div className='coluna-conteudo'>
                    <div className='container-titulo-carrinho-produtoScreen'>
                        <h2>{tituloCategoria}</h2>
                        <Carrinho />
                    </div>
                    <div className='containerConteudo-produtoScreen'>
                        {conteudoCategoria === 'pastel' && <PastelList
                            numeroMesaPedido={numeroMesaPedido}
                            produtos={filtrarProdutos('Pasteis')}
                        />}
                        {conteudoCategoria === 'cerveja' && <CervejaItem
                            numero={numeroMesaPedido.numero}
                            produtos={filtrarProdutos('Cerveja')}
                        />}
                        {conteudoCategoria === 'drink' && <Drink
                            numeroMesaPedido={numeroMesaPedido.numeroMesa}
                            produtos={filtrarProdutos('Drink')}
                        />}
                        {conteudoCategoria === 'porcao' && <PorcaoItem
                            numeroMesaPedido={numeroMesaPedido.numeroMesa}
                            produtos={filtrarProdutos('Porcoes')}
                        />}
                        {conteudoCategoria === 'semAlcool' && <SemAlcoolItem
                            numeroMesaPedido={numeroMesaPedido}
                            produtos={filtrarProdutos('SemAlcool')}
                        />}
                        {conteudoCategoria === 'alaminuta' && <AlaminutaItem
                            numeroMesaPedido={numeroMesaPedido}
                            produtos={filtrarProdutos('Alaminuta')

                            }
                        />}
                    </div>
                </div>

            </div>
        </div>

    )
}