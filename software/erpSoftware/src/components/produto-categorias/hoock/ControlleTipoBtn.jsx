export const useControlleTippoBtn = (btnTipo) => {
    switch (btnTipo) {
        case btnVenda:
            return <button onClick={() => adicionarItemCarrinho(produto.id)}>
                <p>+</p>
            </button>
        case btnAddItem:
            return <button onClick={() => adicionarItemCarrinho(produto.id)}>
                <p>+</p>
            </button>
        case btnEdit:
            <button style={{ background: 'none' }} onClick={() => editarProduto(produto)}>
                <IoPencilOutline size={24} />
            </button>

        default:
            break;
    }
}



// {
//     iniciarVenda ? ( // SE iniciarVenda for TRUE (Modo de Venda)
//         <button onClick={() => adicionarItemCarrinhoVenda(produto.id)}>
//             <p>ESSE</p>
//         </button>
//     ) : (
//         (numeroMesaPedido !== '' && numeroMesaPedido !== null) ? ( // SE tem numeroMesaPedido (Modo Pedido Existente)
//             <button onClick={() => adicionarItemCarrinho(produto.id)}>
//                 <p>+</p>
//             </button>
//         ) : (
//             <button style={{ background: 'none' }} onClick={() => editarProduto(produto)}>
//                 <IoPencilOutline size={24} />
//             </button>
//         )
//     )
// }