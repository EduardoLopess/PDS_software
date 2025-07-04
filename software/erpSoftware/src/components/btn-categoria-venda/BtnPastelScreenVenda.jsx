import './Btn-Categoria-VendaScreen.css'
import pastelImg from '../../assets/pastel.png'

export const BtnPastelVenda = ({ativo, setTituloCategoria, onClick }) => {

    const handleClick = () => {
        setTituloCategoria("PASTEIS")
        if (onClick) onClick()
    }
// className='button-btn-Venda'
    return (
        <button 
            className={`button-btn-Venda ${ativo ? "ativo" : ""}`}
            onClick={handleClick}
        >
            <div className='container-btn-categoriaVenda'>
                <img src={pastelImg} alt="icone" />
                <p className='p-btn'>PASTEL</p>
            </div>
        </button>
    )
}