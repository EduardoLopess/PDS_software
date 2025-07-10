import { useEffect, useState } from "react"
import { getPedidos } from "../../service/api/PedidoService"
import { PedidoScreen } from "./Index"
import { useApiRequest } from "../../context/ApiRequestContext"

export const PedidoView = () => {
    const {pedidoData} = useApiRequest()



    return (
        <PedidoScreen pedidos={pedidoData}/>
    )
}