import { createContext, useContext, useEffect, useState } from "react"

const CarrinhoContext = createContext()

export const CarrinhoProvider = ({children}) => {

    const [carrinhoVisivel, setCarrinhoVisivel] = useState(false)
    const [itemCarrinho, setItemCarrinho] = useState([1])


    useEffect(() => {
        if (itemCarrinho.length === 0) {
            setCarrinhoVisivel(false)
        } else {
            setCarrinhoVisivel(true)
        }
    },[itemCarrinho])

    return (
        <CarrinhoContext.Provider value={{
            carrinhoVisivel
        }}>
            {children}
        </CarrinhoContext.Provider>
    )
}

export const useCarrinho = () => useContext(CarrinhoContext)