import './btn-Styles.css'
export const BtnCriarMesa = ({setTitulo, onClick, ativo}) => {

    const handleClick = () => {
        setTitulo("CADASTRAR MESA")
        if (onClick) onClick()
    }

    return (
        <button className={`btnCadastro ${ativo ? "ativo" : ""}`}
            onClick={handleClick}
        >
            <p>CADASTRAR MESA</p>
        </button>
    )
}