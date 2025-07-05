export const FormatarTiposProdutos = (tipo) => {
    const mapa = {
    LongNeck: 'Long Neck',
    Cerveja600: 'Cerveja 600ml',
    CervejaLatao: 'Cerveja Latão',
    CervejaLitro: 'Cerveja 1 Litro',
    AguaSemGaz: 'Água sem Gás',
    AguaComGaz: 'Água com Gás',
    RefrigeranteLata: 'Refrigerante Lata',
    Refrigerante600: 'Refrigerante 600ml',
    Suco: 'Suco',
    Drink: 'Drink',
    Caipirinha: 'Caipirinha',
    Salgado: 'Salgado',
    Doce: 'Doce',
    Especial: 'Especial',
    SemPeixe: 'Sem Peixe',
    Peixe: 'Peixe'
  };

  return mapa[tipo] || tipo;
}


export const FormatarTiposProdutosCarrinho = (tipo) => {
    const mapa = {
    LongNeck: 'Long Neck',
    Cerveja600: '600ml',
    CervejaLatao: 'Latão',
    CervejaLitro: ' 1L',
    AguaSemGaz: 's/Gás',
    AguaComGaz: 'c/Gás',
    RefrigeranteLata: 'Lata',
    Refrigerante600: ' 600ml',
    Suco: 'Suco',
    Drink: 'Drink',
    Caipirinha: 'Caipirinha',
    Salgado: 'Salgado',
    Doce: 'Doce',
    Especial: 'Especial',
    SemPeixe: 's/Peixe',
    Peixe: 'c/Peixe'
  };

  return mapa[tipo] || tipo;
}