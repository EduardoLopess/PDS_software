// No seu Carrinho.jsx
import { useState } from "react"
import { IoCartOutline } from "react-icons/io5"
import { useCarrinho } from "../../context/CarrinhoContext" // Certifique-se de que removerAdicionalDoItemCarrinho está sendo exportado
import './Carrinho-Style.css'
import { usePedido } from "../../context/PedidoContext"
import { FormatarTiposProdutosCarrinho } from "../../utils/FormatarTipos"

export const Carrinho = () => {
  // Adicione removerAdicionalDoItemCarrinho aqui
  const { carrinhoVisivel, itemCarrinho, removerItemCarrinho, removerAdicionalDoItemCarrinho, totalItens } = useCarrinho()
  const { numeroMesaContext, criarPedido, cancelarPedido, finalizarPedido } = usePedido()

  const [drawerAberto, setDrawerAberto] = useState(false)
  console.log("Carrinho itens:\n", JSON.stringify(itemCarrinho, null, 2))

  const [expandedItemId, setExpandedItemId] = useState(null);

  // Função para alternar a visibilidade dos adicionais de um item
  const toggleAdicionais = (itemId) => {
    setExpandedItemId(prevId => prevId === itemId ? null : itemId);
  };

  if (!carrinhoVisivel) return null

  return (
    <>
      <div className="container-carrinho">
        <button onClick={() => setDrawerAberto(true)} className="botao-carrinho">
          <IoCartOutline size={40} />
        </button>
      </div>

      {/* Backdrop */}
      {drawerAberto && <div className="carrinho-backdrop" onClick={() => setDrawerAberto(false)} />}

      {/* Drawer */}
      <div className={`carrinho-drawer ${drawerAberto ? 'aberto' : ''}`}>
        <div className="cabecalho-carrinho">
          <h2>PEDIDO MESA: {numeroMesaContext.numero}</h2>
          <button onClick={() => setDrawerAberto(false)} className="btn-fechar">✕</button>
        </div>

        <div className="conteudo-carrinho">
          {itemCarrinho.length > 0 ? (
            itemCarrinho.map((item) => ( // Removi 'index' se 'item.id' for único
              // Use o 'id' do item para o key, é mais robusto
              <div key={item.id + (item.idSabor || '')} className="container-itemDrawer">
                <div className="container-itemDrawer-itemPrincipal">
                  <div className="itemTipoProduto-itemDrawer">
                    <p>{FormatarTiposProdutosCarrinho(item.tipo)}</p>
                  </div>
                  <div className="itemNome-itemDrawer">
                    <p>{item.nome}</p>
                    {item.sabor && (
                      <p style={{ fontSize: 12, fontWeight: 'bold' }}>SABOR: {item.sabor}</p>
                    )}
                  </div>
                  <div className="itemPreco-itemDrawer">
                    <p>R$: {item.preco}</p>
                  </div>
                  <div className="itemQtd-itemDrawer">
                    <p>{item.qtd}x</p>
                  </div>
                  <div className="btnRemover-itemDrawer">
                    <button
                      onClick={() =>
                        removerItemCarrinho(
                          item.id,
                          item.categoria,
                          item.idSabor,         
                          item.adicionaisKey || '' 
                        )
                      }
                    >
                      -
                    </button>

                  </div>
                </div>

                {/* NOVO: Botão para expandir/colapsar adicionais */}
                {item.adicionais && item.adicionais.length > 0 && (
                  <div className="adicionais-toggle-container">
                    <button
                      className="adicionais-toggle-btn"
                      onClick={() => toggleAdicionais(item.id + (item.idSabor || ''))} // Use uma chave única para o item
                    >
                      {expandedItemId === (item.id + (item.idSabor || '')) ? 'Esconder Adicionais ▲' : 'Ver Adicionais ▼'}
                    </button>
                  </div>
                )}

                {/* Renderizar adicionais APENAS se o item estiver expandido */}
                {item.adicionais && item.adicionais.length > 0 && expandedItemId === (item.id + (item.idSabor || '')) && (
                  <div className="container-adicionais-itemDrawer expanded"> {/* Adicione a classe 'expanded' para CSS */}
                    {item.adicionais.map(adicional => (
                      <div key={adicional.id} className="itemAdicional-itemDrawer">
                        <p style={{ fontSize: 14 }}>+ {adicional.adicionalNome} ({adicional.quantidade}x)</p>
                        <p style={{ fontSize: 14 }}>R$: {adicional.precoAdicionalFormatado}</p>
                        <button
                          className="btnRemoverAdicional-itemDrawer"
                          onClick={() => removerAdicionalDoItemCarrinho(item.id, adicional.id, item.adicionaisKey)}
                        >
                          - Adicional
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Nenhum item no carrinho ainda.</p>
          )}

          <div className="container-total-drawer">
            {totalItens > 0 && (
              <p>TOTAL - R$: {totalItens.toFixed(2)}</p>
            )}
          </div>
        </div>

        <div className="rodape-carrinho">
          <button onClick={() => cancelarPedido()} className="btn-finalizar">CANCELAR</button>
          <button onClick={() => finalizarPedido()} className="btn-finalizar" style={{ background: 'green' }}>FINALIZAR</button>
        </div>
      </div>
    </>
  );
};


