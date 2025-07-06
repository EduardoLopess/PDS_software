import { useState } from "react"
import { IoCartOutline } from "react-icons/io5"
import { useCarrinho } from "../../context/CarrinhoContext"
import './Carrinho-Style.css'
import { usePedido } from "../../context/PedidoContext"
import { FormatarTiposProdutosCarrinho } from "../../utils/FormatarTipos"

export const Carrinho = () => {
  const { carrinhoVisivel, itemCarrinho, removerItemCarrinho, totalItens } = useCarrinho()
  const { numeroMesaContext, finalizarPedido, cancelarPedido } = usePedido()

  const [drawerAberto, setDrawerAberto] = useState(false)

  console.log("ITEM CARRINHO: ", itemCarrinho)

  if (!carrinhoVisivel) return null

  return (
    <>
      {/* Botão que abre o carrinho */}
      <div className="container-carrinho">
        <button onClick={() => setDrawerAberto(true)} className="botao-carrinho">
          <IoCartOutline size={40} />
        </button>
      </div>

      {/* Backdrop (fundo escuro) */}
      {drawerAberto && <div className="carrinho-backdrop" onClick={() => setDrawerAberto(false)} />}

      {/* Drawer */}
      <div className={`carrinho-drawer ${drawerAberto ? 'aberto' : ''}`}>
        <div className="cabecalho-carrinho">
          <h2>PEDIDO MESA: {numeroMesaContext}</h2>

          <button onClick={() => setDrawerAberto(false)} className="btn-fechar">✕</button>
        </div>
        <div className="conteudo-carrinho">
          {itemCarrinho.length > 0 ? (
            itemCarrinho.map((item, index) => (
              <div key={index} className="container-itemDrawer">
                <div className="itemTipoProduto-itemDrawer">
                  <p>{FormatarTiposProdutosCarrinho(item.tipo)}</p>
                </div>
                <div className="itemNome-itemDrawer">
                  <p>{item.nome}</p>
                  {item.sabor && (
                    <p style={{fontSize: 12, fontWeight: 'bold'}}>SABOR: {item.sabor}</p>
                  )}
                </div>
                <div className="itemPreco-itemDrawer">
                  <p>R$: {item.preco}</p>
                </div>
                <div className="itemQtd-itemDrawer">
                  <p>{item.qtd}x</p>
                </div>
                <div className="btnRemover-itemDrawer">
                  <button onClick={() => removerItemCarrinho(item.id)}>-</button>
                </div>
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
  )
}
