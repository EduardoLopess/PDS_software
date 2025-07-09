import axios from "axios"

const API = 'http://localhost:5071/api/produto'

//BUSCAR
export const getProdutos = () => {
    return axios.get(API)
}

//CRIAR
export const criarProduto = async (produto) => {
    try {
        console.time("POST /produto");
        const res = await axios.post(API, produto);
        console.timeEnd("POST /produto");
        if (res) {
          await getProdutos()
        }
        return res;
    } catch (error) {
        console.error("Erro ao criar produto:", error.response?.data || error.message);
    }
};

//ATUALIZAR
export const putProduto = (id, data) => {
  return axios.put(`${API}/${id}`, data)
}

//DELETAR
export const deleteProduto = (id) => {
  return axios.delete(`${API}/${id}`)
}