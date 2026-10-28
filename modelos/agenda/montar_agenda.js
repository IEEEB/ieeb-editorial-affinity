// modelos/agenda/montar_agenda.js — agenda escolar SEM ANO: 12 blocos mensais (abertura + 5 semanas em branco).
// Antes de rodar: cole biblioteca/base.js no início. Os textos vêm de dados/agenda.json (ver agenda.exemplo.json).
//
// O Affinity não cria páginas-mestre por script. Cada tipo de página é uma função deste arquivo, que faz o
// papel da mestre: A = página simples, B = quadro dos 12 meses, C = abertura do mês, D = semana.
// Documento de páginas simples (lâminas para a gráfica), na ordem de leitura. Página 1 é direita:
// página ímpar = direita (espiral à esquerda), página par = esquerda (espiral à direita).
//
// Mapa das 164 páginas: 1–7 iniciais · 8–151 meses (12 × [abertura 2 + 5 semanas × 2]) · 152–164 finais.

const PASTA = AREA + 'Agenda Escolar SUNO\\';   // pasta de trabalho na Área de Trabalho
const DOC = null;                               // null = criar; depois, o sessionUuid (ver LOG.md)
const LARG = 148, ALT = 210;                    // A5. Para 13,5 × 20 cm, troque por 135 e 200: o resto se ajusta
const MONTAR = { iniciais: true, meses: [1], finais: false };   // o que montar neste lote
const M = { ext: 10, int: 18, topo: 12, base: 12 };              // margens em mm (int = lado da espiral, ≥ 18)
const INICIAIS = 7, POR_MES = 12, FINAIS = 13;
const TOTAL = INICIAIS + 12 * POR_MES + FINAIS;                  // 164

// Cores da obra (CMYK 0–100). Títulos em cor, texto corrido em K100 (decisão registrada no LOG).
const AZUL = cmyk(100, 75, 0, 0), CREME = cmyk(0, 2, 8, 0), MOLDURA = cmyk(40, 5, 0, 0);
const FIO = cmyk(0, 0, 0, 30), CINZA = cmyk(0, 0, 0, 60), CLARO = cmyk(0, 0, 0, 8);

const dados = lerJSON(PASTA + 'dados\\agenda.json');
if (TOTAL % 4) throw new Error(TOTAL + ' páginas não é múltiplo de 4');
if (dados.finais.length !== FINAIS) throw new Error('agenda.json tem ' + dados.finais.length + ' páginas finais; o mapa pede ' + FINAIS);
const doc = DOC ? acharDocumento(DOC) : novoDocumento({ largura: LARG, altura: ALT, paginas: TOTAL });
const todas = paginas(doc);

// ---------- peças comuns ----------
const direita = (n) => n % 2 === 1;                                    // n = número da página (1 = primeira)
const util = (n) => ({ x: direita(n) ? M.int : M.ext, w: LARG - M.int - M.ext, y: M.topo, h: ALT - M.topo - M.base });
const corMes = (m) => cmyk(...dados.meses[m - 1].cor);

function preparar(n) {                       // limpa a página n e põe fundo creme + moldura arredondada
    const sp = todas[n - 1];
    irPara(doc, sp);
    for (const x of [...sp.children]) x.delete();
    retangulo(doc, sp, { x: -SANGRIA_MM, y: -SANGRIA_MM, w: LARG + 2 * SANGRIA_MM, h: ALT + 2 * SANGRIA_MM, cor: CREME });
    const u = util(n);
    retangulo(doc, sp, { x: u.x - 3, y: u.y - 3, w: u.w + 6, h: u.h + 6, contorno: MOLDURA, espessura: 0.6, cantos: 0.04 });
    return sp;
}

function faixaDoMes(sp, n, m) {               // fio de cor na borda de fora, para achar o mês pela lateral
    const x = direita(n) ? LARG - 4 : -SANGRIA_MM;
    retangulo(doc, sp, { x, y: -SANGRIA_MM, w: 4 + SANGRIA_MM, h: ALT + 2 * SANGRIA_MM, cor: corMes(m) });
}

function titulo(sp, u, t, cor = AZUL, tam = 20) {
    texto(doc, sp, { x: u.x, y: u.y, w: u.w, h: tam * 0.55 }, [t], { espessura: 'Black', tam, cor, alinha: 'centro', caixaAlta: true });
}

function rotulo(sp, x, y, w, t, cor = AZUL, tam = 7) {
    texto(doc, sp, { x, y, w, h: tam * 0.6 }, [t], { espessura: 'ExtraBold', tam, cor, caixaAlta: true });
}

function linhas(sp, x, y, w, qtd, passo = 6.5) {
    for (let k = 1; k <= qtd; k++) retangulo(doc, sp, { x, y: y + k * passo, w, h: 0.2, cor: FIO });
    return y + qtd * passo;
}

function campo(sp, x, y, w, nome) {           // "NOME: ______" — rótulo e linha na mesma altura
    const r = Math.min(w * 0.45, nome.length * 1.6 + 3);         // ~1,6 mm por letra em 7,5 pt ExtraBold
    rotulo(sp, x, y, r, nome + ':', AZUL, 7.5);
    retangulo(doc, sp, { x: x + r, y: y + 4.2, w: w - r, h: 0.2, cor: FIO });
}

function bolinha(sp, x, y, d, contorno = MOLDURA, cor = null) {
    return retangulo(doc, sp, { x, y, w: d, h: d, cor, contorno, espessura: 0.6, cantos: 0.5 });
}

// ---------- A: páginas simples ----------
function paginaDono(n) {                      // p. 1 — Esta agenda é de…
    const sp = preparar(n), u = util(n);
    titulo(sp, u, 'Esta agenda é de');
    const f = 52;
    retangulo(doc, sp, { x: u.x + (u.w - f) / 2, y: u.y + 22, w: f, h: f * 1.2, contorno: MOLDURA, espessura: 0.8, cantos: 0.08, cor: BRANCO });
    texto(doc, sp, { x: u.x, y: u.y + 22 + f * 0.55, w: u.w, h: 6 }, ['minha foto'], { tam: 8, cor: CINZA, alinha: 'centro' });
    let y = u.y + 22 + f * 1.2 + 14;
    for (const c of ['Nome', 'Turma', 'Professora', 'Escola']) { campo(sp, u.x, y, u.w, c); y += 12; }
}

function paginaCampos(n, t, grupos) {         // p. 2 — Identificação (grupos: [{titulo?, campos:[], linhas?}])
    const sp = preparar(n), u = util(n);
    titulo(sp, u, t, AZUL, 16);
    let y = u.y + 14;
    for (const g of grupos) {
        if (g.titulo) { rotulo(sp, u.x, y, u.w, g.titulo, AZUL, 8); y += 6; }
        for (const c of g.campos || []) { campo(sp, u.x, y, u.w, c); y += 9; }
        if (g.linhas) y = linhas(sp, u.x, y - 2, u.w, g.linhas, 7) + 4;
        y += 2;
    }
}

function paginaTexto(n, t, paragrafos, comQR = false) {   // p. 3 — Apresentação e carta às famílias
    const sp = preparar(n), u = util(n);
    titulo(sp, u, t, AZUL, 16);
    const hQR = comQR ? 30 : 0;
    texto(doc, sp, { x: u.x, y: u.y + 14, w: u.w, h: u.h - 18 - hQR }, paragrafos.map((p) => ({ t: p, antes: 2 })), { tam: 8.5, entrelinha: 1.35, alinha: 'justificado' });
    if (comQR) {
        retangulo(doc, sp, { x: u.x, y: u.y + u.h - 26, w: 24, h: 24, contorno: MOLDURA, espessura: 0.6, cor: BRANCO });
        texto(doc, sp, { x: u.x, y: u.y + u.h - 16, w: 24, h: 5 }, ['QR'], { tam: 7, cor: CINZA, alinha: 'centro' });
        texto(doc, sp, { x: u.x + 28, y: u.y + u.h - 24, w: u.w - 28, h: 20 }, [dados.textos.qr], { tam: 8, entrelinha: 1.3 });
    }
}

function paginaFinal(n, f) {                  // pp. 152–164 — f = {titulo, tipo: 'lista'|'linhas'|'quadro'|'mao'|'frase', texto?}
    const sp = preparar(n), u = util(n);
    if (f.tipo !== 'frase') titulo(sp, u, f.titulo, AZUL, 16);
    const y0 = u.y + 14, h = u.h - 14;
    if (f.tipo === 'linhas') linhas(sp, u.x, y0, u.w, Math.floor(h / 7.5), 7.5);
    if (f.tipo === 'quadro') retangulo(doc, sp, { x: u.x, y: y0, w: u.w, h, contorno: MOLDURA, espessura: 0.6, cantos: 0.03, cor: BRANCO });
    if (f.tipo === 'mao') ['No começo do ano', 'No fim do ano'].forEach((rot, k) => {
        const yy = y0 + k * h / 2;
        rotulo(sp, u.x, yy, u.w, rot, AZUL, 8);
        retangulo(doc, sp, { x: u.x, y: yy + 6, w: u.w, h: h / 2 - 10, contorno: MOLDURA, espessura: 0.6, cantos: 0.04, cor: BRANCO });
    });
    if (f.tipo === 'lista') {                 // aniversários: um quadrinho por mês
        const col = u.w / 2, hl = h / 6;
        dados.meses.forEach((m, k) => {
            const x = u.x + (k % 2) * col, yy = y0 + Math.floor(k / 2) * hl;
            rotulo(sp, x, yy, col - 4, m.nome, corMes(k + 1), 8);
            linhas(sp, x, yy + 1, col - 4, 3, 5.5);
        });
    }
    if (f.tipo === 'frase') texto(doc, sp, { x: u.x + 6, y: u.y + u.h * 0.3, w: u.w - 12, h: u.h * 0.4 },
        [{ t: f.texto, alinha: 'centro' }, { t: [{ t: f.fonte, tam: 8, espessura: 'Bold' }], alinha: 'centro', antes: 6 }], { tam: 16, espessura: 'ExtraBold', cor: AZUL, entrelinha: 1.3 });
}

// ---------- B: quadro dos 12 meses (pp. 4–5) ----------
function quadroMeses(n, de) {                 // 6 meses por página, 2 colunas × 3 linhas
    const sp = preparar(n), u = util(n);
    titulo(sp, u, de === 0 ? 'Datas da minha escola' : ' ', AZUL, 14);
    const y0 = u.y + 12, gap = 4, w = (u.w - gap) / 2, h = (u.h - 12 - 2 * gap) / 3;
    for (let k = 0; k < 6; k++) {
        const m = de + k + 1, x = u.x + (k % 2) * (w + gap), y = y0 + Math.floor(k / 2) * (h + gap);
        retangulo(doc, sp, { x, y, w, h, contorno: corMes(m), espessura: 0.8, cantos: 0.06, cor: BRANCO });
        retangulo(doc, sp, { x, y, w, h: 8, cor: corMes(m), cantos: 0.25 });
        texto(doc, sp, { x, y: y + 1.6, w, h: 6 }, [dados.meses[m - 1].nome], { espessura: 'Black', tam: 9, cor: BRANCO, alinha: 'centro', caixaAlta: true });
        linhas(sp, x + 3, y + 8, w - 6, Math.floor((h - 10) / 6.5));
    }
}

// ---------- rotina e autoavaliação (pp. 6–7) ----------
function paginaRotina(n) {
    const sp = preparar(n), u = util(n);
    titulo(sp, u, 'Nossa rotina', AZUL, 16);
    const itens = dados.rotina, meio = Math.ceil(itens.length / 2), w = u.w / 2, passo = Math.min(11, (u.h - 16) / meio);
    itens.forEach((t, k) => {
        const x = u.x + (k < meio ? 0 : w), y = u.y + 16 + (k % meio) * passo;
        bolinha(sp, x, y, 5, AZUL, BRANCO);
        texto(doc, sp, { x, y: y + 0.9, w: 5, h: 4 }, [String(k + 1)], { espessura: 'Black', tam: 6, cor: AZUL, alinha: 'centro' });
        texto(doc, sp, { x: x + 6.5, y: y + 0.6, w: w - 8, h: passo }, [t], { tam: 7.5, entrelinha: 1.1 });
    });
}

function paginaAutoavaliacao(n) {
    const sp = preparar(n), u = util(n);
    titulo(sp, u, 'Minha autoavaliação', AZUL, 16);
    texto(doc, sp, { x: u.x, y: u.y + 14, w: u.w, h: 14 }, [dados.textos.autoavaliacao], { tam: 8.5, entrelinha: 1.3, alinha: 'centro' });
    const d = 22, cs = dados.carinhas, passo = u.w / cs.length;
    cs.forEach((c, k) => {
        const x = u.x + k * passo + (passo - d) / 2, y = u.y + 34;
        bolinha(sp, x, y, d, cmyk(...c.cor), CLARO);
        texto(doc, sp, { x: u.x + k * passo, y: y + d + 2, w: passo, h: 10 }, [c.nome], { espessura: 'Bold', tam: 7.5, alinha: 'centro', caixaAlta: true });
    });
    rotulo(sp, u.x, u.y + 78, u.w, 'Esta semana eu penso em mim perante…', AZUL, 9);
    dados.enfoques.forEach((e, k) => {
        const y = u.y + 88 + k * 30;
        bolinha(sp, u.x, y, 22, AZUL, BRANCO);
        texto(doc, sp, { x: u.x + 28, y: y + 3, w: u.w - 28, h: 8 }, [e.nome], { espessura: 'Black', tam: 12, cor: AZUL, caixaAlta: true });
        texto(doc, sp, { x: u.x + 28, y: y + 10, w: u.w - 28, h: 12 }, [e.texto], { tam: 8, entrelinha: 1.25 });
    });
}

// ---------- C: abertura do mês (dupla) ----------
function aberturaMes(m) {
    const n = INICIAIS + 1 + (m - 1) * POR_MES, mes = dados.meses[m - 1];
    let sp = preparar(n), u = util(n);                       // esquerda: nome, meta, ilustração
    faixaDoMes(sp, n, m);
    texto(doc, sp, { x: u.x, y: u.y + 4, w: u.w, h: 7 }, ['Meta do mês: ' + mes.meta], { espessura: 'ExtraBold', tam: 8.5, cor: AZUL, alinha: 'centro', caixaAlta: true });
    texto(doc, sp, { x: u.x, y: u.y + 14, w: u.w, h: 22 }, [mes.nome], { espessura: 'Black', tam: 40, cor: corMes(m), alinha: 'centro', caixaAlta: true });
    retangulo(doc, sp, { x: u.x, y: u.y + 44, w: u.w, h: u.h - 48, cor: CLARO, cantos: 0.05 });
    texto(doc, sp, { x: u.x, y: u.y + 44 + (u.h - 48) / 2 - 3, w: u.w, h: 6 }, ['ilustração do mês'], { tam: 8, cor: CINZA, alinha: 'centro' });

    sp = preparar(n + 1); u = util(n + 1);                   // direita: grade do mês + trilha dos gestos
    faixaDoMes(sp, n + 1, m);
    titulo(sp, u, mes.nome, corMes(m), 14);
    const dias = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'], cw = u.w / 7, ch = 13, y0 = u.y + 18;
    dias.forEach((d, k) => texto(doc, sp, { x: u.x + k * cw, y: y0 - 6, w: cw, h: 5 }, [d], { espessura: 'ExtraBold', tam: 7, cor: corMes(m), alinha: 'centro' }));
    for (let r = 0; r < 6; r++) for (let k = 0; k < 7; k++)
        retangulo(doc, sp, { x: u.x + k * cw, y: y0 + r * ch, w: cw, h: ch, contorno: MOLDURA, espessura: 0.4, cor: BRANCO });
    const yt = y0 + 6 * ch + 8;
    rotulo(sp, u.x, yt, u.w, 'Meus gestos de ' + mes.gesto, corMes(m), 9);
    texto(doc, sp, { x: u.x, y: yt + 6, w: u.w, h: 8 }, [dados.textos.trilha], { tam: 7.5, cor: CINZA });
    const d = 9.2, porLinha = 8, gx = (u.w - porLinha * d) / (porLinha - 1);
    for (let k = 0; k < 31; k++) {
        const r = Math.floor(k / porLinha), c = r % 2 ? porLinha - 1 - (k % porLinha) : k % porLinha;   // trilha em zigue-zague
        const x = u.x + c * (d + gx), y = yt + 16 + r * (d + 3);
        bolinha(sp, x, y, d, corMes(m), BRANCO);
        texto(doc, sp, { x, y: y + 2.3, w: d, h: 5 }, [String(k + 1)], { espessura: 'Bold', tam: 7, cor: corMes(m), alinha: 'centro' });
    }
}

// ---------- D: semana (dupla) ----------
function blocoDia(sp, m, x, y, w, h, nome, partes = ['Recado da escola', 'Recado da família']) {
    retangulo(doc, sp, { x, y, w: 34, h: 6.5, cor: corMes(m), cantos: 0.5 });
    texto(doc, sp, { x, y: y + 1.6, w: 34, h: 5 }, [nome], { espessura: 'Black', tam: 8, cor: BRANCO, alinha: 'centro', caixaAlta: true });
    bolinha(sp, x + w - 11, y - 1, 11);                                    // lugar do adesivo de carinha
    const hp = (h - 9) / partes.length;
    partes.forEach((p, k) => {
        const yy = y + 9 + k * hp;
        rotulo(sp, x, yy, w - 14, p, CINZA, 6.5);
        linhas(sp, x, yy, w, Math.floor((hp - 2) / 6.2), 6.2);
    });
}

function semana(m, s) {                                    // s = 1..5
    const n = INICIAIS + 1 + (m - 1) * POR_MES + 2 * s;
    let sp = preparar(n), u = util(n);                       // esquerda: segunda, terça, quarta
    faixaDoMes(sp, n, m);
    texto(doc, sp, { x: u.x, y: u.y, w: u.w, h: 7 }, ['Semana de ____/____ a ____/____'], { espessura: 'ExtraBold', tam: 9, cor: AZUL, caixaAlta: true });
    const h3 = (u.h - 10) / 3;
    ['Segunda', 'Terça', 'Quarta'].forEach((d, k) => blocoDia(sp, m, u.x, u.y + 10 + k * h3, u.w, h3 - 3, d));

    sp = preparar(n + 1); u = util(n + 1);                   // direita: quinta, sexta, fim de semana + faixa da semana
    faixaDoMes(sp, n + 1, m);
    texto(doc, sp, { x: u.x, y: u.y, w: u.w, h: 7 }, [dados.meses[m - 1].nome], { espessura: 'ExtraBold', tam: 9, cor: corMes(m), alinha: 'direita', caixaAlta: true });
    const hd = 52, hf = 34;
    ['Quinta', 'Sexta'].forEach((d, k) => blocoDia(sp, m, u.x, u.y + 10 + k * hd, u.w, hd - 3, d));
    blocoDia(sp, m, u.x, u.y + 10 + 2 * hd, u.w, hf - 3, 'Fim de semana', ['O que fiz com a minha família']);
    const yf = u.y + 10 + 2 * hd + hf, hfx = u.h - (yf - u.y);
    retangulo(doc, sp, { x: u.x, y: yf, w: u.w, h: hfx, contorno: corMes(m), espessura: 0.8, cantos: 0.08, cor: BRANCO });
    let y = yf + 3;
    for (const c of ['Palavra-chave', 'Esperanto', 'Vivência no lar']) { campo(sp, u.x + 3, y, u.w - 6, c); y += 7.5; }
    rotulo(sp, u.x + 3, y + 1, 22, 'Penso em:', AZUL, 7);
    dados.enfoques.forEach((e, k) => {
        const x = u.x + 26 + k * 30;
        bolinha(sp, x, y + 0.3, 4.5, AZUL, BRANCO);
        texto(doc, sp, { x: x + 6, y: y + 1, w: 24, h: 4 }, [e.nome], { espessura: 'Bold', tam: 7, caixaAlta: true });
    });
}

// ---------- montagem ----------
if (MONTAR.iniciais) {
    paginaDono(1);
    paginaCampos(2, 'Identificação', dados.identificacao);
    paginaTexto(3, dados.textos.tituloApresentacao, dados.textos.apresentacao, true);
    quadroMeses(4, 0); quadroMeses(5, 6);
    paginaRotina(6); paginaAutoavaliacao(7);
}
for (const m of MONTAR.meses) { aberturaMes(m); for (let s = 1; s <= 5; s++) semana(m, s); }
if (MONTAR.finais) dados.finais.forEach((f, k) => paginaFinal(INICIAIS + 12 * POR_MES + 1 + k, f));

console.log('documento', doc.sessionUuid, '—', TOTAL, 'páginas; montado:', JSON.stringify(MONTAR));
