import { createContext, useContext, useEffect, useState } from "react"
import Swal from 'sweetalert2'
import { useApiProduto } from "./apiProdutoContext"
import { useCarrinhoVenda } from "./CarrinhoVendaContext" // Certifique-se de que está importado

const CarrinhoContext = createContext()

export const CarrinhoProvider = ({ children }) => {

    const { produtoData } = useApiProduto()
    // 1. Importe 'iniciarVenda' do useCarrinhoVenda para usar como condição
    const { setPedidoAtivo, iniciarVenda } = useCarrinhoVenda() 

    // 1. Carregar itemCarrinho do localStorage na inicialização
    const [itemCarrinho, setItemCarrinhoState] = useState(() => {
        try {
            const localCarrinho = localStorage.getItem('carrinhoItens'); // Chave para o carrinho
            return localCarrinho ? JSON.parse(localCarrinho) : [];
        } catch (error) {
            console.error("Falha ao carregar itemCarrinho do localStorage:", error);
            return [];
        }
    });

    const [carrinhoVisivel, setCarrinhoVisivelState] = useState(() => {
        try {
            const localVisivel = localStorage.getItem('carrinhoVisivel')
            return localVisivel ? JSON.parse(localVisivel) : false;
        } catch (error) {
            console.error("Falha ao carregar carrinhoVisivel do localStorage:", error);
            return false;
        }
    });

    const [saborDataContext, setSaborDataContext] = useState([])
    const [adicionalDataContext, setAdicionalDataContext] = useState([])
    const [totalItens, setTotalItens] = useState(0)

    // AQUI É ONDE VOCÊ FARÁ A ALTERAÇÃO
    useEffect(() => {
        if (itemCarrinho.length === 0) {
            setCarrinhoVisivelState(false);
            setTotalItens(0);
            setPedidoAtivo(false); // Se não há itens, não há pedido ativo
            return;
        }

        setCarrinhoVisivelState(true); // Define a visibilidade do carrinho como verdadeira

        const total = itemCarrinho.reduce((acc, item) => {
            const precoBase = Number(String(item.preco).replace(',', '.')) || 0;
            const precoAdicionais = (item.adicionais || []).reduce((soma, adicional) => {
                const valor = Number(String(adicional.precoAdicional).replace(',', '.')) || 0;
                return soma + valor * (adicional.quantidade || 1);
            }, 0);

            return acc + (precoBase + precoAdicionais) * item.qtd;
        }, 0);

        setTotalItens(total);

        // LÓGICA PARA setPedidoAtivo(true) AQUI
        // Verifica se há itens no carrinho E se uma venda foi iniciada (implicando uma mesa ativa)
        if (itemCarrinho.length > 0 && iniciarVenda) {
            setPedidoAtivo(true);
        } else {
            setPedidoAtivo(false); // Caso contrário, se a venda não foi iniciada ou carrinho vazio
        }
    }, [itemCarrinho, iniciarVenda, setPedidoAtivo]); // Adicione iniciarVenda e setPedidoAtivo às dependências

    useEffect(() => {
        localStorage.setItem('carrinhoItens', JSON.stringify(itemCarrinho));
    }, [itemCarrinho]);

    useEffect(() => {
        localStorage.setItem('carrinhoVisivel', JSON.stringify(carrinhoVisivel));
    }, [carrinhoVisivel]);

    const Toast = Swal.mixin({
        toast: false,
        position: 'center',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
    });

    const setItemCarrinho = (newState) => setItemCarrinhoState(newState);
    const setCarrinhoVisivel = (newState) => setCarrinhoVisivelState(newState);

    const adicionarItemCarrinho = (produtoId) => {
        if (!Array.isArray(produtoData) || produtoData.length === 0)
            return;

        const produto = produtoData.find(p => p.id === produtoId);

        if (!produto) return;

        setItemCarrinho(prevCarrinho => {
            const produtoPresente = prevCarrinho.find(
                item => item.id === produtoId && (!item.adicionais || item.adicionais.length === 0)
            );

            if (produtoPresente) {
                return prevCarrinho.map(item =>
                    item.id === produtoId && (!item.adicionais || item.adicionais.length === 0)
                        ? { ...item, qtd: item.qtd + 1 }
                        : item
                );
            } else {
                return [...prevCarrinho, {
                    id: produto.id,
                    nome: produto.nomeProduto,
                    preco: produto.precoProdutoFormatado,
                    tipo: produto.tipoProduto,
                    qtd: 1,
                    adicionais: [],
                    adicionaisKey: '',
                }];
            }
        });

        Toast.fire({
            icon: 'success',
            title: 'Item salvo com sucesso!',
            customClass: { popup: 'mini-toast' }
        });
    };

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
            const adicionaisKey = item.adicionais
                .map(adc => `${adc.id}-${adc.quantidade}`)
                .sort()
                .join(',');

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
        });
    };

    const removerItemCarrinho = (id, categoria, idSabor, adicionaisKey = '') => {
        setItemCarrinho(prevCarrinho => {
            const updatedCarrinho = prevCarrinho.map(item => {
                const isMatchingItem = item.id === id &&
                    (item.categoria === categoria || item.tipo === categoria) && // Use categoria ou tipo para match
                    (idSabor ? item.idSabor === idSabor : !item.idSabor) && // Match exato de sabor ou ausência de sabor
                    (adicionaisKey ? item.adicionaisKey === adicionaisKey : !item.adicionaisKey); // Match exato de adicionais ou ausência de adicionais

                if (isMatchingItem) {
                    if (item.qtd > 1) {
                        return { ...item, qtd: item.qtd - 1 };
                    } else {
                        return null; // Será filtrado abaixo
                    }
                }
                return item;
            }).filter(Boolean); // remove os nulls

            if (updatedCarrinho.length < prevCarrinho.length || 
                (updatedCarrinho.length === prevCarrinho.length && updatedCarrinho.some((item, index) => item.qtd < prevCarrinho[index].qtd))) {
                Toast.fire({
                    icon: 'error',
                    title: 'ITEM REMOVIDO.',
                });
            }
            return updatedCarrinho;
        });
    };

    const removerAdicionalDoItemCarrinho = (produtoId, adicionalId, adicionaisKey) => {
        setItemCarrinho(prevCarrinho => {
            return prevCarrinho.map(item => {
                if (item.id !== produtoId) return item;
                if ((item.adicionaisKey || '') !== (adicionaisKey || '')) return item; // só altera o item com a chave correta

                if (!item.adicionais || item.adicionais.length === 0) return item;

                const adicionalPresente = item.adicionais.find(adicional => adicional.id === adicionalId);

                if (adicionalPresente) {
                    let novosAdicionais;

                    if (adicionalPresente.quantidade > 1) {
                        novosAdicionais = item.adicionais.map(adicional =>
                            adicional.id === adicionalId
                                ? { ...adicional, quantidade: adicional.quantidade - 1 }
                                : adicional
                        );
                    } else {
                        novosAdicionais = item.adicionais.filter(adicional => adicional.id !== adicionalId);
                    }

                    const novosAdicionaisKey = novosAdicionais.length > 0
                        ? novosAdicionais.map(a => `${a.id}-${a.quantidade}`).sort().join(',')
                        : '';

                    return {
                        ...item,
                        adicionais: novosAdicionais,
                        adicionaisKey: novosAdicionaisKey,
                    };
                }

                return item;
            });
        });

        Toast.fire({
            icon: 'info',
            title: 'Adicional removido.',
        });
    };

    return (
        <CarrinhoContext.Provider value={{
            carrinhoVisivel,
            itemCarrinho,
            adicionarItemCarrinho,
            adcionarAdicionalCarrinho,
            adicionarSaborCarrinho,
            removerItemCarrinho,
            removerAdicionalDoItemCarrinho,
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