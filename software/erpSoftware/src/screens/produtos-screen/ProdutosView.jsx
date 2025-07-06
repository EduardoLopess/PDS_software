import { useApiProduto } from '../../context/apiProdutoContext';

export const ListaProdutosPorCategoria = ({ categoria }) => {
    const { produtoData } = useApiProduto();

    const produtosFiltrados = produtoData.filter(p =>
        p.categoriaProduto?.toLowerCase() === categoria.toLowerCase()
    );

    if (!produtoData.length) return <p>Carregando produtos...</p>;
    if (produtosFiltrados.length === 0) return <p>Nenhum produto encontrado para esta categoria.</p>;

    switch (categoria) {
        case 'pastel':
            return <PasteisCategoria produtos={produtosFiltrados} />;
        case 'cerveja':
            return <CervejaCategoria produtos={produtosFiltrados} />;
        case 'drink':
            return <DrinkCategoria produtos={produtosFiltrados} />;
        case 'semAlcool':
            return <SemAlcoolCategoria produtos={produtosFiltrados} />;
        case 'alaMinuta':
            return <AlaMinutaCategoria produtos={produtosFiltrados} />;
        case 'porcao':
            return <PorcaoCategoria produtos={produtosFiltrados} />;
        default:
            return <p>Selecione uma categoria válida.</p>;
    }
};
