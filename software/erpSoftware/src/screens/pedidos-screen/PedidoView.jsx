import { useEffect, useState } from "react"
import { getPedidos } from "../../service/api/PedidoService"
import { PedidoScreen } from "./Index"

export const PedidoView = () => {
    const [pedidosData, setPedidosData] = useState([])

    useEffect(() => {
        getPedidos()
            .then(res => {
                console.log("Resposta a API: ", res.data)
                setPedidosData(res.data.data)
            })
            .catch(err => console.error("Erro ao buscar PEDIDOS.", err))
    }, [])

    return (
        <PedidoScreen pedidos={pedidosData}/>
    )
}