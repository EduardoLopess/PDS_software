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
        throw error; 
    }
};


export const buscarPedidoPorMesa = async (mesaId) => {
    try {
        const response = await axios.get(`${API}/mesa/${mesaId}`);
        return response.data; 
    } catch (err) {
        console.error("Erro ao buscar pedido por mesa:", err.response ? err.response.data : err.message);
        throw err;
    }
};


//deletar
export const deletePedido = async (id) => {
    try {
        const response = await axios.delete(`${API}/${id}`)
        return response.data

    } catch (err) {
        console.error("Falha ao deletar o pedido.", err.response ? err.response.data : err.message)
        throw err

    }
}

