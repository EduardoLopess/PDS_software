import './Mesa-Style.css'
import Swal from 'sweetalert2';
import mesa from '../../assets/icons/mesa-redonda.png'
import { usePedido } from '../../context/PedidoContext'

export const Mesa = ({ id, numeroMesa, statusMesa }) => {

    const { iniciarPedido } = usePedido()

    const confirmarInicioPedido = (numeroMesa, idMesa) => {
        Swal.fire({
            title: 'INICIAR PEDIDO?',
            text: `MESA ${numeroMesa}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
        }).then((result) => {
            if (result.isConfirmed) {
                
                iniciarPedido(idMesa);  
            } else {
                
                console.log('Pedido não iniciado');
            }
        });
    };



    return (
        <button style={{ all: 'unset', cursor: 'pointer' }} onClick={() => confirmarInicioPedido(numeroMesa, id)}>
            <div className='cardMesa'>
                <div className='cardNumeroMesa'>
                    <p>MESA {numeroMesa}</p>
                </div>
                <div className='cardImg'>
                    <img src={mesa} alt='icone' />
                </div>
                <div
                    className='cardStatus'
                    style={{
                        backgroundColor: statusMesa ? '#E90000' : 'green',
                    }}
                >
                    <p>{statusMesa ? 'OCUPADA' : 'LIVRE'}</p>
                </div>

            </div>
        </button>
    )
}