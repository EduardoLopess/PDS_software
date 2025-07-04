import axios from "axios"

const API = 'http://localhost:5071/api/adicional'

//BUSCAR
export const getAdicionais = () => {
    return axios.get(API)
}

//CRIAR
export const postAdicional = (adicional) => {
    return axios.post(API, adicional)
}
