// Arquivo: src/hooks/useEditarProduto.js

import Swal from 'sweetalert2';
import { ConverterCategoriaDecimal, ConverterTipoProdutoDecimal } from '../../../utils/ConverteStringNumber';
import { deleteProduto, putProduto } from '../../../service/api/ProdutoService';
import { CATEGORIAS, TIPOS_PRODUTO } from '../../../utils/ProdutoEnum';
import { useApiProduto } from '../../../context/apiProdutoContext';

export const useEditarProduto = () => {
    const { buscarProdutos, deletarProduto } = useApiProduto();

    const editarProduto = async (produto) => {
        const inputStyle = `flex: 1; font-size: 14px; height: 40px; padding: 6px;`;
        const labelStyle = `width: 110px; font-size: 13px;`;

        const formHtml = `
            <form id="form-editar-produto" style="font-size: 14px; text-align: left;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <label style="${labelStyle}">Nome:</label>
                    <input name="nome" class="swal2-input" value="${produto.nomeProduto}" style="${inputStyle}" />
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <label style="${labelStyle}">Preço:</label>
                    <input name="preco" class="swal2-input" value="${produto.precoProdutoFormatado}" style="${inputStyle}" />
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <label style="${labelStyle}">Categoria:</label>
                    <select name="categoria" class="swal2-input" style="${inputStyle}">
                        ${CATEGORIAS.map(
            cat => `<option value="${cat.key}" ${cat.key === produto.categoriaProduto ? 'selected' : ''}>${cat.label}</option>`
        ).join('')}
                    </select>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <label style="${labelStyle}">Tipo:</label>
                    <select name="tipo" class="swal2-input" style="${inputStyle}">
                        ${TIPOS_PRODUTO.map(
            tipo => `<option value="${tipo.key}" ${tipo.key === produto.tipoProduto ? 'selected' : ''}>${tipo.label}</option>`
        ).join('')}
                    </select>
                </div>
                <div style="display: flex; align-items: center;">
                    <label style="${labelStyle}">Disponível:</label>
                    <select name="disponibilidade" class="swal2-input" style="${inputStyle}">
                        <option value="true" ${produto.disponibilidadeProduto ? 'selected' : ''}>Sim</option>
                        <option value="false" ${!produto.disponibilidadeProduto ? 'selected' : ''}>Não</option>
                    </select>
                </div>
            </form>
        `;

        const result = await Swal.fire({
            title: `Editar Produto: ${produto.nomeProduto}`,
            html: formHtml,
            focusConfirm: false,
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'Salvar',
            denyButtonText: 'Deletar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#4CAF50',
            denyButtonColor: '#e53935',
            cancelButtonColor: '#999',
            preConfirm: () => {
                const form = document.getElementById('form-editar-produto');
                const formData = new FormData(form);
                const nome = formData.get('nome');
                const preco = formData.get('preco');
                const categoria = formData.get('categoria');
                const tipo = formData.get('tipo');
                const disponibilidade = formData.get('disponibilidade') === 'true';

                if (!nome || !preco || !categoria || !tipo) {
                    Swal.showValidationMessage('Todos os campos são obrigatórios');
                    return false;
                }
                return { nome, preco, categoria, tipo, disponibilidade };
            }
        });

        if (result.isConfirmed && result.value) {
            try {
                const payload = {
                    nomeProduto: result.value.nome,
                    precoProduto: parseFloat(result.value.preco.replace(',', '.')),
                    disponibilidadeProduto: result.value.disponibilidade,
                    categoriaProduto: ConverterCategoriaDecimal(result.value.categoria),
                    tipoProduto: ConverterTipoProdutoDecimal(result.value.tipo),
                };
                await putProduto(produto.id, payload);
                Swal.fire('Atualizado!', 'Produto editado com sucesso.', 'success');
                await buscarProdutos();
            } catch (error) {
                console.error('Erro ao atualizar produto:', error);
                Swal.fire('Erro!', 'Falha ao atualizar produto.', 'error');
            }
        } else if (result.isDenied) {
            const resultDelete = await Swal.fire({
                title: "Tem certeza?",
                text: "Essa ação não poderá ser desfeita!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e53935",
                cancelButtonColor: "#999",
                confirmButtonText: "Sim, deletar"
            });
            if (resultDelete.isConfirmed) {

                try {
                    await deletarProduto(produto.id);
                    Swal.fire("Deletado!", "Produto removido com sucesso.", "success");
                    await buscarProdutos();
                } catch (error) {
                    Swal.fire("Falha!", "Produto vinculado a pedidos não pode ser deletado.", "error");

                }



              
            }
        }
    };

    return { editarProduto };
};