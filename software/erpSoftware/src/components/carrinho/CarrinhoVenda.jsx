// Arquivo: CarrinhoVenda.jsx

import { useState } from 'react';
import { useCarrinhoVenda } from '../../context/CarrinhoVendaContext';
import { FormatarTiposProdutosCarrinho } from '../../utils/FormatarTipos';
import './CarrinhoVenda-Style.css';

export const CarrinhoVenda = () => {
    const { totalCarrinho, itensCarrinhoVenda, removerItemVenda, removerAdicionalDoItemCarrinhoVenda } = useCarrinhoVenda();
    const [expandedProductId, setExpandedProductId] = useState(null);

    const toggleAdicionais = (productId) => {
        setExpandedProductId(prevId => prevId === productId ? null : productId);
    };

    return (
        <div className="container-carrinhoVenda">
            {itensCarrinhoVenda.length > 0 ? (
                itensCarrinhoVenda.map((item) => {
                    const itemRenderKey = item.id + (item.idSabor || '') + (item.adicionaisKey || '');
                    const toggleKey = item.id + (item.idSabor || '');

                    return (
                        <div key={itemRenderKey} className='containerItem-carrinhoVenda'>
                            <div className="container-itemPrincipal-venda"> 
                                <div className='tipoItem-carrinhoVenda'>
                                    <p>{FormatarTiposProdutosCarrinho(item.tipo)}</p>
                                </div>
                                <div className='nomeItem-carrinhoVenda'>
                                    <p>{item.nome}</p>
                                    {item.sabor && (
                                        <p style={{ fontSize: 10, marginTop: 3, fontWeight: 'bold' }}>SABOR: {item.sabor}</p>
                                    )}
                                </div>
                                <div className='precoItem-carrinhoVenda'>
                                    <p>R$: {item.preco}</p>
                                </div>
                                <div className='qtdItem-carrinhoVenda'>
                                    <p>{item.qtd}x</p>
                                </div>
                                <div className='btnRemover-carrinhoVenda'
                                    onClick={() => removerItemVenda(
                                        item.id,
                                        item.categoria,
                                        item.idSabor,
                                        item.adicionaisKey || '')}>
                                    <button>-</button>
                                </div>
                            </div>

                            {item.adicionais && item.adicionais.length > 0 && (
                                <div className="adicionais-toggle-container-venda">
                                    <button
                                        className="adicionais-toggle-btn-venda"
                                        onClick={() => toggleAdicionais(toggleKey)}
                                    >
                                        {expandedProductId === toggleKey ? 'Esconder ▲' : 'Adicionais ▼'}
                                    </button>
                                </div>
                            )}

                            {item.adicionais && item.adicionais.length > 0 && expandedProductId === toggleKey && (
                                <div className='container-adicionais-itemDrawer-venda expanded'>
                                    {item.adicionais.map(adicional => (
                                        <div key={adicional.id} className="itemAdicional-itemDrawer-venda"> 
                                            {/* NOVO: Envolva o nome e o preço para alinhamento */}
                                            <div className="adicional-info-venda">
                                                <p style={{ fontSize: 14 }}>+ {adicional.adicionalNome}</p>
                                                <p style={{ fontSize: 14 }}>({adicional.quantidade}x)</p>
                                                <p style={{ fontSize: 14 }}>R$: {adicional.precoAdicionalFormatado}</p>
                                            </div>
                                            <button
                                                className="btnRemoverAdicional-itemDrawer-venda"
                                                onClick={() => removerAdicionalDoItemCarrinhoVenda(
                                                    item.id,
                                                    adicional.id,
                                                    item.adicionaisKey
                                                )}
                                            >
                                                - Adicional
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <p>CARRINHO VAZIO</p>
            )}

            <div className='totalItem-carrinhoVenda'>
                <p>TOTAL: R$: {totalCarrinho.toFixed(2)}</p>
            </div>
        </div>
    );
};