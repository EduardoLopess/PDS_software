export const BtnCriarAdicional = ({ setTitulo, onClick, ativo }) => {
  const handleClick = () => {
    setTitulo("CADASTRAR ADICIONAL");
    if (onClick) onClick(); 
 };

  return (
    <button
      className={`btnCadastro ${ativo ? "ativo" : ""}`}
      onClick={handleClick}
    >
      <p>CADASTRAR ADICIONAL</p>
    </button>
  );
};
