import './Btn-Categoria-VendaScreen.css'
import alaminutaImg from '../../assets/alaminuta.png'

export const BtnAlaminutaVenda = ({ ativo, setTituloCategoria, onClick }) => {

    const handleClick = () => {
        setTituloCategoria("À ALAMINUTAS")
        if (onClick) onClick()
    }

    return (
       <button
            className={`button-btn-Venda ${ativo ? "ativo" : ""}`}
            onClick={handleClick}
        >
            <div className='container-btn-categoriaVenda'>
                <img src={alaminutaImg} alt="icone" />
                <p className='p-btn'>À ALA MINUTA</p>
            </div>
        </button>
    )
}