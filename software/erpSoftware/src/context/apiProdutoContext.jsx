import { createContext, useContext, useState, useEffect } from "react";
import { getProdutos, deleteProduto } from "../service/api/ProdutoService";

const ApiProdutoContext = createContext();

export const APIprodutoProvider = ({ children }) => {
    const [produtoData, setProdutoData] = useState([]);

    const buscarProdutos = async () => {
        try {
            const res = await getProdutos();
            setProdutoData(res.data.data);
        } catch (err) {
            console.error("Erro ao buscar os produtos.", err);
        }
    };

    const deletarProdutoContext = async (id) => {
        try {
            await deleteProduto(id);
            await buscarProdutos();
        } catch (err) {
            console.error("Erro ao deletar o produto:", err);
        }
    };

    useEffect(() => {
        buscarProdutos();
    }, []);

    return (
        <ApiProdutoContext.Provider value={{
            produtoData,
            buscarProdutos,
            deletarProduto: deletarProdutoContext
        }}>
            {children}
        </ApiProdutoContext.Provider>
    );
};

export const useApiProduto = () => useContext(ApiProdutoContext);
