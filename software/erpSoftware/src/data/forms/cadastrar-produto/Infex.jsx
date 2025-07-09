import { useState } from 'react'
import '../styles-from/Form-styles.css'
import { criarProduto } from '../../../service/api/ProdutoService';
import { useApiProduto } from '../../../context/apiProdutoContext';

export const FormCadastrarProduto = () => {
    const {buscarProdutos} = useApiProduto()
    const [status, setStatus] = useState(null)
    const [formData, setFormData] = useState({
        nomeProduto: '',
        precoProduto: '',
        disponibilidadeProduto: true,
        categoriaProduto: '',
        tipoProduto: '',
    });


    const handleChange = (e) => {
        const { name, value } = e.target

        const newValue = name === 'categoriaProduto' || name === 'tipoProduto'
            ? parseInt(value)
            : value

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }))

        console.log(formData)


    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Dados enviados:', formData);

        const produto = {
            nomeProduto: formData.nomeProduto,
            precoProduto: parseFloat(formData.precoProduto.replace(',', '.')),
            disponibilidadeProduto: formData.disponibilidadeProduto,
            categoriaProduto: formData.categoriaProduto,
            tipoProduto: formData.tipoProduto
        }

        await criarProduto (formData)
            .then(res => {
                console.log('PRODUTO CRIADO', res.data);
                setStatus('success');
                setFormData({
                    nomeProduto: '',
                    precoProduto: '',
                    disponibilidadeProduto: true,
                    categoriaProduto: '',
                    tipoProduto: '',
                });
                buscarProdutos()
            })
            .catch(err => {
                console.error("ERRO AO CRIAR PRODUTO: ", err);
                setStatus('error');
            });
    };

    const renderStatus = (error) => {
        if (error === error) {
            return (
                <div>

                </div>
            )
        }
        if (error === sucess) {
            return (
                <div>

                </div>
            )
        }
    }




    return (
        <form onSubmit={handleSubmit}>
            <div className='container-form'>

                <label>Nome produto: </label>
                <input type='text' placeholder='Nome produto..'
                    name="nomeProduto"
                    value={formData.nomeProduto}
                    onChange={handleChange}
                />

                <label>Valor produto: </label>
                <input type='number' placeholder="R$: "
                    name="precoProduto"
                    value={formData.precoProduto}
                    onChange={(e) => {
                        const onlyNumbers = e.target.value
                            .replace(',', '.')
                            .replace(/[^0-9.]/g, '')
                            .replace(/(\..*)\./g, '$1');
                        handleChange({ target: { name: 'precoProduto', value: onlyNumbers } })
                    }}
                />

                <label htmlFor="fruta">Categoria do produto:</label>
                <select
                    name='categoriaProduto'
                    value={formData.categoriaProduto}
                    onChange={handleChange}

                >
                    <option value="">Selecione...</option>
                    <option value="0">Cerveja</option>
                    <option value="1">Pastel</option>
                    <option value="2">Porções</option>
                    <option value="3">Sem Alcool</option>
                    <option value="4">À alaminuta</option>
                    <option value="5">Drink</option>
                </select>

                <label htmlFor="fruta">Tipo do produto:</label>
                <select
                    name="tipoProduto"
                    value={formData.tipoProduto}
                    onChange={handleChange}

                >
                    <option value="">Selecione...</option>
                    <option value="0">Long Neck</option>
                    <option value="1">Cerveja 600ml</option>
                    <option value="2">Cerveja Latão</option>
                    <option value="3">Cerveja Litro</option>
                    <option value="4">Água sem gás</option>
                    <option value="5">Água com gás</option>
                    <option value="6">Refrigerante Lata</option>
                    <option value="7">Refrigerante 600ml</option>
                    <option value="8">Suco</option>
                    <option value="9">Drink</option>
                    <option value="10">Caipirinha</option>
                    <option value="11">Salgado</option>
                    <option value="12">Doce</option>
                    <option value="13">Especial</option>
                    <option value="14">Sem Peixe</option>
                    <option value="15">Peixe</option>
                </select>

                <div className='container-btn'>
                    <button type='submit'>CADASTRAR</button>
                </div>

                {status === 'success' && <div style={{ color: 'green' }}>Produto cadastrado com sucesso!</div>}
                {status === 'error' && <div style={{ color: 'red' }}>Erro ao cadastrar produto. Tente novamente.</div>}


            </div>

        </form>


    )
}