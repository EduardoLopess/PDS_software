import './Btn-Categoria-VendaScreen.css'
import drinkImg from '../../assets/drink.png'

export const BtnDrinkVenda = ({ ativo, setTituloCategoria, onClick }) => {

    const handleClick = () => {
        setTituloCategoria("DRINKS")
        if (onClick) onClick()
    }
    return (
        <button
            className={`button-btn-Venda ${ativo ? "ativo" : ""}`}
            onClick={handleClick}
        >
            <div className='container-btn-categoriaVenda'>
                <img src={drinkImg} alt="icone" />
                <p className='p-btn'>DRINK</p>
            </div>
        </button>
    )
}
