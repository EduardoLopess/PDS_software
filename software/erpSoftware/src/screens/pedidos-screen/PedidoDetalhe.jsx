import { FormatarTiposProdutosCarrinho } from '../../utils/FormatarTipos';
import './PedidoDetalhes-Styles.css';
import { useState } from 'react';

export const PedidoDetalhe = ({ pedidoSelecionado }) => {
    console.log("Pedido selecionado", pedidoSelecionado);

    const itensDoPedido = pedidoSelecionado?.itens || [];


    const [adicionaisVisiveis, setAdicionaisVisiveis] = useState({});

    const toggleAdicionais = (itemId) => {
        setAdicionaisVisiveis(prevState => ({
            ...prevState,
            [itemId]: !prevState[itemId]
        }));
    };

    return (
        <div>
            {itensDoPedido.length > 0 ? (
                itensDoPedido.map((item, index) => (
                    <div key={item.id || index} className="containerItem-pedidoDetalhes">
                        <div className="tipoItem-pedidoDetalhe">
                            <p>{item.produto.categoriaProduto}</p>
                            <p>{FormatarTiposProdutosCarrinho(item.produto.tipoProduto)}</p>
                        </div>
                        <div className="nomeItem-pedidoDetalhe">
                            <p>{item.produto.nomeProduto}</p>
                            {item.saborDrink && (
                                <p style={{ fontSize: 12, marginTop: 2 }}>SABOR: {item.saborDrink.nomeSabor}</p>
                            )}
                        </div>
                        <div className='precoItem-pedidoDetalhe'>
                            <p>R$: {item.produto.precoProdutoFormatado}</p>
                        </div>

                     
                        <div className='qtd-toggle-group'>
                            <div className='qtdItem-pedidoDetalhe'>
                                <p>Qtd: {item.qtd}x </p>
                            </div>
                         
                            {item.adicionais && item.adicionais.length > 0 && (
                                <button
                                    className="toggle-adicionais-btn"
                                    onClick={() => toggleAdicionais(item.id)}
                                >
                                    {adicionaisVisiveis[item.id] ? 'Ocultar' : 'Adicionais'}
                                </button>
                            )}
                        </div>

                       
                        {item.adicionais && item.adicionais.length > 0 && adicionaisVisiveis[item.id] && (
                            <div className="adicionais-section-expandable">
                                <p className="adicionais-list">
                                    Adicionais: {item.adicionais.map((adc) => (
                                        <div className='containerAdc-pedidoDetalhe'>
                                            <div className='nomeAdc-pedidoDetalhe'>
                                                <p>{adc.adicionalNome}</p>
                                            </div>
                                            <div>
                                                <p>{adc.qtd}</p>
                                            </div>
                                            <div className='precoAdc-pedidoDetalhe'>
                                                <p>R$: {adc.precoAdicionalFormatado}</p>
                                            </div>
                                        </div>
                                    ))}
                                </p>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>PEDIDO VAZIO</p>
            )}
        </div>
    );
};