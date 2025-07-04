import './Btn-Categoria-VendaScreen.css'
import porcaoImg from '../../assets/porcao.png'

export const BtnPorcaoVenda = ({ ativo, setTituloCategoria, onClick }) => {

    const handleClick = () => {
        setTituloCategoria("PORÇÕES")
        if (onClick) onClick()
    }
    return (
        <button
            className={`button-btn-Venda ${ativo ? "ativo" : ""}`}
            onClick={handleClick}
        >
            <div className='container-btn-categoriaVenda'>
                <img src={porcaoImg} alt="icone" />
                <p className='p-btn'>PORÇÃO</p>
            </div>
        </button>
    )
}