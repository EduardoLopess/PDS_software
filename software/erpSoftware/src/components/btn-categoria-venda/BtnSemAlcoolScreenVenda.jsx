import './Btn-Categoria-VendaScreen.css'
import semAlcoolImg from '../../assets/noalcool.png'

export const BtnSemAlcoolVenda = ({ ativo, setTituloCategoria, onClick }) => {

    const handleClick = () => {
        setTituloCategoria("SEM ÁLCOOL")
        if (onClick) onClick()
    }
    return (
        <button
            className={`button-btn-Venda ${ativo ? "ativo" : ""}`}
            onClick={handleClick}
        >
            <div className='container-btn-categoriaVenda'>
                <img src={semAlcoolImg} alt="icone" />
                <p className='p-btn'>SEM ALCOOL</p>
            </div>
        </button>
    )
}