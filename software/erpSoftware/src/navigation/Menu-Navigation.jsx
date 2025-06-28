import { NavLink, useLocation } from 'react-router-dom';
import './Menu-Navigation-Styles.css';
import mesa from '../assets/icons/mesa.svg';
import pedido from '../assets/icons/pedido.svg';
import venda from '../assets/icons/venda.svg';
import produto from '../assets/icons/produto.svg';
import configuracao from '../assets/icons/configuracao.svg';

export const MenuNavegacao = () => {
    const location = useLocation();

    return (
        <div className="container-menu">
            <div className={`container-links ${location.pathname === "/venda" ? "ativo" : ""}`}>
                <img src={venda} alt="icone" width={30} height={30}/>
                <NavLink to="/venda">VENDA</NavLink>
            </div>
            <div className={`container-links ${location.pathname === "/produtos" ? "ativo" : ""}`}>
                <img src={produto} alt="icone" width={30} height={30} />
                <NavLink to="/produtos">PRODUTOS</NavLink>
            </div>
             <div className={`container-links ${location.pathname === "/" ? "ativo" : ""}`}>
                <img src={mesa} alt="icone" width={30} height={30} />
                <NavLink to="/">MESAS</NavLink>
            </div>
            <div className={`container-links ${location.pathname === "/pedidos" ? "ativo" : ""}`}>
                <img src={pedido} alt="icone" width={30} height={30} />
                <NavLink to="/pedidos">PEDIDOS</NavLink>
            </div>
            <div className={`container-links ${location.pathname === "/configuracao" ? "ativo" : ""}`}>
                <img src={configuracao} alt="icone" width={30} height={30} />
                <NavLink to="/configuracao">CONFIGURAÇÃO</NavLink>
            </div>
        </div>
    );
};
