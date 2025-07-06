import { useSteps } from "@chakra-ui/react"
import { createContext, useContext, useEffect, useState } from "react"
import Swal from 'sweetalert2'
import { usePedido } from "./PedidoContext"
import { useApiProduto } from "./apiProdutoContext"

const CarrinhoContext = createContext()

export const CarrinhoProvider = ({ children }) => {

    const { produtoData } = useApiProduto()
    const [carrinhoVisivel, setCarrinhoVisivel] = useState(false)
    const [saborDataContext, setSaborDataContext] = useState([])
    const [adicionalDataContext, setAdicionalDataContext] = useState([])
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
        if (!Array.isArray(produtoData) || produtoData.length === 0)
            return;

        const produto = produtoData.find(p => p.id === produtoId)

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

        const drink = produtoData.find(p => p.id === idDrink)
        const sabor = saborDataContext.find(s => s.id === idSabor)

        if (!drink || !sabor) {

            Toast.fire({ icon: 'error', title: 'Mesa inválida!', idDrink, idSabor });
            return;
        }


        const drinkSabor = {
            id: drink.id,
            nome: drink.nomeProduto,
            tipo: drink.tipoProduto,
            preco: drink.precoProdutoFormatado,
            sabor: sabor.nomeSabor,
            idSabor: sabor.id
        }

        console.log("DRINK CONTEXT:\n", JSON.stringify(drinkSabor, null, 2))

        setItemCarrinho(prevCarrinho => {
            const itemPresente = prevCarrinho
                .find(item => item.id === idDrink && item.idSabor === idSabor)

            if (itemPresente) {
                return prevCarrinho.map(drinkSabor =>
                    drinkSabor.id === idDrink && drinkSabor.idSabor === idSabor
                        ? { ...drinkSabor, qtd: itemPresente.qtd + 1 }
                        : drinkSabor
                )
            } else {
                const itemParaCarrinho = { ...drinkSabor, qtd: 1 }
                return [...prevCarrinho, itemParaCarrinho]
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

    const adcionarAdicionalCarrinho = (item) => {
        console.log("ITEM CONTEXT::\n", JSON.stringify(item, null, 2));

        setItemCarrinho(prevCarrinho => {
            // Cria um identificador único para esse conjunto de adicionais
            const adicionaisKey = item.adicionais
                .map(adc => `${adc.id}-${adc.quantidade}`)
                .sort() // importante para garantir ordem previsível
                .join(',');

            // Verifica se já existe item igual no carrinho
            const itemExistente = prevCarrinho.find(carrinhoItem => {
                if (carrinhoItem.id !== item.produto.id) return false;
                if (!carrinhoItem.adicionaisKey) return false;

                return carrinhoItem.adicionaisKey === adicionaisKey;
            });

            if (itemExistente) {
                // Se já existe, apenas incrementa a quantidade
                return prevCarrinho.map(carrinhoItem =>
                    carrinhoItem.id === item.produto.id && carrinhoItem.adicionaisKey === adicionaisKey
                        ? { ...carrinhoItem, qtd: carrinhoItem.qtd + 1 }
                        : carrinhoItem
                );
            } else {

                const novoItem = {
                    id: item.produto.id,
                    nome: item.produto.nomeProduto,
                    preco: item.produto.precoProdutoFormatado,
                    tipo: item.produto.tipoProduto,
                    adicionais: item.adicionais,
                    adicionaisKey: adicionaisKey,
                    qtd: 1
                };
                return [...prevCarrinho, novoItem];
            }

        });
        Toast.fire({
            icon: 'success',
            title: 'Item salvo com sucesso!',
            customClass: {
                popup: 'mini-toast'
            }
        })


    };


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

            setSaborDataContext,
            setAdicionalDataContext,
            totalItens,
            setCarrinhoVisivel,
            setItemCarrinho
        }}>
            {children}
        </CarrinhoContext.Provider>
    )
}

export const useCarrinho = () => useContext(CarrinhoContext)