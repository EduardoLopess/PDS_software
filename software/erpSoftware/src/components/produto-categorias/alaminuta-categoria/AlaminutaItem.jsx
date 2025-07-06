import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import { IoPencilOutline } from "react-icons/io5";
import { getAdicionais } from "../../../service/api/AdicionalService";
import { useCarrinho } from "../../../context/CarrinhoContext";

export const AlaminutaItem = ({ produtos, numeroMesaPedido }) => {

    const { adcionarAdicionalCarrinho, adicionarItemCarrinho, setAdicionalDataContext } = useCarrinho()
    const [adicionalData, setAdicionalData] = useState()

    useEffect(() => {
        getAdicionais()
            .then(res => {
                console.log("RESPOSTA API ADDC: ", res.data)
                setAdicionalData(res.data.data)
                setAdicionalDataContext(res.data.data)
            })
            .catch(err => console.log("Erro ao buscar adicionais.", err))
    }, [])

    const addAdicional = (idProduto) => {
        Swal.fire({
            title: "Algum adicional?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#4CAF50",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, adicionar",
            cancelButtonText: "Não",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                abrirModalAdicional(adicionalData, idProduto)
            } else {
                adicionarItemCarrinho(idProduto)
            }
        });
    };

    const abrirModalAdicional = (adicionalData, idProduto) => {
        if (!Array.isArray(adicionalData)) {
            Swal.fire("Erro", "Nenhum adicional disponível!", "error");
            return;
        }

        const inputsHTML = adicionalData.map(adc => `
        <div style="margin-bottom: 10px; text-align: left; height: 2rem">
            <label">
                ${adc.adicionalNome} - R$ ${adc.precoAdicionalFormatado}
                <input type="number" min="0" value="0" id="adc-${adc.id}" style="margin-left: 10px; width: 10%;" />
            </label>
        </div>
    `).join('');

        Swal.fire({
            title: 'Escolha os adicionais',
            html: `<form id="adicionais-form">${inputsHTML}</form>`,
            showCancelButton: true,
            confirmButtonText: 'Adicionar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const selecionados = adicionalData
                    .map(adc => {
                        const qtd = parseInt(document.getElementById(`adc-${adc.id}`).value, 10);
                        if (qtd && qtd > 0) {
                            return {
                                ...adc,
                                produtoId: idProduto,
                                quantidade: qtd
                            };
                        }
                        return null;
                    })
                    .filter(Boolean);

                if (selecionados.length === 0) {
                    Swal.showValidationMessage('Selecione pelo menos um adicional!');
                    return false;
                }

                return selecionados;
            }
        }).then(result => {
            if (result.isConfirmed) {
                const produto = produtos.find(p => p.id === idProduto);

                const item = {
                    produto,
                    adicionais: result.value
                };

                console.log("Item com adicionais múltiplos e quantidades:\n", JSON.stringify(item, null, 2));
                adcionarAdicionalCarrinho(item)
            }
        });
    };


    if (!Array.isArray(produtos)) {
        return null; // ou <p>Carregando...</p>
    }

    if (produtos.length === 0) {
        return <p style={{ textAlign: 'center' }}>Nenhum produto disponível nesta categoria.</p>;
    }

    const grupos = produtos.reduce((acc, produto) => {
        const tipo = produto.tipoProduto || 'Outros';
        if (!acc[tipo]) acc[tipo] = [];
        acc[tipo].push(produto);
        return acc;
    }, {});

    return (
        <div className='container-coteudo-item'>
            {Object.keys(grupos).map((tipo) => (
                <div key={tipo} className='grupo-tipo-produto'>
                    <div className='titulo-conteudo-item'>
                        <p>{tipo}</p>
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
                                        <button onClick={() => addAdicional(produto.id)}>
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