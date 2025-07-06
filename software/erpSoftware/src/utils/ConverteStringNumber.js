export const ConverterCategoriaDecimal = (categoria) => {
    const map = {
        "Cervejas": 0,
        "Pasteis": 1,
        "Porcoes": 2,     // No enum é "Porcoes", mas no map "Porcao" (plural x singular). Ajuste se possível para manter coerência.
        "SemAlcool": 3,
        "Alaminuta": 4,
        "Drink": 5
    }

    return map[categoria] ?? 0
}

export const ConverterTipoProdutoDecimal = (tipoProduto) => {
   const labelToEnumKey = {
        "Long Neck": "LongNeck",
        "Cerveja 600ml": "Cerveja600",
        "Cerveja Latão": "CervejaLatao",
        "Cerveja Litro": "CervejaLitro",
        "Água sem gás": "AguaSemGaz",
        "Água com gás": "AguaComGaz",
        "Refrigerante Lata": "RefrigeranteLata",
        "Refrigerante 600ml": "Refrigerante600",
        "Suco": "Suco",
        "Drink": "Drink",
        "Caipirinha": "Caipirinha",
        "Salgado": "Salgado",
        "Doce": "Doce",
        "Especial": "Especial",
        "Sem Peixe": "SemPeixe",
        "Peixe": "Peixe"
    };

    const enumMap = {
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
    };

    const enumKey = labelToEnumKey[tipoProduto];
    return enumMap[enumKey] ?? 0;
}