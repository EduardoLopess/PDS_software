import { children, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { useCarrinho } from "./CarrinhoContext";


const PedidoContext = createContext()

export const PedidoProvider = ({ children }) => {
    const navigate = useNavigate()
           
    const { carrinhoVisivel, itemCarrinho, setItemCarrinho, setCarrinhoVisivel} = useCarrinho()

    const [mesaDataContext, setMesaDataContext] = useState([])
    const [numeroMesaContext, setNumeroMesaContext] = useState('')


    const Toast = Swal.mixin({
        toast: false,
        position: 'center',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
    })


    const iniciarPedido = (idMesa) => {
        console.log("MESA ID: ", idMesa)

        const mesaValida = mesaDataContext.find(i => i.id === idMesa)
        const mesaAtual = mesaValida ? mesaValida.numeroMesa : null

        if (!mesaValida) {
            Toast.fire({
                icon: 'error',
                title: 'Mesa inválida!',
            })
            return
        }

        if (mesaValida.statusMesa === true) {
            Toast.fire({
                icon: 'error',
                title: 'Mesa ocupada.',
            })
            return
        }

        if (carrinhoVisivel && itemCarrinho.length > 0 && mesaAtual !== numeroMesaContext) {
            Toast.fire({
                icon: 'error',
                title: `PEDIDO EM ANDAMENTO NA MESA ${numeroMesaContext}`,
            })
            return
        }

        if (mesaAtual === numeroMesaContext) {
            navigate('/produtos', { state: { numeroMesa: numeroMesaContext } })
        } else {

            setNumeroMesaContext(mesaAtual)
            navigate('/produtos', { state: { numeroMesa: mesaAtual } })
        }
    }


    const criarPedido = (pedido) => {

    }

    const finalizarPedido = (data) => {
        criarPedido(data)
        alert("PEDIDO FINALIZADO")
    }

    const editarPedido = (idPedido) => {

    }

    const cancelarPedido = () => {

        Swal.fire({
            title: 'Deseja CANCELAR o pedido',
            showDenyButton: true,
            confirmButtonText: 'Sim cancelar!',
            denyButtonText: 'Não',
            customClass: {
                actions: 'my-actions',
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2',
                denyButton: 'order-3',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                setNumeroMesaContext(null)
                setItemCarrinho([])
                setCarrinhoVisivel(false)
                Swal.fire('CANCELADO!', '', 'success')
                navigate('/')
            } else if (result.isDenied) {
                return
            }
        })
        
    }


    return (
        <PedidoContext.Provider value={{
            iniciarPedido,
            criarPedido,
            cancelarPedido,
            finalizarPedido,
            editarPedido,
            numeroMesaContext,
            setMesaDataContext,

        }}>
            {children}
        </PedidoContext.Provider>
    )
}

export const usePedido = () => useContext(PedidoContext)