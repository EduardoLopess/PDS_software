import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MesaScreen } from "./screens/mesas-screen/Index";
import { ProdutoScreen } from "./screens/produtos-screen/Produtos-Screen";
import { MenuNavegacao } from "./navigation/Menu-Navigation";
import { PedidoScreen } from "./screens/pedidos-screen/Index";
import { ConfiguracaoScreen } from "./screens/configuracao-screen/Index";
import { VendaScreen } from "./screens/venda-screen/Index";
import { PedidoProvider } from "./context/PedidoContext";
import { CarrinhoProvider } from "./context/CarrinhoContext";
import { PedidoView } from "./screens/pedidos-screen/PedidoView";
import { APIprodutoProvider } from "./context/apiProdutoContext";
import { CarrinhoVendaProvider } from "./context/CarrinhoVendaContext";



function App() {


  return (

    <BrowserRouter>
      <APIprodutoProvider>
        <CarrinhoVendaProvider>
          <CarrinhoProvider>
            <PedidoProvider>
              <MenuNavegacao />
              <Routes>
                <Route path='/' element={<MesaScreen />} />
                <Route path='/venda' element={<VendaScreen />} />
                <Route path='/produtos' element={<ProdutoScreen />} />
                <Route path='/pedidos' element={<PedidoView />} />
                <Route path='/configuracao' element={<ConfiguracaoScreen />} />
              </Routes>
            </PedidoProvider>
          </CarrinhoProvider>
        </CarrinhoVendaProvider>
      </APIprodutoProvider>
    </BrowserRouter>

  )
}

export default App;
