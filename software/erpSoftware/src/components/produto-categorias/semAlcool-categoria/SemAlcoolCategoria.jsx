import '../produto-categoria-style/Produto-Categoria-style.css'

import semAlcool from '../../../assets/noalcool.png'


export const SemAlcoolCategoria = ({ativo, setTituloCategoria, onClick}) => {
    const handleClick = () => {
        setTituloCategoria("SEM ALCOOL")
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
                    <img src={semAlcool} alt="categoria" />
                </div>
                <div className='cardProduto-categoria'>
                    <p>SEM ALCOOL</p>
                </div>

            </div>
        </button>
    )
}