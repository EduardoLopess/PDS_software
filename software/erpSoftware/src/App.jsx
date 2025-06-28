import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MesaScreen } from "./screens/mesas-screen/Index";
import { ProdutoScreen } from "./screens/produtos-screen/Produtos-Screen";
import { MenuNavegacao } from "./navigation/Menu-Navigation";
import { PedidoScreen } from "./screens/pedidos-screen/Index";
import { ConfiguracaoScreen } from "./screens/configuracao-screen/Index";
import { VendaScreen } from "./screens/venda-screen/Index";



function App() {
  

  return (
   <BrowserRouter>
    <MenuNavegacao/>
    <Routes>
      <Route path='/' element = {<MesaScreen/>}/>
      <Route path='/venda' element = {<VendaScreen/>}/>
      <Route path='/produtos' element = {<ProdutoScreen/>}/>
      <Route path='/pedidos' element = {<PedidoScreen/>}/>
      <Route path='/configuracao' element = {<ConfiguracaoScreen/>}/>
    </Routes>
   
   
   </BrowserRouter>
  )
}

export default App;
