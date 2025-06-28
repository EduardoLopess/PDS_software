    import { useEffect, useState } from 'react'
    import './Produtos-Screen-Style.css'
    import { PasteisCategoria } from '../../components/produto-categorias/pastel-categoria/PasteisCategoria'
    import { PastelList } from '../../components/produto-categorias/pastel-categoria/PastelList'
    import { CervejaCategoria } from '../../components/produto-categorias/cerveja-categoria/CervejasCategoria'
    import { CervejaItem } from '../../components/produto-categorias/cerveja-categoria/Cerveja'
    import { DrinkCategoria } from '../../components/produto-categorias/drink-categoria/DrinkCategoria'
    import { Drink } from '../../components/produto-categorias/drink-categoria/Drink'
    import { PorcaoCategoria } from '../../components/produto-categorias/porcao-categoria/PorcaoCategoria'
    import { getProdutos } from '../../service/ProdutoService'
    import { PorcaoItem } from '../../components/produto-categorias/porcao-categoria/PorcaoIten'
    import { SemAlcoolCategoria } from '../../components/produto-categorias/semAlcool-categoria/SemAlcoolCategoria'
    import { SemAlcoolItem } from '../../components/produto-categorias/semAlcool-categoria/SemAlcoolItem'
import { AlaMinutaCategoria } from '../../components/produto-categorias/alaminuta-categoria/AlaminutaCategoria'
import { AlaminutaItem } from '../../components/produto-categorias/alaminuta-categoria/AlaminutaItem'

    export const ProdutoScreen = () => {
        const [tituloCategoria, setTituloCategoria] = useState('ESCOLHA UMA CATEGORIA')
        const [ativo, setAtivo] = useState('')
        const [conteudoCategoria, setConteudoCategoria] = useState()
        const [produtos, setProdutos] = useState([])

        useEffect(() => {
            getProdutos()
                .then(res => {
                    console.log('Resposta da API:', res.data);
                    setProdutos(res.data.data); // <-- agora sim, só o array
                })
                .catch(err => console.error('Erro ao buscar produtos', err));
        }, []);


        const filtrarProdutos = (categoria) => {
            const resultado = produtos.filter(p => p.categoriaProduto?.toLowerCase() === categoria.toLowerCase());
            console.log(`Filtrando categoria "${categoria}":`, resultado);
            return resultado;
        }



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
                        <div className='tituloCategoria-produtoScreen'>
                            <h2>{tituloCategoria}</h2>
                        </div>
                        <div className='containerConteudo-produtoScreen'>
                            {conteudoCategoria === 'pastel' && <PastelList
                                produtos={filtrarProdutos('Pasteis')}
                            />}
                            {conteudoCategoria === 'cerveja' && <CervejaItem 
                                produtos={filtrarProdutos('Cerveja')}
                            />}
                            {conteudoCategoria === 'drink' && <Drink 
                                produtos={filtrarProdutos('Drink')}
                            />}
                            {conteudoCategoria === 'porcao' && <PorcaoItem
                                produtos={filtrarProdutos('Porcoes')}
                            />}
                            {conteudoCategoria === 'semAlcool' && <SemAlcoolItem
                                produtos={filtrarProdutos('SemAlcool')}
                            />}
                            {conteudoCategoria === 'alaminuta' && <AlaminutaItem
                                produtos={filtrarProdutos('Alaminuta')}
                            />}
                        </div>
                    </div>

                </div>
            </div>

        )
    }