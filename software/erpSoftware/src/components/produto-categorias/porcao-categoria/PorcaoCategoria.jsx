import '../produto-categoria-style/Produto-Categoria-style.css'
import porcao from '../../../assets/porcao.png'

export const PorcaoCategoria = ({ativo, setTituloCategoria, onClick}) => {
    
    const handleClick = () => {
        setTituloCategoria("PORÇÕES")
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
                    <img src={porcao} alt="categoria" />
                </div>
                <div className='cardProduto-categoria'>
                    <p>PORÇÕES</p>
                </div>

            </div>
        </button>
    )
}