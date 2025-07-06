import { useEffect, useState } from 'react';
import { FormatarTiposProdutos } from '../../../utils/FormatarTipos';
import '../produto-categoria-style/Item-Categoria-Style.css'
import { getSabor } from '../../../service/api/SaborService'
import { useCarrinho } from '../../../context/CarrinhoContext';
import Swal from 'sweetalert2'
import { IoPencilOutline } from "react-icons/io5";



export const Drink = ({ produtos, numeroMesaPedido }) => {

    const { setSaborDataContext, adicionarSaborCarrinho, adicionarItemCarrinho } = useCarrinho()
    const [saborData, setSaborData] = useState([])



    useEffect(() => {
        getSabor()
            .then(res => {
                console.log("Respota api SABOR: ", res.data)
                setSaborData(res.data.data)
                setSaborDataContext(res.data.data)
            })
            .catch(err => console.error("Erro ao buscar sabores.", err))
    }, [])


    const tipoDrink = (idDrink) => {
        const drink = produtos.find(item => item.id === idDrink);

        if (!drink) {
            alert("DRINK NÃO ENCONTRADO");
            return;
        }

        if (drink.tipoProduto === 'Caipirinha') {
            alert('É CAIPIRINHA');
            abrirModalEscolhaSabor(saborData, idDrink)
        } else {
            adicionarItemCarrinho(idDrink)
        }
    };



    const abrirModalEscolhaSabor = (saborData, idDrinkState) => {
        const opcoes = saborData
            .filter(s => s.disponivel)
            .reduce((acc, sabor) => {
                acc[sabor.id] = sabor.nomeSabor
                return acc
            }, {})

        Swal.fire({
            title: 'Escolha o sabor',
            input: 'select',
            inputOptions: opcoes,
            inputPlaceholder: 'Selecione um sabor',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            customClass: {
                input: 'swal-centralizar-select'
            },
            preConfirm: (selectedId) => {
                if (!selectedId) {
                    Swal.showValidationMessage('Você precisa escolher um sabor!')
                    return false
                } else {
                    const sabor = saborData.find(s => String(s.id) === String(selectedId))
                    return adicionarSaborCarrinho(sabor.id, idDrinkState)
                }

            }
        });

    }


    if (!Array.isArray(produtos)) {
        return null;
    }

    if (produtos.length === 0) {
        return <p style={{ textAlign: 'center' }}>Nenhum produto disponível nesta categoria.</p>;
    }

    const grupos = produtos.reduce((acc, produto) => {
        const tipo = produto.tipoProduto || 'Outros'
        if (!acc[tipo]) acc[tipo] = []
        acc[tipo].push(produto)
        return acc
    }, {})

    return (
        <div className='container-coteudo-item'>
            {Object.keys(grupos).map((tipo) => (
                <div key={tipo} className='grupo-tipo-produto'>
                    <div className='titulo-conteudo-item'>
                        <p>{FormatarTiposProdutos(tipo)}</p>
                    </div>

                    {grupos[tipo].map((produto) => (
                        <div key={produto.id} className='item-produto'>
                            <div className='conteudo-container'>
                                <div className='conteudo-tipo-item'>
                                    <p>{produto.categoriaProduto}</p>
                                </div>
                                <div className='conteudo-nome-item'>
                                    <p>{produto.nomeProduto}</p>
                                </div>
                                <div className='conteudo-preco-item'>
                                    <p>R$: {produto.precoProdutoFormatado}</p>
                                </div>
                                <div className='conteudo-disponivel-item'>
                                    <p>{produto.disponibilidadeProduto ? 'Disponível' : 'Indisponível'}</p>
                                </div>
                                <div className='conteudo-btn-item'>
                                    {numeroMesaPedido !== '' && numeroMesaPedido !== null ? (
                                        <button onClick={() => adicionarItemCarrinho(produto.id)}>
                                            <p>+</p>
                                        </button>
                                    ) : (
                                        <button style={{ background: 'none' }} onClick={() => editarProduto(produto)}>
                                            <IoPencilOutline size={24} />
                                        </button>
                                    )}

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );



}