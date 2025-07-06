import axios from "axios"

const API = 'http://localhost:5071/api/pedido'

//BUSCAR
export const getPedidos = () => {
    return axios.get(API)
}

//CRIAR
export const postPedido = (pedido) => {
    return axios.post(API, pedido)
}

//Buscar pedido id
export const getPedidoId = (id) => {
    return axios.get(`${API}/${id}`);
};

//Atualizar pedido
export const putPedido = async (id, pedido) => {
    try {
        const response = await axios.put(`${API}/${id}`, pedido);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar pedido:", error);
        throw error; // Deixa o caller (quem chamou) lidar com o erro
    }
};
//deletar

