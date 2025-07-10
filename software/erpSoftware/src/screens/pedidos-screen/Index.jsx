import { useNavigate } from 'react-router-dom'
import { PedidoItem } from '../../components/pedido/Index'
import './Pedido-screen.css'
import Swal from 'sweetalert2';

import { useEffect, useState } from 'react'
import { usePedido } from '../../context/PedidoContext'
import { PedidoDetalhe } from './PedidoDetalhe';

export const PedidoScreen = ({ pedidos }) => {

    const navigate = useNavigate()
    const [pedidoNumeroMesa, setPedidoNumeroMesa] = useState('')
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const { editarPedido, deletarPedido } = usePedido()

    useEffect(() => {
        if (pedidoSelecionado) {
            const aindaExiste = pedidos.some(p => p.id === pedidoSelecionado.id);
            if (!aindaExiste) {
                setPedidoSelecionado(null)
                setPedidoNumeroMesa('')
            }
        }
    }, [pedidos, pedidoSelecionado]);



    const iniciarEdicao = (id) => {
        Swal.fire({
            title: 'Deseja editar o pedido?',
            showCancelButton: true,
            confirmButtonText: 'Sim, EDITAR!',
            cancelButtonText: 'Não'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await editarPedido(id)

                } catch {
                     Toast.fire({
                        icon: 'error',
                        title: `Erro`
                    })
                }
            }
        })
    }



    const iniciarEdicaso = (id) => {

        Swal.fire({
            title: 'Deseja editar o pedido?',
            showCancelButton: true,
            confirmButtonText: 'Sim, EDITAR!',
            cancelButtonText: 'Não'
        }).then((result) => {
            if (result.isConfirmed) {
                editarPedido(id)
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "info",
                    title: "Edição do pedido iniciada"
                });
            }
        });

    }




    console.dir(pedidoSelecionado, { depth: null });
    return (

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <div className='container-pedidoScreen'>
                <div className='container-pedidoItem-pedidoScreen'>
                    <div className='container-titulo-pedidoScreen'>
                        <h3>PEDIDOS ATIVOS</h3>
                    </div>
                    <div className='containter-pedidos-pedidoScreen'>
                        {pedidos.map((pedido) => (
                            <PedidoItem
                                key={pedido.id}
                                id={pedido.id}
                                numeroMesa={pedido.numeroMesa}
                                data={pedido.dateTimeFormatado}
                                itens={pedido.itens}
                                setpedidoNumeroMesa={setPedidoNumeroMesa}
                                setPedidoSelecionado={setPedidoSelecionado}
                            />
                        ))}

                    </div>

                </div>
                <div className='container-detalhes-pedidoScreen'>
                    <div className='container-titulo-pedidoScreen'>
                        <h3>DETALHES MESA {pedidoNumeroMesa}</h3>
                    </div>
                    <div className='container-conteudo-pedidoScreen'>
                        {pedidoSelecionado ? (
                            <PedidoDetalhe
                                pedidoSelecionado={pedidoSelecionado}
                            />
                        ) : (
                            <p>sdasdsa</p>
                        )}
                    </div>



                    <div className='container-buttons-pedidoScreen'>
                        <button className='buttom-container-detalhes' style={{ background: 'red' }} onClick={() => {
                            if (pedidoSelecionado) {
                                deletarPedido(pedidoSelecionado.id);
                            } else {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Nenhum pedido selecionado',
                                    text: 'Por favor, selecione um pedido para cancelar.',
                                });
                            }
                        }}
                        >
                            <p>CANCELAR PEDIDO</p>
                        </button>
                        <button className='buttom-container-detalhes' style={{ background: 'green' }} onClick={() => {
                            if (pedidoSelecionado) {
                                iniciarEdicao(pedidoSelecionado.id);
                            } else {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Nenhum pedido selecionado',
                                    text: 'Por favor, selecione um pedido antes de cobrar.',
                                });
                            }
                        }}
                        >
                            <p>COBRAR</p>
                        </button>
                        <button
                            className='buttom-container-detalhes'
                            style={{ background: 'blue' }}
                            onClick={() => {
                                if (pedidoSelecionado) {
                                    iniciarEdicao(pedidoSelecionado.id);
                                } else {
                                    Swal.fire({
                                        icon: 'warning',
                                        title: 'Nenhum pedido selecionado',
                                        text: 'Por favor, selecione um pedido antes de editar.',
                                    });
                                }
                            }}
                        >
                            <p>EDITAR</p>
                        </button>

                    </div>

                </div>
            </div>
        </div>

    )
}