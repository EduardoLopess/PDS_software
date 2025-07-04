import axios from "axios";

const API = 'http://localhost:5071/api/sabor'


export const getSabor = () => {
    return axios.get(API)
}

export const postSabor = (sabor) => {
    return axios.post(API, sabor)
}