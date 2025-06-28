export const FormatarTiposProdutos = (tipo) => {
    const mapa = {
    LongNeck: 'Long Neck',
    Cerveja600: 'Cerveja 600ml',
    CervejaLatao: 'Cerveja Latão',
    CervejaLitro: 'Cerveja 1 Litro',
    AguaSemGaz: 'Água sem Gás',
    AguaComGaz: 'Água com Gás',
    RefrigeranteLata: 'Refri Lata',
    Refrigerante600: 'Refri 600ml',
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