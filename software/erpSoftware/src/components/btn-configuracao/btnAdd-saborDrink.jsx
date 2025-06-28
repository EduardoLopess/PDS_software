import './btn-Styles.css'

export const BtnCriarSaborDrink = ({setTitulo, onClick, ativo}) => {

    const handleClick = () => {
        setTitulo("CADASTRAR SABOR")
        if (onClick) onClick()
    }

    return ( 
        <button className={`btnCadastro ${ativo ? "ativo" : ""}`}
            onClick={handleClick}
        >
            <p>CADASTRAR SABOR</p>
        </button>
    )
}