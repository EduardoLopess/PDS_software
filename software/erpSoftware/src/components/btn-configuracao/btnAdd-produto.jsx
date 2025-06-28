import './btn-Styles.css'
export const BtnCriarProduto = ({setTitulo, onClick, ativo}) => {
    const handleClick = () => {
        setTitulo("CADASTRAR PRODUTO")
        if (onClick) onClick()
    }

    return (
       <button className={`btnCadastro ${ativo ? "ativo" : ""}`}
        onClick={handleClick}
       >
        <p>CADASTRAR PRODUTO</p>
       </button>
    )
}