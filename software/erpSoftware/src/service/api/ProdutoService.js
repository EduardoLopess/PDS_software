import axios from "axios"

const API = 'http://localhost:5071/api/produto'

//BUSCAR
export const getProdutos = () => {
    return axios.get(API)
}

//CRIAR
export const criarProduto = (produto) => {
    return axios.post(API, produto)
}

//ATUALIZAR
export const putProduto = (id, data) => {
  return axios.put(`${API}/${id}`, data)
}
