import '../produto-categoria-style/Produto-Categoria-style.css'
import cerveja from '../../../assets/cerveja.png'

export const CervejaCategoria = ({ativo, setTituloCategoria, onClick}) => {
    
    const handleClick = () => {
        setTituloCategoria("CERVEJAS")
        if (onClick) onClick();
    }
    
    return (
        <button 
            className={`btnStyleAtivo ${ativo ? "ativo" : ""}`}
            style={{ all: "unset", cursor: "pointer" }}
            onClick={handleClick}
            >
            <div className='cardProduto-container'>
                <div className='cardProduto-img'>
                    <img src={cerveja} alt="categoria" />
                </div>
                <div className='cardProduto-categoria'>
                    <p>CERVEJAS</p>
                </div>

            </div>
        </button>
    
    )
}            