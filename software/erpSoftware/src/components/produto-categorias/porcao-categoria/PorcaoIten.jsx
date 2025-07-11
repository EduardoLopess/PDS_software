import '../produto-categoria-style/Item-Categoria-Style.css';
import { IoPencilOutline } from "react-icons/io5";
import { useEditarProduto } from '../hoock/EditarProduto';
import { useCarrinho } from '../../../context/CarrinhoContext';
import { useCarrinhoVenda } from '../../../context/CarrinhoVendaContext';
import { FormatarTiposProdutos } from '../../../utils/FormatarTipos';

export const PorcaoItem = ({ iniciarVenda, produtos, numeroMesaPedido }) => {

    const { adicionarItemCarrinho } = useCarrinho()
    const { editarProduto } = useEditarProduto()
    const { adicionarItemCarrinhoVenda } = useCarrinhoVenda()


    if (!Array.isArray(produtos)) {
        return null; // ou <p>Carregando...</p>
    }

    if (produtos.length === 0) {
        return <p style={{ textAlign: 'center' }}>Nenhum produto disponível nesta categoria.</p>;
    }

    const grupos = produtos.reduce((acc, produto) => {
        const tipo = produto.tipoProduto || 'Outros'
        if (!acc[tipo]) acc[tipo] = []
        acc[tipo].push(produto)
        return acc
    }, {})


    return (
        <div className='container-coteudo-item'>
            {Object.keys(grupos).map((tipo) => (
                <div key={tipo} className='grupo-tipo-produto'>
                    <div className='titulo-conteudo-item'>
                        <p>{tipo}</p>
                    </div>

                    {grupos[tipo].map((produto) => (
                        <div key={produto.id} className='item-produto'>
                            <div className='conteudo-container'>
                                <div className='conteudo-tipo-item'>
                                    <p>{FormatarTiposProdutos(produto.tipoProduto)}</p>
                                </div>
                                <div className='conteudo-nome-item'>
                                    <p>{produto.nomeProduto}</p>
                                </div>
                                <div className='conteudo-preco-item'>
                                    <p>R$: {produto.precoProdutoFormatado}</p>
                                </div>
                                <div className='conteudo-disponivel-item'>
                                    <p>{produto.disponibilidadeProduto ? 'Disponível' : 'Indisponível'}</p>
                                </div>
                                <div className='conteudo-btn-item'>
                                    {iniciarVenda ? (
                                       
                                        <button onClick={() => adicionarItemCarrinhoVenda(produto.id)}>
                                            <p>ESSE</p>
                                        </button>
                                    ) : iniciarVenda === false && numeroMesaPedido !== '' && numeroMesaPedido !== null ? (
                                        
                                        <button onClick={() => adicionarItemCarrinho(produto.id)}>
                                            <p>+</p>
                                        </button>
                                    ) : telaPedido === false ? (
                                       
                                        <button style={{ background: 'none' }} onClick={() => editarProduto(produto)}>
                                            <IoPencilOutline size={24} />
                                        </button>
                                    ) : (
                                        
                                        <button>
                                            <p>BTN NADA ATIVO</p>
                                        </button>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}