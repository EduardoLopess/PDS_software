import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { useCarrinho } from "./CarrinhoContext"; // Importa useCarrinho
import { buscarPedidoPorMesa, deletePedido, getPedidoId, getPedidos, postPedido, putPedido } from '../service/api/PedidoService'
import { useCarrinhoVenda } from "./CarrinhoVendaContext";
import { nanoid } from "nanoid";

const PedidoContext = createContext();

export const PedidoProvider = ({ children }) => {
    const {setExistePedidoAtivo, setPedidoAtivo, iniciarVenda, itensCarrinhoVenda } = useCarrinhoVenda();
    const navigate = useNavigate();
    
    const { carrinhoVisivel, itemCarrinho, setItemCarrinho, setCarrinhoVisivel, totalItens } = useCarrinho(); 
    const [pedidoAtual, setPedidoAtualState] = useState(() => {
        try {
            const localPedidoAtualId = localStorage.getItem('pedidoAtualId');
            if (localPedidoAtualId) {
                const parsedId = JSON.parse(localPedidoAtualId);
                return parsedId;
            }
            return null;
        } catch (error) {
            localStorage.removeItem('pedidoAtualId'); 
            return null;
        }
    });

    const setPedidoAtualContext = (id) => {
        setPedidoAtualState(id);
        try {
            localStorage.setItem('pedidoAtualId', JSON.stringify(id));
        } catch (error) {
        }
    };

    const clearPedidoAtualContext = () => {
        setPedidoAtualState(null);
        try {
            localStorage.removeItem('pedidoAtualId');
        } catch (error) {
        }
    };

    const [mesaDataContext, setMesaDataContext] = useState([]);
    const [controleVenda, setControleVenda] = useState(null)

    const [numeroMesaContext, setNumeroMesaContextState] = useState(() => {
        try {
            const localMesa = localStorage.getItem('numeroMesa');
            if (localMesa) {
                const parsedMesa = JSON.parse(localMesa);
                return parsedMesa;
            }
            return null;
        } catch (error) {
            localStorage.removeItem('numeroMesa');
            return null;
        }
    })

    const setNumeroMesaContext = (mesa) => {
        setNumeroMesaContextState(mesa);
        const mesaString = JSON.stringify(mesa);
        try {
            localStorage.setItem('numeroMesa', mesaString);
        } catch (error) {
        }
    };

    const clearNumeroMesaContext = () => {
        setNumeroMesaContextState(null);
        try {
            localStorage.removeItem('numeroMesa');
        } catch (error) {
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

            if (pedido && pedido.id) {
                await editarPedido(pedido.id); 
            } else {
                Toast.fire({ icon: 'error', title: 'Pedido não encontrado.' });
            }
        } catch (error) {
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
                            await editarPedido(pedido.id);
                        } else {
                            Toast.fire({ icon: 'error', title: 'Pedido não encontrado para edição.' });
                        }
                    } catch (error) {
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

        if (iniciarVenda === true && itensCarrinhoVenda.length > 0) {
            Toast.fire({
                icon: 'error',
                title: `Existe uma venda iniciada. Finalize-a.`
            })
            return
        }

        if (itemCarrinho.length > 0 && numeroMesaContext?.id && numeroMesaContext.id !== id) {
            Toast.fire({
                icon: 'error',
                title: `PEDIDO EM ANDAMENTO NA MESA ${numeroMesaContext.numero || ''}. Finalize-o primeiro.`
            });
            return;
        }

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
                clearNumeroMesaContext();
                setItemCarrinho([]);
                setCarrinhoVisivel(false);
                clearPedidoAtualContext(); 

                Toast.fire('CANCELADO!', '', 'success');
                
            }
        });
    };

    const finalizarPedido = async () => {
        
        if (!numeroMesaContext?.id || !numeroMesaContext?.numero) {
            Toast.fire({ icon: 'error', title: 'Nenhuma mesa selecionada para o pedido.' });
            return;
        }

        if (itemCarrinho.length === 0) {
            Toast.fire({ icon: 'info', title: 'Carrinho vazio. Adicione itens para finalizar o pedido.' });
            return;
        }
        
        const { id: mesaId, numero: numeroMesa } = numeroMesaContext;

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

           
            const totalCalculado = totalItens; 
            const pedidoPayload = {
                mesaId,
                dateTime: new Date().toISOString(),
                itens: itensArray,
                total: totalCalculado 
            };
           

            try {
                if (pedidoAtual) { 
                    await putPedido(pedidoAtual, pedidoPayload);
                    Toast.fire({ icon: 'success', title: 'Pedido atualizado com sucesso.' });
                } else {
                    await postPedido(pedidoPayload);
                    Toast.fire({ icon: 'success', title: 'Pedido criado com sucesso.' });
                }

                clearNumeroMesaContext();
                setItemCarrinho([]);
                setCarrinhoVisivel(false);
                clearPedidoAtualContext(); 
                navigate('/');
                

            } catch (error) {
                Toast.fire({ icon: 'error', title: 'Erro ao finalizar o pedido.' });
            }
        });
    };

    const editarPedido = async (idPedido) => {
        if (iniciarVenda === true && itensCarrinhoVenda.length > 0) {
            Toast.fire({
                icon: 'error',
                title: `Existe uma venda iniciada. Finalize-a antes de Editar`
            })
            return
        }
        if (itemCarrinho.length > 0 && numeroMesaContext?.id && pedidoAtual !== idPedido) {
            Toast.fire({
                icon: 'error',
                title: `Finalize o pedido em andamento na mesa ${numeroMesaContext.numero || ''} ou cancele-o.`
            });
            return;
        }

        try {
            const response = await getPedidoId(idPedido);
            const pedido = response.data.data;

            setItemCarrinho([]);

            const itensConvertidos = pedido.itens.map((item) => {
                if (!item || !item.produto) {
                    return null; 
                }

                const adicionaisKey = item.adicionais?.length > 0
                    ? item.adicionais.map(ad => `${ad.id}-${ad.quantidade || 1}`).sort().join(',')
                    : '';
                return {
                    idUnico: nanoid(8),
                    id: item.produtoId,
                    nome: item.produto.nomeProduto,
                    preco: item.produto.precoProduto,
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
                    adicionaisKey: adicionaisKey, 
                };
            }).filter(item => item !== null); 

            setPedidoAtualContext(pedido.id); 
            setItemCarrinho(itensConvertidos);
            setNumeroMesaContext({ 
                id: pedido.mesaId,
                numero: pedido.numeroMesa
            });
            
            setCarrinhoVisivel(true)
            navigate('/produtos')
            //REMOVER DPS ATIVA VENDA
            setPedidoAtivo(true)
            Toast.fire({ icon: 'success', title: `Edição do pedido da Mesa ${pedido.numeroMesa} iniciada.` });

        } catch (err) {
            Toast.fire({ icon: 'error', title: 'Erro ao carregar pedido para edição.' });
        }
    };

    const deletarPedido = async (pedidoId) => {
    
        if (itemCarrinho.length > 0 && numeroMesaContext?.id) {
            Toast.fire({
                icon: 'error',
                title: `Existe um pedido em andamento na mesa ${numeroMesaContext.numero || ''}. Finalize-o ou cancele-o antes.`
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Deseja CANCELAR este pedido permanentemente?',
            text: 'ATENÇÃO: Esta ação não poderá ser desfeita e removerá o pedido do histórico!',
            icon: 'warning',
            showDenyButton: true,
            confirmButtonText: 'Sim, CANCELAR!',
            denyButtonText: 'Não',
        });

        if (result.isConfirmed) {
            try {
                await deletePedido(pedidoId)
                Toast.fire({ icon: 'success', title: 'Pedido cancelado com sucesso.' });
                
                clearNumeroMesaContext()
                setItemCarrinho([])
                setCarrinhoVisivel(false)
                clearPedidoAtualContext() 
                navigate('/')

            } catch (err) {
                Toast.fire({ icon: 'error', title: err.response?.data?.message || 'Erro ao deletar pedido.' });
            }
        } else {
            return;
        }
    }

    return (
        <PedidoContext.Provider value={{
            iniciarPedido,
            mesaLivre,
            buscarMesaPedido,
            cancelarPedido,
            finalizarPedido,
            deletarPedido,
            editarPedido,
            numeroMesaContext,
            setNumeroMesaContext,
            clearNumeroMesaContext,
            setPedidoAtualContext,
            clearPedidoAtualContext, 
            setMesaDataContext,
            iniciarVenda
        }}>
            {children}
        </PedidoContext.Provider>
    );
};

export const usePedido = () => useContext(PedidoContext);