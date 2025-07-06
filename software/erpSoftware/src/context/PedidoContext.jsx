import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useCarrinho } from "./CarrinhoContext";

const PedidoContext = createContext();

export const PedidoProvider = ({ children }) => {
    const navigate = useNavigate();
    const { carrinhoVisivel, itemCarrinho, setItemCarrinho, setCarrinhoVisivel } = useCarrinho();

    const [mesaDataContext, setMesaDataContext] = useState([]);
    const [numeroMesaContext, setNumeroMesaContextState] = useState(() => {
        return localStorage.getItem('numeroMesa') || '';
    });

    const setNumeroMesaContext = (mesa) => {
        setNumeroMesaContextState(mesa);
        localStorage.setItem('numeroMesa', mesa);
    };

    const clearNumeroMesaContext = () => {
        setNumeroMesaContextState('');
        localStorage.removeItem('numeroMesa');
    };


    const Toast = Swal.mixin({
        toast: false,
        position: 'center',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
    });

    const iniciarPedido = (idMesa) => {
        const mesaValida = mesaDataContext.find(i => i.id === idMesa);
        const mesaAtual = mesaValida ? mesaValida.numeroMesa : null;

        if (!mesaValida) {
            Toast.fire({ icon: 'error', title: 'Mesa inválida!' });
            return;
        }

        if (mesaValida.statusMesa === true) {
            Toast.fire({ icon: 'error', title: 'Mesa ocupada.' });
            return;
        }

        if (carrinhoVisivel && itemCarrinho.length > 0 && mesaAtual !== numeroMesaContext) {
            Toast.fire({ icon: 'error', title: `PEDIDO EM ANDAMENTO NA MESA ${numeroMesaContext}` });
            return;
        }

        setNumeroMesaContext(mesaAtual);
        navigate('/produtos');
    };

    const cancelarPedido = () => {
        Swal.fire({
            title: 'Deseja CANCELAR o pedido?',
            showDenyButton: true,
            confirmButtonText: 'Sim, cancelar!',
            denyButtonText: 'Não',
        }).then((result) => {
            if (result.isConfirmed) {
                clearNumeroMesaContext();
                setItemCarrinho([]);
                setCarrinhoVisivel(false);
                Swal.fire('CANCELADO!', '', 'success');
                navigate('/');
            }
        });
    };


    const criarPedido = (pedido) => { };
    const finalizarPedido = (data) => {
        criarPedido(data);
        alert("PEDIDO FINALIZADO");
    };
    const editarPedido = (idPedido) => { };

    return (
        <PedidoContext.Provider value={{
            iniciarPedido,
            cancelarPedido,
            finalizarPedido,
            criarPedido,
            editarPedido,
            numeroMesaContext,
            setNumeroMesaContext,
            setMesaDataContext,
        }}>
            {children}
        </PedidoContext.Provider>
    );
};

export const usePedido = () => useContext(PedidoContext);
