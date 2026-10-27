// modelos/agenda/montar_agenda.js — agenda semanal: cada semana ocupa uma página dupla
// (esquerda: segunda a quinta; direita: sexta a domingo e notas).
// Antes de rodar: cole biblioteca/base.js no início. Os dados vêm de gerar_semanas.py.
//
// O documento é de páginas simples (lâminas para a gráfica); par = página esquerda, ímpar = direita.
// As primeiras páginas (PRE_TEXTUAIS) ficam livres para capa interna, dados pessoais, calendário anual etc.

const PASTA = AREA + 'Agenda IEEB\\';     // pasta de trabalho na Área de Trabalho
const DOC = null;                        // null = criar; depois, o sessionUuid
const LARG = 148, ALT = 210;             // A5
const PRE_TEXTUAIS = 4;                  // páginas antes da 1ª semana (número par, para a semana abrir à esquerda)
const POS_TEXTUAIS = 4;                  // páginas no fim (anotações, contatos)
const LOTE = [1, 4];                     // semanas deste lote
const M = { ext: 12, int: 18, topo: 14, base: 14 };     // margens em mm (int = lado da lombada)
const COR_DESTAQUE = cmyk(100, 45, 0, 10);              // azul do título e dos feriados (ajustar à marca)

const { semanas } = lerJSON(PASTA + 'dados\\semanas.json');
const total = PRE_TEXTUAIS + semanas.length * 2 + POS_TEXTUAIS;
if (total % 4) console.log('ATENÇÃO: ' + total + ' páginas não é múltiplo de 4. Ajuste PRE/POS_TEXTUAIS.');
const doc = DOC ? acharDocumento(DOC) : novoDocumento({ largura: LARG, altura: ALT, paginas: total });
const todas = paginas(doc);

// Um bloco de dia: cabeçalho (número grande + dia da semana), eventos e linhas para escrever.
function blocoDia(sp, d, x, y, w, h) {
    const cor = d.eventos.some((e) => e.tipo === 'feriado') ? COR_DESTAQUE : PRETO;
    texto(doc, sp, { x, y, w: 14, h: 10 }, [String(d.dia)], { espessura: 'Black', tam: 18, cor: d.fora_do_ano ? cmyk(0, 0, 0, 35) : cor });
    texto(doc, sp, { x: x + 14, y: y + 1.5, w: w - 14, h: 6 }, [d.semana], { espessura: 'Bold', tam: 7.5, cor });
    if (d.eventos.length) texto(doc, sp, { x: x + 14, y: y + 5.5, w: w - 14, h: 8 },
        [d.eventos.map((e) => e.t).join(' • ')], { tam: 6.5, cor });
    retangulo(doc, sp, { x, y: y + 10.5, w, h: 0.35, cor: PRETO });                    // fio do cabeçalho
    for (let ly = y + 17; ly < y + h - 2; ly += 6.5) retangulo(doc, sp, { x, y: ly, w, h: 0.12, cor: cmyk(0, 0, 0, 30) });
}

for (let s = LOTE[0]; s <= Math.min(LOTE[1], semanas.length); s++) {
    const sem = semanas[s - 1];
    const esq = todas[PRE_TEXTUAIS + (s - 1) * 2], dir = todas[PRE_TEXTUAIS + (s - 1) * 2 + 1];
    for (const sp of [esq, dir]) { irPara(doc, sp); for (const n of [...sp.children]) n.delete(); }
    const util = (lado) => ({ x: lado === 'e' ? M.ext : M.int, w: LARG - M.ext - M.int });
    const e = util('e'), d = util('d');
    const alturaUtil = ALT - M.topo - M.base - 10;
    texto(doc, esq, { x: e.x, y: M.topo, w: e.w, h: 8 }, [sem.titulo], { espessura: 'Black', tam: 11, cor: COR_DESTAQUE });
    texto(doc, dir, { x: d.x, y: M.topo, w: d.w, h: 8 }, ['SEMANA ' + sem.numero], { espessura: 'Bold', tam: 8, alinha: 'direita', cor: COR_DESTAQUE });
    sem.dias.slice(0, 4).forEach((dia, k) => blocoDia(esq, dia, e.x, M.topo + 10 + k * alturaUtil / 4, e.w, alturaUtil / 4));
    sem.dias.slice(4).forEach((dia, k) => blocoDia(dir, dia, d.x, M.topo + 10 + k * alturaUtil / 4, d.w, alturaUtil / 4));
    blocoDia(dir, { dia: '', semana: 'NOTAS', eventos: [], fora_do_ano: false }, d.x, M.topo + 10 + 3 * alturaUtil / 4, d.w, alturaUtil / 4);
}
console.log('documento', doc.sessionUuid, '—', total, 'páginas; semanas', LOTE[0], 'a', Math.min(LOTE[1], semanas.length));
