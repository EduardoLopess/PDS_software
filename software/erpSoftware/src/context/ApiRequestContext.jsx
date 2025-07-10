import { createContext, useContext, useEffect, useState } from "react";
import { getPedidos } from "../service/api/PedidoService";
import { getProdutos } from "../service/api/ProdutoService";
import { getSabor } from "../service/api/SaborService";
import { getAdicionais } from "../service/api/AdicionalService";
import { getMesas } from "../service/api/MesaService";
import Swal from 'sweetalert2';

import { onNovaNotificacao, onPedidoAtualizado, onPedidoCancelado, onPedidoCriado, startConnection } from "../service/signalrService/SignalrService";


const ApiRequestContext = createContext()

export const APIRequestProvider = ({ children }) => {

    const [pedidoData, setPedidoData] = useState([])
    const [produtoData, setProdutoData] = useState([])
    const [saborData, setSaborData] = useState([])
    const [adcionalData, setAdicionalData] = useState([])
    const [mesaData, setMesaData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resPedido = await getPedidos();
                setPedidoData(resPedido?.data?.data || []);
            } catch (err) {
                console.error("❌ Erro ao carregar pedidos:", err?.response?.data || err.message);
            }

            try {
                const resProduto = await getProdutos();
                setProdutoData(resProduto?.data?.data || []);
            } catch (err) {
                console.error("❌ Erro ao carregar produtos:", err?.response?.data || err.message);
            }

            try {
                const resSabor = await getSabor();
                setSaborData(resSabor?.data?.data || []);
            } catch (err) {
                console.error("❌ Erro ao carregar sabores:", err?.response?.data || err.message);
            }

            try {
                const resAdc = await getAdicionais();
                setAdicionalData(resAdc?.data?.data || []);
            } catch (err) {
                console.error("❌ Erro ao carregar adicionais:", err?.response?.data || err.message);
            }

            try {
                const resMesa = await getMesas();
                setMesaData(resMesa?.data?.data || []);
            } catch (err) {
                console.error("❌ Erro ao carregar mesas:", err?.response?.data || err.message);
            }
        

    }
    

        fetchData()

        startConnection()

        onPedidoAtualizado((pedido) => {
        carregarMesas()
        carregarPedidos()
        const mesaNumero = pedido.numeroMesa
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: `Pedido MESA ${mesaNumero} ATUALIZADO!`
        });
    })

        onNovaNotificacao((notificacao) => {
        console.log("📢 Notificação recebida:", notificacao)
    })

        onPedidoCriado((pedido) => {
        carregarMesas()
        carregarPedidos()
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: "Novo pedido CRIADO."
        });
    })

        onPedidoCancelado((pedido) => {
        carregarPedidos()
        carregarMesas()
    })



    }, [])


const Toast = Swal.mixin({
    toast: false,
    position: 'center',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
});


const carregarMesas = async () => {
    try {
        const resMesa = await getMesas()
        setMesaData(resMesa.data.data)
    } catch (err) {
        console.log('Erro ao carregar as mesas', err)
    }
}

const carregarPedidos = async () => {
    try {
        const resPedido = await getPedidos()
        setPedidoData(resPedido.data.data)
    } catch (err) {
        console.log("Erro ao carregar os pedidos.")
    }
}

return (
    <ApiRequestContext.Provider value={{
        mesaData,
        saborData,
        adcionalData,
        pedidoData,
        produtoData,
        carregarMesas,
        carregarPedidos

    }}>
        {children}
    </ApiRequestContext.Provider>
)
}

export const useApiRequest = () => useContext(ApiRequestContext)