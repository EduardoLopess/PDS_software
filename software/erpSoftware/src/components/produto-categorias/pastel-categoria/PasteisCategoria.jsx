import '../produto-categoria-style/Produto-Categoria-style.css'
import pastel from '../../../assets/pastel.png'

export const PasteisCategoria = ({ativo, setTituloCategoria, onClick}) => {
   

    const handleClick = () => {
        setTituloCategoria("PASTEIS")
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
                    <img src={pastel} alt="categoria" />
                </div>
                <div className='cardProduto-categoria'>
                    <p>PASTEIS</p>
                </div>

            </div>
        </button>
    )
}