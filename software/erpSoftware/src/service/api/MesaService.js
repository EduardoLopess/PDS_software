import axios from "axios";

const API = 'http://localhost:5071/api/mesa'

//LISTAR
export const getMesas = () => {
    return axios.get(API)
}

//CRIAR MESA
export const postMesa = (mesa) => {
    return axios.post(API, mesa)
}

//DELETAR MESA
export const deleteMesa = (id) => {
    return axios.delete(`${API}/${id}`)
}