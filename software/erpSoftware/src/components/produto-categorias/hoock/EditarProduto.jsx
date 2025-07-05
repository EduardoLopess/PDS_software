import Swal from 'sweetalert2';
import { ConverterCategoriaDecimal, ConverterTipoProdutoDecimal } from '../../../utils/ConverteStringNumber';
import { putProduto } from '../../../service/api/ProdutoService';
import { categoriaProdutoEnum, tipoProdutoEnum } from '../../../utils/ProdutoEnum';

// Mapeamento reverso para exibir nomes no select

export const useEditarProduto = () => {
    const editarProduto = async (produto) => {
        const categoriaAtual = produto.categoriaProduto;
        const tipoAtual = produto.tipoProduto;

        const { value: formValues } = await Swal.fire({
            title: `Editar Produto: ${produto.nomeProduto}`,
            html: `
        <input id="swal-nome" class="swal2-input" placeholder="Nome" value="${produto.nomeProduto}" />
        <input id="swal-preco" class="swal2-input" placeholder="Preço" value="${produto.precoProdutoFormatado}" />
            <select id="swal-categoria" class="swal2-input">
  ${Object.entries(categoriaProdutoEnum)
                    .map(
                        ([label, value]) =>
                            `<option value="${label}" ${label === categoriaAtual ? 'selected' : ''}>${label}</option>`
                    )
                    .join('')}
</select>

<select id="swal-tipo" class="swal2-input">
  ${Object.entries(tipoProdutoEnum)
                    .map(
                        ([label, value]) =>
                            `<option value="${label}" ${label === tipoAtual ? 'selected' : ''}>${label}</option>`
                    )
                    .join('')}
</select>

      `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Salvar',
            preConfirm: () => {
                const nome = document.getElementById('swal-nome').value;
                const preco = document.getElementById('swal-preco').value;
                const categoria = document.getElementById('swal-categoria').value;
                const tipo = document.getElementById('swal-tipo').value;

                if (!nome || !preco || !categoria || !tipo) {
                    Swal.showValidationMessage('Todos os campos são obrigatórios');
                    return false;
                }

                return { nome, preco, categoria, tipo };
            }
        });

        if (formValues) {
            try {
                const payload = {
                    nomeProduto: formValues.nome,
                    precoProduto: parseFloat(formValues.preco.replace(',', '.')),
                    disponibilidadeProduto: produto.disponibilidadeProduto,
                    categoriaProduto: ConverterCategoriaDecimal(formValues.categoria),
                    tipoProduto: ConverterTipoProdutoDecimal(formValues.tipo),
                };

                const response = await putProduto(produto.id, payload);

                Swal.fire('Atualizado!', 'Produto editado com sucesso.', 'success');
                return response.data;
            } catch (error) {
                console.error('Erro ao atualizar produto:', error);
                Swal.fire('Erro!', 'Falha ao atualizar produto.', 'error');
                throw error;
            }
        }
    };

    return { editarProduto };
};
