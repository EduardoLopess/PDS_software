import { useSteps } from "@chakra-ui/react"
import { createContext, useContext, useEffect, useState } from "react"
import Swal from 'sweetalert2'
import { usePedido } from "./PedidoContext"

const CarrinhoContext = createContext()

export const CarrinhoProvider = ({ children }) => {


    const [carrinhoVisivel, setCarrinhoVisivel] = useState(false)
    const [produtosDataContext, setProdutosDataContext] = useState([])
    const [itemCarrinho, setItemCarrinho] = useState([])
    const [totalItens, setTotalItens] = useState()


    useEffect(() => {
        if (itemCarrinho.length === 0) {
            setCarrinhoVisivel(false)
        } else {
            setCarrinhoVisivel(true)
        }

        const total = itemCarrinho.reduce((acc, item) => {
            const precoNum = Number(item.preco.replace(',', '.')) || 0
            return acc + precoNum * item.qtd
        }, 0)

        setTotalItens(total)

    }, [itemCarrinho])


    const Toast = Swal.mixin({
        toast: false, // <-- MUITO IMPORTANTE: vira modal real
        position: 'center',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
    })




    const adicionarItemCarrinho = (produtoId) => {
        if (!Array.isArray(produtosDataContext) || produtosDataContext.length === 0)
            return;

        const produto = produtosDataContext.find(p => p.id === produtoId)

        if (!produto) {
            return
        }

        setItemCarrinho(prevCarrinho => {
            const produtoPresente = prevCarrinho.find(
                item => item.id === produtoId
            )

            if (produtoPresente) {
                return prevCarrinho.map(item =>
                    item.id === produtoId
                        ? { ...item, qtd: item.qtd + 1 }
                        : item
                )
            } else {
                return [...prevCarrinho, {
                    id: produto.id,
                    nome: produto.nomeProduto,
                    preco: produto.precoProdutoFormatado,
                    tipo: produto.tipoProduto,
                    qtd: 1
                }]
            }

        })
        Toast.fire({
            icon: 'success',
            title: 'Item salvo com sucesso!',
            customClass: {
                popup: 'mini-toast'
            },
            didOpen: () => {
                const popup = document.querySelector('.mini-toast')
                if (popup) {
                    popup.style.width = '250px'
                    popup.style.fontSize = '14px'
                    popup.style.padding = '10px'
                }

                const progressBar = document.querySelector('.swal2-timer-progress-bar')
                if (progressBar) {
                    progressBar.style.backgroundColor = '#4caf50'
                    progressBar.style.height = '4px'
                }
            }
        })



    }

    const adicionarSaborCarrinho = (idSabor, idDrink) => {

    }

    const adcionarAdicionalCarrinho = () => {

    }

    const removerItemCarrinho = (id, categoria, idSabor) => {
        if (idSabor) {
            setItemCarrinho(prevCarrinho => {
                const itemPresente = prevCarrinho.find(item => item.id === id && item.idSabor === idSabor);

                if (itemPresente) {
                    if (itemPresente.qtd > 1) {
                        return prevCarrinho.map(drinkSabor =>
                            drinkSabor.id === id && drinkSabor.idSabor === idSabor
                                ? { ...drinkSabor, qtd: drinkSabor.qtd - 1 }
                                : drinkSabor
                        );
                    } else {
                        return prevCarrinho.filter(drinkSabor =>
                            drinkSabor.id !== id || drinkSabor.idSabor !== idSabor
                        );
                    }
                } else {
                    return prevCarrinho;
                }
            });
        } else {
            setItemCarrinho(prevCarrinho => {
                const itemPresente = prevCarrinho.find(itemCarrinho => itemCarrinho.id === id && itemCarrinho.categoria === categoria);

                if (itemPresente) {
                    if (itemPresente.qtd > 1) {
                        return prevCarrinho.map(itemCarrinho =>
                            itemCarrinho.id === id && itemCarrinho.categoria === categoria
                                ? { ...itemCarrinho, qtd: itemCarrinho.qtd - 1 }
                                : itemCarrinho
                        );
                    } else {

                        return prevCarrinho.filter(itemCarrinho =>
                            itemCarrinho.id !== id || itemCarrinho.categoria !== categoria
                        );
                    }
                }

                return prevCarrinho;
            });
            Toast.fire({
                icon: 'error',
                title: 'ITEM REMOVIDO.',
            })
        }
    }



    return (
        <CarrinhoContext.Provider value={{
            carrinhoVisivel,
            itemCarrinho,
            adicionarItemCarrinho,
            adcionarAdicionalCarrinho,
            adicionarSaborCarrinho,
            removerItemCarrinho,
            setProdutosDataContext,
            totalItens,
            setCarrinhoVisivel,
            setItemCarrinho
        }}>
            {children}
        </CarrinhoContext.Provider>
    )
}

export const useCarrinho = () => useContext(CarrinhoContext)