import '../produto-categoria-style/Produto-Categoria-style.css'
import alaminuta from '../../../assets/alaminuta.png'


export const AlaMinutaCategoria = ({ativo, setTituloCategoria, onClick}) => {
    
    const handleClick = () => {
        setTituloCategoria("À ALA MINUTA")
        if (onClick) onClick()
    }
    return (
        <button 
            className={`btnStyleAtivo ${ativo ? "ativo" : ""}`}
            style={{ all: "unset", cursor: "pointer" }}
            onClick={handleClick}
            >
            <div className='cardProduto-container'>
                <div className='cardProduto-img'>
                    <img src={alaminuta} alt="categoria" />
                </div>
                <div className='cardProduto-categoria'>
                    <p>À ALA MINUTA</p>
                </div>

            </div>
        </button>
    )
}