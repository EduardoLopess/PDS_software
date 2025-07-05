export const ConverterCategoriaDecimal = (categoria) => {
    const map = {
        "Cervejas": 0,
        "Pasteis": 1,
        "Porcao": 2,     // No enum é "Porcoes", mas no map "Porcao" (plural x singular). Ajuste se possível para manter coerência.
        "SemAlcool": 3,
        "Alaminuta": 4,
        "Drink": 5
    }

    return map[categoria] ?? 0
}

export const ConverterTipoProdutoDecimal = (tipoProduto) => {
   const map = {
        "LongNeck": 0,
        "Cerveja600": 1,
        "CervejaLatao": 2,
        "CervejaLitro": 3,
        "AguaSemGaz": 4,
        "AguaComGaz": 5,
        "RefrigeranteLata": 6,
        "Refrigerante600": 7,
        "Suco": 8,
        "Drink": 9,
        "Caipirinha": 10,
        "Salgado": 11,
        "Doce": 12,
        "Especial": 13,
        "SemPeixe": 14,
        "Peixe": 15
    }

    return map[tipoProduto] ?? 0
}