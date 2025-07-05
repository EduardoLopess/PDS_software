// components/ListaProdutosPorCategoria.js
import{ useEffect, useState } from 'react';
import { getProdutos } from '../../service/api/ProdutoService'; // O Model Service
import { PastelList } from './pastel-categoria/PastelList';
import { SemAlcoolCategoria } from '../../components/produto-categorias/semAlcool-categoria/SemAlcoolCategoria';
import { DrinkCategoria } from '../../components/produto-categorias/drink-categoria/DrinkCategoria';
import { CervejaCategoria } from '../../components/produto-categorias/cerveja-categoria/CervejasCategoria';
import { PasteisCategoria } from '../../components/produto-categorias/pastel-categoria/PasteisCategoria';
import { AlaMinutaCategoria } from '../../components/produto-categorias/alaminuta-categoria/AlaminutaCategoria';
import { PorcaoCategoria } from '../../components/produto-categorias/porcao-categoria/PorcaoCategoria';


export const ListaProdutosPorCategoria = ({ categoria }) => {
    const [produtosCompletos, setProdutosCompletos] = useState([]); // Todos os produtos
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        setLoading(true);
        setError(null);
        getProdutos()
            .then(res => {
                setProdutosCompletos(res.data.data);
            })
            .catch(err => {
                console.error('Erro ao buscar produtos:', err);
                setError('Não foi possível carregar os produtos.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const produtosFiltrados = produtosCompletos.filter(p =>
        p.categoriaProduto?.toLowerCase() === categoria.toLowerCase()
    );

    if (loading) return <p>Carregando produtos...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (produtosFiltrados.length === 0) return <p>Nenhum produto encontrado para esta categoria.</p>;

    switch (categoria) {
        case 'pastel':
            return <PasteisCategoria produtos={produtosFiltrados} />;
        case 'cerveja':
            return <CervejaCategoria produtos={produtosFiltrados} />;
        case 'drink':
            return <DrinkCategoria produtos={produtosFiltrados} />;
        case 'semAlcool' : 
            return <SemAlcoolCategoria produtos={produtosFiltrados}/>
        case 'alaMinuta' :
            return <AlaMinutaCategoria produtos={produtosFiltrados}/>
        case 'porcao':
            return <PorcaoCategoria produtos={produtosFiltrados}/>
        default:
            return <p>Selecione uma categoria válida.</p>;
    }
};