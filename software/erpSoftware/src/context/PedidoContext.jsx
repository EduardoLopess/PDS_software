import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useCarrinho } from "./CarrinhoContext";
import { buscarPedidoPorMesa, deletePedido, getPedidoId, postPedido, putPedido } from '../service/api/PedidoService'

const PedidoContext = createContext();

export const PedidoProvider = ({ children }) => {
    const navigate = useNavigate();
    const { carrinhoVisivel, itemCarrinho, setItemCarrinho, setCarrinhoVisivel } = useCarrinho();
    const [pedidoAtual, setPedidoAtual] = useState(null)
    const [mesaDataContext, setMesaDataContext] = useState([]);

    const [numeroMesaContext, setNumeroMesaContextState] = useState(() => {
        try {
            const localMesa = localStorage.getItem('numeroMesa');
            // NOVO LOG: O que está sendo lido na inicialização do contexto
            if (localMesa) {
                const parsedMesa = JSON.parse(localMesa);
                console.log("PEDIDO_CONTEXT_DEBUG: 'numeroMesa' parseado do localStorage:", parsedMesa);
                return parsedMesa;
            }
            return null;
        } catch (error) {
            console.warn("PEDIDO_CONTEXT_DEBUG: Erro ao ler numeroMesa do localStorage:", error);
            localStorage.removeItem('numeroMesa');
            return null;
        }
    })

    // Wrapper para atualizar o estado e o localStorage para numeroMesaContext
    const setNumeroMesaContext = (mesa) => {
        // NOVO LOG: O que esta função recebeu como 'mesa'
        console.log("PEDIDO_CONTEXT_DEBUG: setNumeroMesaContext chamado com:", mesa);
        setNumeroMesaContextState(mesa); // Atualiza o estado React

        const mesaString = JSON.stringify(mesa);
        console.log("PEDIDO_CONTEXT_DEBUG: Tentando salvar 'numeroMesa' no localStorage (valor stringificado):", mesaString);
        try {
            localStorage.setItem('numeroMesa', mesaString);
            // NOVO LOG: Verifica imediatamente o que foi salvo no localStorage
            const verifySavedMesa = localStorage.getItem('numeroMesa');
            console.log("PEDIDO_CONTEXT_DEBUG: Verificação pós-salvamento 'numeroMesa' no localStorage:", verifySavedMesa);
        } catch (error) {
            console.error("PEDIDO_CONTEXT_DEBUG: ERRO ao tentar salvar 'numeroMesa' no localStorage:", error);
        }
    };

    const clearNumeroMesaContext = () => {
        setNumeroMesaContextState(null);
        try {
            localStorage.removeItem('numeroMesa');
            // NOVO LOG: Verifica imediatamente se foi removido
            const verifyRemovedMesa = localStorage.getItem('numeroMesa');
            console.log("PEDIDO_CONTEXT_DEBUG: Verificação pós-remoção 'numeroMesa' no localStorage (deve ser null/undefined):", verifyRemovedMesa);
        } catch (error) {
            console.error("PEDIDO_CONTEXT_DEBUG: ERRO ao tentar remover 'numeroMesa' do localStorage:", error);
        }
    };

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

    const buscarMesaPedido = async (idMesa) => {
        try {
            const resposta = await buscarPedidoPorMesa(idMesa);
            const pedido = resposta.data;
            console.log("PEDIDO_CONTEXT_DEBUG: API (buscarMesaPedido): Pedido retornado:", JSON.stringify(pedido, null, 2));

            if (pedido && pedido.id) {
                console.log("PEDIDO_CONTEXT_DEBUG: ID do pedido para editar:", pedido.id);
                editarPedido(pedido.id);
            } else {
                Toast.fire({ icon: 'error', title: 'Pedido não encontrado.' });
            }
        } catch (error) {
            console.error("PEDIDO_CONTEXT_DEBUG: Erro ao buscar pedido por mesa:", error);
            Toast.fire({ icon: 'error', title: 'Erro ao buscar pedido.' });
        }
    };

    const mesaLivre = async (idMesa, numeroMesa) => {
        const mesa = mesaDataContext.find(m => m.id === idMesa)

        if (!mesa) {
            Toast.fire({ icon: 'error', title: 'Mesa não encontrada.' });
            return;
        }

        if (mesa.statusMesa) {
            Swal.fire({
                title: 'Mesa ocupada, deseja editar o pedido?',
                showCancelButton: true,
                confirmButtonText: 'Sim, EDITAR!',
                cancelButtonText: 'Não'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const resposta = await buscarPedidoPorMesa(idMesa);
                        const pedido = resposta.data;
                        if (pedido && pedido.id) {
                            console.log("PEDIDO_CONTEXT_DEBUG: Mesa Ocupada: Chamando editarPedido com ID:", pedido.id);
                            editarPedido(pedido.id);
                        } else {
                            Toast.fire({ icon: 'error', title: 'Pedido não encontrado para edição.' });
                        }
                    } catch (error) {
                        console.error("PEDIDO_CONTEXT_DEBUG: Erro ao buscar pedido para edição (mesa ocupada):", error);
                        Toast.fire({ icon: 'error', title: 'Erro ao buscar pedido para edição.' });
                    }
                }
            });
        } else {
            Swal.fire({
                title: 'INICIAR PEDIDO?',
                text: `MESA ${numeroMesa}`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
            }).then((result) => {
                if (result.isConfirmed) {
                    // NOVO LOG: O que está sendo passado para iniciarPedido
                    console.log("PEDIDO_CONTEXT_DEBUG: Mesa Livre: Chamando iniciarPedido para ID:", idMesa, "Numero:", numeroMesa);
                    iniciarPedido({ id: idMesa, numero: numeroMesa });
                }
            });
        }
    };

    const iniciarPedido = ({ id, numero }) => {
        if (!id || !numero) {
            Toast.fire({ icon: 'error', title: 'Mesa inválida!' });
            return;
        }

        if (itemCarrinho.length > 0 && numeroMesaContext?.id !== id) {
            Toast.fire({
                icon: 'error',
                title: `PEDIDO EM ANDAMENTO NA MESA ${numeroMesaContext.numero || ''}. Finalize-o primeiro.`
            });
            return;
        }

        // NOVO LOG: O que está sendo passado para setNumeroMesaContext em iniciarPedido
        console.log("PEDIDO_CONTEXT_DEBUG: iniciarPedido: Chamando setNumeroMesaContext com:", { id, numero });
        setNumeroMesaContext({ id, numero });
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
                clearNumeroMesaContext(); // Limpa localStorage e estado para numeroMesa
                setItemCarrinho([]);
                setCarrinhoVisivel(false);
                setPedidoAtual(null);

                Toast.fire('CANCELADO!', '', 'success');
                navigate('/');
            }
        });
    };

    const criarPedido = async (pedido) => {
        console.log("PEDIDO_CONTEXT_DEBUG: Criando pedido: Dados enviados:", JSON.stringify(pedido, null, 2));
        try {
            await postPedido(pedido);
            Toast.fire({
                icon: 'success',
                title: 'Pedido criado com sucesso.'
            });
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: 'Falha ao criar o pedido.'
            });
            console.error("PEDIDO_CONTEXT_DEBUG: Erro ao criar pedido:", error);
        }
    };

    const finalizarPedido = async () => {
        const { id: mesaId } = numeroMesaContext; // Use o operador ?. se mesaId puder ser null

        Swal.fire({
            title: 'Finalizar pedido ?',
            showCancelButton: true,
            confirmButtonText: 'Sim, finalizar!',
            cancelButtonText: 'Não.'
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            const itensArray = itemCarrinho.map(item => ({
                produtoId: item.id,
                qtd: item.qtd,
                adicionalIDs: item.adicionais?.map(adc => adc.id) || [],
                saborDrinkId: item.idSabor || null
            }));

            const pedido = {
                mesaId,
                dateTime: new Date().toISOString(),
                itens: itensArray
            };
        console.log("PEDIDO POST ou PUT :\n", JSON.stringify(pedido, null, 2));


            try {
                if (pedidoAtual) {
                    console.log("PEDIDO_CONTEXT_DEBUG: Finalizando: Atualizando pedido ID:", pedidoAtual, "com dados:", JSON.stringify(pedido, null, 2));
                    await putPedido(pedidoAtual, pedido);
                    Toast.fire({ icon: 'success', title: 'Pedido atualizado com sucesso.' });
                } else {
                    console.log("PEDIDO_CONTEXT_DEBUG: Finalizando: Criando novo pedido com dados:", JSON.stringify(pedido, null, 2));
                    await postPedido(pedido);
                    Toast.fire({ icon: 'success', title: 'Pedido criado com sucesso.' });
                }

                clearNumeroMesaContext();
                setItemCarrinho([]);
                setCarrinhoVisivel(false);
                setPedidoAtual(null);

            } catch (error) {
                Toast.fire({ icon: 'error', title: 'Erro ao finalizar o pedido.' });
                console.error("PEDIDO_CONTEXT_DEBUG: Erro ao finalizar pedido:", error);
            }
        });
    };

    const editarPedido = async (idPedido) => {

        if (itemCarrinho.length > 0 && numeroMesaContext?.id && pedidoAtual !== idPedido) {
            Toast.fire({
                icon: 'error',
                title: `Finalize o pedido em andamento na mesa ${numeroMesaContext.numero || ''} ou cancele-o.`
            });
            return;
        }

        try {
            const response = await getPedidoId(idPedido);
            const pedido = response.data.data; // Confirmar se .data.data é a estrutura correta ou apenas .data
            console.log("PEDIDO_CONTEXT_DEBUG: API (getPedidoId): Dados do pedido recebidos:\n", JSON.stringify(pedido, null, 2));

            setItemCarrinho([]); // Limpa o carrinho atual

            const itensConvertidos = pedido.itens.map((item) => ({
                id: item.produtoId,
                nome: item.produto.nomeProduto,
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
                saborDrinkId: item.idSabor?.id || null,
                idSabor: item.saborDrink?.id || null,
                adicionaisKey: item.adicionais?.length > 0
                    ? item.adicionais.map(ad => `${ad.id}-${ad.quantidade || 1}`).sort().join(',')
                    : '',
            }));

            setPedidoAtual(pedido.id);
            setItemCarrinho(itensConvertidos);

            // NOVO LOG: O que está sendo passado para setNumeroMesaContext em editarPedido
            console.log("PEDIDO_CONTEXT_DEBUG: editarPedido: Chamando setNumeroMesaContext com:", {
                id: pedido.mesaId,
                numero: pedido.numeroMesa
            });
            setNumeroMesaContext({
                id: pedido.mesaId,
                numero: pedido.numeroMesa
            });
            setCarrinhoVisivel(true);
            navigate('/produtos');

        } catch (err) {
            Toast.fire({ icon: 'error', title: 'Erro ao carregar pedido para edição.' });
            console.error("PEDIDO_CONTEXT_DEBUG: Erro ao buscar pedido para edição:", err);
        }
    };

    const deletarPedido = async (pedidoId) => {

        if (itemCarrinho.length > 0 && numeroMesaContext?.id) {
            Toast.fire({
                icon: 'error',
                title: `Tem um pedido em andamento ${numeroMesaContext.numero || ''} ou cancele-o.`
            });
            return;
        }

        Swal.fire({
            title: 'Deseja CANCELAR o pedido?',
            text: 'ATENÇÂO, ação não podera ser desfeita!',
            icon: 'warning',
            showDenyButton: true,
            confirmButtonText: 'Sim, cancelar!',
            denyButtonText: 'Não',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deletePedido(pedidoId)
                    Toast.fire({ icon: 'success', title: 'Pedido cancelado com sucesso.' });
                } catch (err) {
                    console.error("Erro ao deletar o pedido: ", err)
                    Toast.fire({ icon: 'error', title: 'Erro ao deletar pedido.' });
                }
            } else {
                return
            }

        })

    }

    return (
        <PedidoContext.Provider value={{
            iniciarPedido,
            mesaLivre,
            buscarMesaPedido,
            cancelarPedido,
            finalizarPedido,
            deletarPedido,
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