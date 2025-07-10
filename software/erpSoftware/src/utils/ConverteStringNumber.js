import { CATEGORIAS, TIPOS_PRODUTO } from "./ProdutoEnum";


export const ConverterCategoriaDecimal = (categoriaKey) => {
    const categoria = CATEGORIAS.find(c => c.key === categoriaKey);
    return categoria ? categoria.id : 0;
};

export const ConverterTipoProdutoDecimal = (tipoKey) => {
    const tipo = TIPOS_PRODUTO.find(t => t.key === tipoKey);
    return tipo ? tipo.id : 0;
};