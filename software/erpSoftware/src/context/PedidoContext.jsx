import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useCarrinho } from "./CarrinhoContext";
import { postPedido } from '../service/api/PedidoService'

const PedidoContext = createContext();

export const PedidoProvider = ({ children }) => {
    const navigate = useNavigate();
    const { carrinhoVisivel, itemCarrinho, setItemCarrinho, setCarrinhoVisivel } = useCarrinho();

    const [mesaDataContext, setMesaDataContext] = useState([]);
    const [numeroMesaContext, setNumeroMesaContextState] = useState(() => {
        try {
            const localMesa = localStorage.getItem('numeroMesa');
            return localMesa ? JSON.parse(localMesa) : null;
        } catch (error) {
            console.warn("Erro ao ler numeroMesa do localStorage:", error);
            localStorage.removeItem('numeroMesa'); // opcional: limpa se estiver inválido
            return null;
        }
    })


    const setNumeroMesaContext = (mesa) => {
        setNumeroMesaContextState(mesa);
        localStorage.setItem('numeroMesa', JSON.stringify(mesa)); // ← salva como JSON string
        // ← salva como JSON
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

        if (!mesaValida) {
            Toast.fire({ icon: 'error', title: 'Mesa inválida!' });
            return;
        }

        if (mesaValida.statusMesa === true) {
            Toast.fire({ icon: 'error', title: 'Mesa ocupada.' });
            return;
        }

        if (
            carrinhoVisivel &&
            itemCarrinho.length > 0 &&
            numeroMesaContext?.numero !== mesaValida.numeroMesa
        ) {
            Toast.fire({
                icon: 'error',
                title: `PEDIDO EM ANDAMENTO NA MESA ${numeroMesaContext.numero}`
            });
            return;
        }

        setNumeroMesaContext({
            id: mesaValida.id,
            numero: mesaValida.numeroMesa
        });
        console.log("Mesa selecionada:", 'ID: ', mesaValida.id, 'Numero', mesaValida.numeroMesa); // 👈 VERIFICANDO A MESA


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


    const criarPedido = async (pedido) => {
        console.log("PEDIDO A SER ENVIADO:\n", JSON.stringify(pedido, null, 2));

        try {
            await postPedido(pedido);
        } catch (error) {
            console.error("Erro ao criar pedido:", error);
        }
    };

    const finalizarPedido = () => {
        const { id: mesaId } = numeroMesaContext;
        console.log("MESA ID:", mesaId);

        const { numero, ...itensObj } = itemCarrinho;

        const itensArray = Object.values(itensObj).map(item => ({
            produtoId: item.id,
            qtd: item.qtd,
            adicionalIDs: item.adicionais ? item.adicionais.map(adc => adc.id) : [],
            saborDrinkId: item.saborDrinkId || null
        }));

        const pedidoMesa = {
            mesaId, // <- AGORA INCLUÍDO!
            dateTime: new Date().toISOString(),
            itens: itensArray
        };

        criarPedido(pedidoMesa);
        clearNumeroMesaContext();
        setItemCarrinho([]);
        setCarrinhoVisivel(false);
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
