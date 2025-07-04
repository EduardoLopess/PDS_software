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
