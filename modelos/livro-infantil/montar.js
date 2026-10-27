// modelos/livro-infantil/montar.js — monta páginas de um livro ilustrado a partir de dados/paginas.json.
// Antes de rodar: cole biblioteca/base.js no início. Ajuste as constantes abaixo a cada lote.
//
// Fluxo: 1º lote com DOC = null cria o documento (anote o sessionUuid que aparece no fim);
// a pessoa salva pelo menu; os lotes seguintes usam DOC = '<sessionUuid>' e LOTE = [início, fim].

const PASTA = AREA + 'NOME DA OBRA\\';      // pasta de trabalho na Área de Trabalho (igual a obra.json → pasta_trabalho)
const DOC = null;                          // null = criar documento novo; ou o sessionUuid / parte do título
const LOTE = [1, 5];                       // páginas deste lote (1 = primeira). Com imagens grandes, no máximo 5

const dados = lerJSON(PASTA + 'dados\\paginas.json');
const F_ = dados.formato;                  // { largura, altura, paginas, ladoALado }
const doc = DOC ? acharDocumento(DOC) : novoDocumento(F_);
const todas = paginas(doc);

for (let n = LOTE[0]; n <= Math.min(LOTE[1], dados.paginas.length); n++) {
    const pg = dados.paginas[n - 1], sp = todas[n - 1];
    irPara(doc, sp);
    for (const no of [...sp.children]) no.delete();                     // refaz a página inteira deste lote
    if (pg.imagem) imagemSangrando(doc, sp, PASTA + 'imagens\\' + pg.imagem);
    if (pg.fundo) retangulo(doc, sp, { x: -3, y: -3, w: F_.largura + 6, h: F_.altura + 6, cor: cmyk(...pg.fundo) });
    for (const q of pg.quadros || []) retangulo(doc, sp, Object.assign({}, q, { cor: q.cor ? cmyk(...q.cor) : BRANCO }));
    for (const t of pg.textos || []) {
        texto(doc, sp, t, t.paragrafos, Object.assign({}, dados.estilo, t.estilo, { cor: t.cor ? cmyk(...t.cor) : PRETO }));
    }
    if (pg.numero) {                                                    // número no canto externo de baixo
        const N = dados.numero, impar = pg.numero % 2 === 1;
        const x = impar ? F_.largura - N.margem - N.largura : N.margem;
        texto(doc, sp, { x, y: F_.altura - N.margem - 8, w: N.largura, h: 10 }, [String(pg.numero)],
            { espessura: N.espessura, tam: N.tam, alinha: 'centro' });
    }
}
irPara(doc, todas[LOTE[0] - 1]);
console.log('documento', doc.sessionUuid, '— montadas as páginas', LOTE[0], 'a', Math.min(LOTE[1], dados.paginas.length));
