export const SemAlcoolItem = ({ produtos }) => {

    if (!Array.isArray(produtos)) {
        return null; // ou <p>Carregando...</p>
    }

    if (produtos.length === 0) {
        return <p style={{ textAlign: 'center' }}>Nenhum produto disponível nesta categoria.</p>;
    }

    const grupos = produtos.reduce((acc, produto) => {
        const tipo = produto.tipoProduto || 'Outros';
        if (!acc[tipo]) acc[tipo] = [];
        acc[tipo].push(produto);
        return acc;
    }, {});

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
                                    <p>{produto.categoriaProduto}</p>
                                </div>
                                <div className='conteudo-nome-item'>
                                    <p>{produto.nomeProduto}</p>
                                </div>
                                <div className='conteudo-preco-item'>
                                    <p>{produto.precoProdutoFormatado}</p>
                                </div>
                                <div className='conteudo-disponivel-item'>
                                    <p>{produto.disponibilidadeProduto ? 'Disponível' : 'Indisponível'}</p>
                                </div>
                                <div className='conteudo-btn-item'>
                                    <button>
                                        <p>+</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}