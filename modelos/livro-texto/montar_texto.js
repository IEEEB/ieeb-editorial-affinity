// modelos/livro-texto/montar_texto.js — texto corrido em quadros encadeados, um por página,
// com estilos por tipo de parágrafo (título, corpo, citação…) e número de página.
// Antes de rodar: cole biblioteca/base.js no início. Texto em dados/texto.json (ver texto.exemplo.json).
//
// Depois de rodar, confira o render da ÚLTIMA página: o último quadro mostra o texto que sobrou.
// Se sobrou, aumente PAGINAS e rode de novo (o script recria tudo em um documento novo).

const PASTA = AREA + 'NOME DA OBRA\\';
const PAGINAS = 8;                                   // páginas do miolo de texto (ajuste até o texto caber)

const dados = lerJSON(PASTA + 'dados\\texto.json');
const { largura, altura } = dados.formato, M = dados.margens;   // M = { topo, base, int, ext } em mm
const doc = novoDocumento({ largura, altura, paginas: PAGINAS });
const todas = paginas(doc);

// Cada bloco do JSON vira um parágrafo com o estilo dele.
const pars = dados.blocos.map((b) => {
    const e = dados.estilos[b.estilo || 'corpo'];
    return { t: [{ t: b.t, espessura: e.espessura, tam: e.tam, familia: e.familia }], alinha: e.alinha, entrelinha: e.entrelinha, antes: e.antes, recuo: e.recuo };
});

// Página ímpar = direita (lombada à esquerda); par = esquerda.
const caixa = (i) => {
    const direita = i % 2 === 0;                     // índice 0 = página 1
    return { x: direita ? M.int : M.ext, y: M.topo, w: largura - M.int - M.ext, h: altura - M.topo - M.base };
};

const quadros = todas.map((sp, i) => texto(doc, sp, caixa(i), i === 0 ? pars : [''], { familia: dados.estilos.corpo.familia }));
for (let i = 0; i + 1 < quadros.length; i++) doc.executeCommand(DocumentCommand.createLinkTextFrame(quadros[i], quadros[i + 1]));

todas.forEach((sp, i) => {                           // número de página no pé, centralizado
    texto(doc, sp, { x: 0, y: altura - M.base + 6, w: largura, h: 6 }, [String(i + 1)],
        { familia: dados.estilos.corpo.familia, tam: 9, alinha: 'centro' });
});
console.log('documento', doc.sessionUuid, '—', PAGINAS, 'páginas. Confira se o texto coube na última.');
