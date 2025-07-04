import { children, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";


const PedidoContext = createContext()

export const PedidoProvider = ({ children }) => {
    const navigate = useNavigate()
    const [mesaDataContext, setMesaDataContext] = useState([])


    const iniciarPedido = (idMesa) => {
        console.log("MESA ID: ", idMesa)
        const mesaValida = mesaDataContext.find(i => i.id === idMesa)

        if (!mesaValida) {

        }

        if (mesaValida.statusMesa === true) {
            alert("MESA OCUPADA.")
            return
        }
    }

    const criarPedido = () => {

    }

    const editarPedido = (idPedido) => {

    }

    const cancelarPedido = () => {

    }


    return (
        <PedidoContext.Provider value={{
            iniciarPedido,
            criarPedido,
            cancelarPedido,
            editarPedido,

            setMesaDataContext

        }}>
            {children}
        </PedidoContext.Provider>
    )
}

export const usePedido = () => useContext(PedidoContext)