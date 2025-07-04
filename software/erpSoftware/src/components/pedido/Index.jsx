import './Pedido-Style.css'
import mesa from '../../assets/icons/mesa-redonda.png'

export const PedidoItem = ({ id, numeroMesa, data, itens, setPedidoSelecionado, setpedidoNumeroMesa }) => {
    const hora = data.split(" ")[1];

    const handleClick = () => {
        setpedidoNumeroMesa(numeroMesa);
        setPedidoSelecionado({ id, numeroMesa, data, itens });
    };

    return (
        <button
            onClick={handleClick}
            style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'inline-block',
                width: 'fit-content',
                height: 'fit-content',
            }}
        >
            <div className='container-pedidoItem'>
                <div className='container-mesa-pedido'>
                    <p>{`MESA ${numeroMesa}`}</p>
                </div>
                <div className='container-img-pedido'>
                    <img src={mesa} alt="icone" />
                </div>
                <div className='container-horario-pedido'>
                    <p>{hora}</p>
                </div>
            </div>
        </button>
    );
};