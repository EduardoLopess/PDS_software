import './Mesa-Style.css'
import Swal from 'sweetalert2';
import mesa from '../../assets/icons/mesa-redonda.png'
import { usePedido } from '../../context/PedidoContext'

export const Mesa = ({ id, numeroMesa, statusMesa }) => {

    const { iniciarPedido } = usePedido()



    const iniciar = () => {
        if (statusMesa) {
            Swal.fire({
                title: 'Mesa ocupada, deseja editar o pedido?',
                showCancelButton: true,
                confirmButtonText: 'Sim, EDITAR!',
                cancelButtonText: 'Não'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Iniciar edição');
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
                    iniciarPedido({ id, numero: numeroMesa }); // <- Envia objeto direto
                }
            });
        }
    };





    return (
        <button style={{ all: 'unset', cursor: 'pointer' }} onClick={iniciar}>
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