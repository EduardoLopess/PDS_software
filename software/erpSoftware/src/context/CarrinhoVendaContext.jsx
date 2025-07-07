import { createContext, useContext, useMemo, useState } from "react";
import Swal from 'sweetalert2'
import { useApiProduto } from "./apiProdutoContext";


const CarrinhoVendaContext = createContext()

export const CarrinhoVendaProvider = ({ children }) => {

    const { produtoData } = useApiProduto()
    const [saborDrinkContext, setSaboDrinkContext] = useState([])
    const [iniciarVenda, setIniciarVenda] = useState(false)
    const [itensCarrinhoVenda, setItensCarrinhoVenda] = useState([])
    const [totalCarrinho, setTotalCarrinho] = useState(0)
    const [pedidoAtivo, setPedidoAtivo] = useState(false)



    const Toast = Swal.mixin({
        toast: false,
        position: 'center',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
    })

    useMemo(() => {
        const total = itensCarrinhoVenda.reduce((acc, item) => {
            const precoBase = Number(String(item.preco).replace(',', '.')) || 0;
            const precoAdicionais = (item.adicionais || []).reduce((soma, adicional) => {
                const valor = Number(String(adicional.precoAdicional).replace(',', '.')) || 0;
                return soma + valor * (adicional.quantidade || 1);
            }, 0);

            return acc + (precoBase + precoAdicionais) * item.qtd;
        }, 0);

        setTotalCarrinho(total)
    },[itensCarrinhoVenda])


    const iniciarNovaVenda = () => {
        
        setIniciarVenda(true)
    }

    const adicionarItemCarrinhoVenda = (produtoId) => {
        if (!Array.isArray(produtoData) || produtoData.length === 0)
            return;

        const produto = produtoData.find(p => p.id === produtoId);
        if (!produto) return;


        setItensCarrinhoVenda(prevCarrinho => {
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
                    categoria: produto.categoriaProduto,
                    preco: produto.precoProdutoFormatado,
                    tipo: produto.tipoProduto,
                    qtd: 1,
                    adicionais: [],
                    adicionaisKey: '',
                }];
            }
        })
        Toast.fire({
            icon: 'success',
            title: 'Item salvo com sucesso!',
            customClass: { popup: 'mini-toast' }
        });




    }

    const adicionarDrinkSaborCarrinhoVenda = (idSabor, idDrink) => {

        const drink = produtoData.find(p => p.id === idDrink)
        const sabor = saborDrinkContext.find(s => s.id === idSabor)

        const drinkSabor = {
            id: drink.id,
            nome: drink.nomeProduto,
            tipo: drink.tipoProduto,
            preco: drink.precoProdutoFormatado,
            sabor: sabor.nomeSabor,
            idSabor: sabor.id
        }

        setItensCarrinhoVenda(prevCarrinho => {
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


    const adicionarAdicionalCarrinhoVenda = (item) => {
        console.log("ITEM CONTEXT::\n", JSON.stringify(item, null, 2));

        setItensCarrinhoVenda(prevCarrinho => {
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
        })
    }



    const dividirConta = () => {

    }



    const cancelarVenda = () => {
        setIniciarVenda(false)
        setItensCarrinhoVenda([])
        Toast.fire({
            icon: 'info',
            title: 'Venda Cancelada.',
        });
        
    }


    const removerItemVenda = (id, categoria, idSabor, adicionaisKey = '') => {
        // 1. Log inicial: Mostra os parâmetros que a função recebeu
        console.log('--- Chamada de removerItemVenda ---');
        console.log('Parâmetros recebidos:');
        console.log('  id:', id);
        console.log('  categoria:', categoria);
        console.log('  idSabor:', idSabor);
        console.log('  adicionaisKey (ignorando por agora):', adicionaisKey); // Manter por ser parte do seu código original

        setItensCarrinhoVenda(prevCarrinho => {
            // 2. Log do estado anterior do carrinho
            console.log('Estado anterior do carrinho:', JSON.parse(JSON.stringify(prevCarrinho)));

            let itemRemovido = false; // Flag para garantir que removemos apenas um

            const novoCarrinho = prevCarrinho.map(item => {
                // Se o item já foi removido, apenas o retorne sem modificação
                if (itemRemovido) {
                    return item;
                }

                // 3. Log de cada item sendo iterado e suas propriedades
                console.log('\nAnalisando item no carrinho:');
                console.log('  ID do item:', item.id);
                console.log('  Categoria do item:', item.categoria);
                console.log('  Sabor do item:', item.idSabor);
                console.log('  Qtd do item:', item.qtd);


                // 4. Logs das condições de correspondência (antes de serem usadas no IF)
                const isMatchExatoComSabor = idSabor && // A chamada de remoção especificou um sabor
                    item.id === id &&
                    item.categoria === categoria &&
                    item.idSabor === idSabor; // O item no carrinho tem o MESMO sabor
                console.log('    isMatchExatoComSabor:', isMatchExatoComSabor);


                const isMatchSemSabor = !idSabor && // A chamada de remoção NÃO especificou sabor
                    item.id === id &&
                    item.categoria === categoria &&
                    !item.idSabor; // O item no carrinho NÃO tem sabor
                console.log('    isMatchSemSabor:', isMatchSemSabor);


                const isMatchDrinkQualquerSaborFallback = !idSabor && // A chamada de remoção NÃO especificou sabor
                    item.id === id &&
                    categoria === 'Drink' && // A categoria que estamos removendo é 'Drink'
                    !!item.idSabor; // O item no carrinho TEM um sabor (é saborizado)
                console.log('    isMatchDrinkQualquerSaborFallback:', isMatchDrinkQualquerSaborFallback);


                // Lógica de prioridade de remoção
                if (isMatchExatoComSabor) {
                    console.log(`---> CORRESPONDÊNCIA EXATA COM SABOR ENCONTRADA. Removendo: ID=${id}, Sabor=${idSabor}`);
                    itemRemovido = true;
                    if (item.qtd > 1) {
                        return { ...item, qtd: item.qtd - 1 };
                    } else {
                        return null; // Remove o item
                    }
                } else if (isMatchSemSabor) {
                    console.log(`---> CORRESPONDÊNCIA SEM SABOR ENCONTRADA. Removendo: ID=${id}`);
                    itemRemovido = true;
                    if (item.qtd > 1) {
                        return { ...item, qtd: item.qtd - 1 };
                    } else {
                        return null;
                    }
                } else if (isMatchDrinkQualquerSaborFallback) {
                    console.log(`---> CORRESPONDÊNCIA FALLBACK (Drink com qualquer sabor). Removendo: ID=${id}, Sabor no carrinho=${item.idSabor}`);
                    itemRemovido = true;
                    if (item.qtd > 1) {
                        return { ...item, qtd: item.qtd - 1 };
                    } else {
                        return null;
                    }
                }

                return item; // Retorna o item inalterado se não corresponder
            }).filter(Boolean); // Filtra os itens que foram marcados como null (removidos)

            // 5. Log do estado final do carrinho após a remoção (antes do setItensCarrinhoVenda)
            console.log('Novo estado do carrinho (a ser setado):', JSON.parse(JSON.stringify(novoCarrinho)));
            console.log('Item realmente removido nesta iteração?', itemRemovido);

            // Dispara o Toast apenas se um item foi realmente removido.
            if (itemRemovido) {
                Toast.fire({
                    icon: 'error',
                    title: 'ITEM REMOVIDO.',
                });
            }

            return novoCarrinho;
        });
    };

    const removerAdicionalDoItemCarrinhoVenda = (produtoId, adicionalId, adicionaisKey) => {
        setItensCarrinhoVenda(prevCarrinho => {
            return prevCarrinho.map(item => {
                if (item.id !== produtoId) return item;
                if ((item.adicionaisKey || '') !== (adicionaisKey || '')) return item; 

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
        
    }

    const divirItem = () => {

    }

    const salvarVendaPedido = () => {
        //transfeier venda para uma mesa e criar um pedido
    }

    return (
        <CarrinhoVendaContext.Provider value={{
            iniciarVenda,
            iniciarNovaVenda,
            removerItemVenda,
            cancelarVenda,
            removerAdicionalDoItemCarrinhoVenda,
            itensCarrinhoVenda,
            totalCarrinho,
            adicionarDrinkSaborCarrinhoVenda,
            adicionarItemCarrinhoVenda,
            setSaboDrinkContext,
            adicionarAdicionalCarrinhoVenda,
            setPedidoAtivo

        }}>
            {children}
        </CarrinhoVendaContext.Provider>
    )
}

export const useCarrinhoVenda = () => useContext(CarrinhoVendaContext)