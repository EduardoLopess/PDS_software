import './Mesa-Style.css'
import mesa from '../../assets/icons/mesa-redonda.png'

export const Mesa = ({id, numeroMesa, statusMesa}) => {
    return (
        <button style={{ all: 'unset', cursor: 'pointer' }}>
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