import Swal from 'sweetalert2';
import { ConverterCategoriaDecimal, ConverterTipoProdutoDecimal } from '../../../utils/ConverteStringNumber';
import { deleteProduto, getProdutos, putProduto } from '../../../service/api/ProdutoService';
import { categoriaProdutoEnum, tipoProdutoMap } from '../../../utils/ProdutoEnum';
import { useApiProduto } from '../../../context/apiProdutoContext';

export const useEditarProduto = () => {

    const { buscarProdutos, deletarProduto  } = useApiProduto()


    const editarProduto = async (produto) => {
        const categoriaAtual = produto.categoriaProduto;
        const tipoAtual = produto.tipoProduto;

        const formHtml = `
          <form id="form-editar-produto">
              <input name="nome" class="swal2-input" placeholder="Nome" value="${produto.nomeProduto}" />
              <input name="preco" class="swal2-input" placeholder="Preço" value="${produto.precoProdutoFormatado}" />
              <select name="categoria" class="swal2-input">
                ${Object.entries(categoriaProdutoEnum).map(([label]) =>
            `<option value="${label}" ${label === categoriaAtual ? 'selected' : ''}>${label}</option>`
        ).join('')}
              </select>
              <select name="tipo" class="swal2-input">
                ${Object.entries(tipoProdutoMap).map(([label]) =>
            `<option value="${label}" ${label === tipoAtual ? 'selected' : ''}>${label}</option>`
        ).join('')}
              </select>
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
            cancelButtonColor: '#999999',
            preConfirm: () => {
                const form = document.getElementById('form-editar-produto');
                const formData = new FormData(form);
                const nome = formData.get('nome');
                const preco = formData.get('preco');
                const categoria = formData.get('categoria');
                const tipo = formData.get('tipo');

                if (!nome || !preco || !categoria || !tipo) {
                    Swal.showValidationMessage('Todos os campos são obrigatórios');
                    return false;
                }

                return { nome, preco, categoria, tipo };
            }
        });

        if (result.isConfirmed && result.value) {
            try {
                const payload = {
                    nomeProduto: result.value.nome,
                    precoProduto: parseFloat(result.value.preco.replace(',', '.')),
                    disponibilidadeProduto: produto.disponibilidadeProduto,
                    categoriaProduto: ConverterCategoriaDecimal(result.value.categoria),
                    tipoProduto: ConverterTipoProdutoDecimal(result.value.tipo),
                };

                const response = await putProduto(produto.id, payload);
                Swal.fire('Atualizado!', 'Produto editado com sucesso.', 'success');
                await buscarProdutos()
                return response.data;
            } catch (error) {
                console.error('Erro ao atualizar produto:', error);
                Swal.fire('Erro!', 'Falha ao atualizar produto.', 'error');
                throw error;
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
                await deletarProduto(produto.id)
                Swal.fire("Deletado!", "Produto removido com sucesso.", "success");
                await buscarProdutos()
            }
        }
    };

    return { editarProduto };
};
