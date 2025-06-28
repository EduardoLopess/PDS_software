export const CadastrarMesa = async (data) => {
    const resposta = await fetch('http://localhost:5071/api/mesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!resposta.ok) {
        const erroData = await resposta.json();
        throw new Error(erroData.message || "Erro desconhecido");
    }

    return await resposta.json();
};
