// Página de teste: cola-se a base.js antes deste trecho. Cria um documento 210×210 mm com
// um fundo, um quadro arredondado e texto em caixa alta, sem precisar de nenhuma imagem.
const doc = novoDocumento({ largura: 210, altura: 210, paginas: 2 });
const [p1, p2] = paginas(doc);

retangulo(doc, p1, { x: -3, y: -3, w: 216, h: 216, cor: cmyk(5, 3, 15, 0) });               // fundo creme sangrando
retangulo(doc, p1, { x: 25, y: 120, w: 160, h: 60, cor: BRANCO, cantos: 0.12, opacidade: 0.9 });
texto(doc, p1, { x: 35, y: 130, w: 140, h: 45 }, [
    'Era uma vez uma página de teste',
    { t: ['montada pelo ', { t: 'Claude', espessura: 'Bold' }, ' no Affinity.'] },
], { tam: 18, alinha: 'centro', caixaAlta: true, espessura: 'Regular' });

texto(doc, p2, { x: 20, y: 20, w: 170, h: 40 }, ['Página 2: texto normal, sem caixa alta, alinhado à esquerda.'], { tam: 12 });
console.log('documento de teste criado:', doc.sessionUuid);
