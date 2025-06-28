import '../produto-categoria-style/Produto-Categoria-style.css'
import drink from '../../../assets/drink.png'

export const DrinkCategoria = ({ativo, setTituloCategoria, onClick}) => {

    const handleClick = () => {
        setTituloCategoria("DRINKS")
        if (onClick) onClick();
    }   
    return (
        <button 
            className={`btnStyleAtivo ${ativo ? "ativo" : ""}`}
            style={{ all: "unset", cursor: "pointer" }}s
            onClick={handleClick}
            >
            <div className='cardProduto-container'>
                <div className='cardProduto-img'>
                    <img src={drink} alt="categoria" />
                </div>
                <div className='cardProduto-categoria'>
                    <p>DRINKS</p>
                </div>

            </div>
        </button>
    )
}