import './Btn-Categoria-VendaScreen.css'
import cervejaImg from '../../assets/cerveja.png'

export const BtnCervejaVenda = ({ ativo, setTituloCategoria, onClick }) => {

    const handleClick = () => {
        setTituloCategoria("CERVEJAS")
        if (onClick) onClick()
    }

    return (
        <button
            className={`button-btn-Venda ${ativo ? "ativo" : ""}`}
            onClick={handleClick}
        >
            <div className='container-btn-categoriaVenda'>
                <img src={cervejaImg} alt="icone" />
                <p className='p-btn'>CERVEJA</p>
            </div>
        </button>
    )
}