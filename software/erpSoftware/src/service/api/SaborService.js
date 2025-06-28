import axios from "axios";

const API = 'http://localhost:5071/api/sabor'


export const getSabor = () => {
    return axios.get(API)
}

export const postSabor = () => {
    return axios.post(API)
}