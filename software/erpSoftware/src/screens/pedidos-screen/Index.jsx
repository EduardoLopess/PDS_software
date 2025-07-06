import { useNavigate } from 'react-router-dom'
import { PedidoItem } from '../../components/pedido/Index'
import './Pedido-screen.css'
import Swal from 'sweetalert2';

import { useState } from 'react'
import { usePedido } from '../../context/PedidoContext'

export const PedidoScreen = ({ pedidos }) => {

    const navigate = useNavigate()
    const [pedidoNumeroMesa, setPedidoNumeroMesa] = useState('')
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const { editarPedido } = usePedido()

    const iniciarEdicao = (id) => {

        Swal.fire({
            title: 'Mesa ocupada, deseja editar o pedido?',
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
                            <>
                                {pedidoSelecionado.itens.map((item, index) => (
                                    <div className='container-item'>
                                        <div key={index} className='tipo-pedidoDetalhe'>
                                            <p>{item.produto.categoriaProduto}</p>
                                            <p>{item.produto.tipoProduto}</p>
                                        </div>
                                        <div className='linha-pedidoDetalhe' />
                                        <div className='nomeProduto-pedidoDetalhe'>
                                            <p>{item.produto?.nomeProduto}</p>
                                            {item.saborDrink && (
                                                <p><strong>Sabor:</strong> {item.saborDrink.nomeSabor}</p>
                                            )}
                                            {/* {item.adicionais?.length > 0 && (
                                                <div>
                                                    <strong>Adicionais:</strong>
                                                    <ul>
                                                        {item.adicionais.map((adicional, i) => (
                                                            <li key={i}>
                                                                {adicional.adicionalNome} - R$ {adicional.precoAdicionalFormatado}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )} */}
                                        </div>
                                        <div className='linha-pedidoDetalhe' />
                                        <div className='qtdProduto-pedidoDetalhe'>
                                            <p>{item.qtd}x</p>
                                        </div>
                                        <div className='linha-pedidoDetalhe' />
                                        <div className='precoProduto-pedidoDetalhe'>
                                            <p>R$: {item.produto.precoProdutoFormatado}</p>
                                            {item.adicionais?.length > 0 && (
                                                <>
                                                    {item.adicionais.map((adicional, i) => (
                                                        <p>AD. R$: {adicional.precoAdicionalFormatado}</p>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                        <div className='linha-pedidoDetalhe' />
                                        <div className='btnRemover-pedidoDetalhes'>
                                            <button>-</button>
                                        </div>
                                    </div>

                                ))}

                            </>


                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 20, fontSize: 20 }}>
                                <p>Selecione um pedido!</p>
                            </div>
                        )}
                    </div>



                    <div className='container-buttons-pedidoScreen'>
                        <button className='buttom-container-detalhes' style={{ background: 'red' }} onClick={() => {
                            if (pedidoSelecionado) {
                                iniciarEdicao(pedidoSelecionado.id);
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