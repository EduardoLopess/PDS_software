import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useCarrinho } from "./CarrinhoContext";
import { getPedidoId, postPedido, putPedido } from '../service/api/PedidoService'

const PedidoContext = createContext();

export const PedidoProvider = ({ children }) => {
    const navigate = useNavigate();
    const { carrinhoVisivel, itemCarrinho, setItemCarrinho, setCarrinhoVisivel } = useCarrinho();
    const [pedidoAtual, setPedidoAtual] = useState(null)
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
        localStorage.setItem('numeroMesa', JSON.stringify(mesa));
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




    const mesaLivre = (idMesa, numeroMesa) => {
        const mesa = mesaDataContext.find(m => m.id === idMesa)

        if (!mesa) {
            Swal.fire({ icon: 'error', title: 'Mesa não encontrada.' });
            return;
        }

        if (mesa.statusMesa) {
            Swal.fire({
                title: 'Mesa ocupada, deseja editar o pedido?',
                showCancelButton: true,
                confirmButtonText: 'Sim, EDITAR!',
                cancelButtonText: 'Não'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Iniciar edição')
                    // aqui você pode chamar função de edição depois
                }
            });
        } else {
            // MESA LIVRE → confirmar pedido
            Swal.fire({
                title: 'INICIAR PEDIDO?',
                text: `MESA ${numeroMesa}`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
            }).then((result) => {
                if (result.isConfirmed) {
                    iniciarPedido({ id: idMesa, numero: numeroMesa }); // <-- envia direto
                }
            });

        }
    };




    const iniciarPedido = ({ id, numero }) => {
        if (!id || !numero) {
            Toast.fire({ icon: 'error', title: 'Mesa inválida!' });
            return;
        }

        if (
            carrinhoVisivel &&
            itemCarrinho.length > 0 &&
            numeroMesaContext?.numero !== numero
        ) {
            Toast.fire({
                icon: 'error',
                title: `PEDIDO EM ANDAMENTO NA MESA ${numeroMesaContext.numero}`
            });
            return;
        }

        setNumeroMesaContext({ id, numero });
        console.log("Mesa selecionada:", 'ID:', id, 'Numero:', numero);
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
            Toast.fire({
                icon: 'success',
                title: 'Pedido criado com sucesso.'
            })
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: 'Falha ao criar o pedido.'
            })
            console.error("Erro ao criar pedido:", error);
        }
    };






    const finalizarPedido = async () => {
        const { id: mesaId } = numeroMesaContext;

        Swal.fire({
            title: 'Finalizar pedido ?',
            showCancelButton: true,
            confirmButtonText: 'Sim, finalizar!',
            denyButtonText: 'Não.'
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            const itensArray = itemCarrinho.map(item => ({
                produtoId: item.id,
                qtd: item.qtd,
                adicionalIDs: item.adicionais?.map(adc => adc.id) || [],
                saborDrinkId: item.saborDrinkId || null
            }));

            const pedido = {
                mesaId,
                dateTime: new Date().toISOString(),
                itens: itensArray
            };

            try {
                if (pedidoAtual) {
                    // Atualizar
                    await putPedido(pedidoAtual, pedido);
                    Toast.fire({ icon: 'success', title: 'Pedido atualizado com sucesso.' });
                } else {
                    // Criar novo
                    await postPedido(pedido);
                    Toast.fire({ icon: 'success', title: 'Pedido criado com sucesso.' });
                }

                // Reset
                clearNumeroMesaContext();
                setItemCarrinho([]);
                setCarrinhoVisivel(false);
                setPedidoAtual(null);

            } catch (error) {
                Toast.fire({ icon: 'error', title: 'Erro ao finalizar o pedido.' });
                console.error(error);
            }
        });
    };





    const editarPedido = async (idPedido) => {
        console.log("ID PEDIDO:", idPedido);

        if (carrinhoVisivel && itemCarrinho.length > 0 && numeroMesaContext?.numero) {
            Toast.fire({
                icon: 'error',
                title: `Finalize o pedido em andamento na mesa ${numeroMesaContext.numero}`
            });
            return;
        }

        try {
            const response = await getPedidoId(idPedido);
            console.log("PEDIDO RECEBIDO (bruto):", response);
            const pedido = response.data.data;
            console.log("PEDIDO RETORNADO NO GETbyID\n", JSON.stringify(pedido, null, 2));

            setItemCarrinho([])
            const itensConvertidos = pedido.itens.map((item) => ({
                id: item.produtoId,
                nome: item.produto.nomeProduto,
                precoProduto: item.produto.precoProduto,
                preco: item.produto.precoProdutoFormatado,
                qtd: item.qtd,
                categoria: item.produto.categoriaProduto,
                tipo: item.produto.tipoProduto,
                adicionais: item.adicionais?.map(ad => ({
                    id: ad.id,
                    adicionalNome: ad.adicionalNome,
                    preco: ad.precoAdicional,
                    precoAdicionalFormatado: ad.precoAdicionalFormatado,
                    quantidade: ad.quantidade || 1,
                })),
                sabor: item.saborDrink?.nomeSabor || null,
                saborDrinkId: item.saborDrink?.id || null,
                idSabor: item.saborDrink?.id || null,
                adicionaisKey: item.adicionais?.length > 0 ? JSON.stringify(item.adicionais.map(ad => ad.id).sort()) : '',

            }))

            setPedidoAtual(pedido.id)
            setItemCarrinho(itensConvertidos)
            setNumeroMesaContext({
                id: pedido.mesaId,
                numero: pedido.numeroMesa
            });
            setCarrinhoVisivel(true)
            navigate('/produtos')

        } catch (err) {
            console.error("Erro ao buscar pedido:", err);
        }
    };



    return (
        <PedidoContext.Provider value={{
            iniciarPedido,
            mesaLivre,
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
