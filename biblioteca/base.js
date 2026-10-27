// biblioteca/base.js — peças comuns para os scripts do IEEB no Affinity 3.
// Os scripts do Affinity não importam arquivos locais: cole este arquivo inteiro no início do script da obra.
// Testado nos livros Analuz e No abraço de Maria (out/2026). Posições em mm, tamanhos de letra em pt.
const { Document, NewDocumentOptions, UnitType, RasterFormat } = require('/document.js');
const { app } = require('/application.js');
const fs = require('/fs.js');
const { Bitmap } = require('/rasterobject.js');
const { ImageNodeDefinition, FrameTextNodeDefinition, ShapeNodeDefinition } = require('/nodes.js');
const { AddChildNodesCommandBuilder, DocumentCommand, NodeChildType } = require('/commands.js');
const { Selection } = require('/selections.js');
const { Transform } = require('/geometry.js');
const { StoryBuilder } = require('/storybuilder.js');
const { ParagraphAlignXType, ParagraphLeadingType } = require('/paragraphatts.js');
const F = require('/fonts.js');
const { ColourProfile, RGBA8, CMYKA8 } = require('/colours.js');
const { FillDescriptor } = require('/fills.js');
const { ShapeRectangle, ShapeCornerType } = require('/shapes.js');
const { LineStyle, LineStyleDescriptor } = require('/linestyle.js');

const DPI = 300;
const mm = (v) => v * DPI / 25.4;
const pt = (v) => v * DPI / 72;
const SANGRIA_MM = 3;
const AREA = app.userDesktopPath + '\\';          // o Affinity da Microsoft Store só lê a Área de Trabalho

// Cores. CMYK de 0 a 100, como na gráfica (o SDK usa 0–255 por baixo).
const cmyk = (c, m, y, k) => CMYKA8(Math.round(c * 2.55), Math.round(m * 2.55), Math.round(y * 2.55), Math.round(k * 2.55));
const hex = (h) => RGBA8(parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16));
const PRETO = cmyk(0, 0, 0, 100);
const BRANCO = cmyk(0, 0, 0, 0);

// Fontes: procura a família e a espessura e PARA se não achar (fonte ausente não dá erro, só troca a letra).
function fonte(familia, espessura = 'Regular') {
    const fam = [...F.FontFamily.all].find((f) => f.name === familia);
    if (!fam) throw new Error('Fonte não instalada: ' + familia);
    const f = [...fam.fonts].find((x) => x.traitsName === espessura);
    if (!f) throw new Error(familia + ' sem a espessura ' + espessura + '. Instaladas: ' + [...fam.fonts].map((x) => x.traitsName).join(', '));
    return f;
}

// Documento novo. largura/altura em mm do corte (sem sangria).
function novoDocumento({ largura, altura, paginas = 1, ladoALado = false, sangria = SANGRIA_MM, margens = null }) {
    const o = NewDocumentOptions.createDefault();
    o.units = UnitType.Millimetre; o.dpi = DPI; o.width = largura; o.height = altura;
    o.isMultiPage = paginas > 1; o.pageCount = paginas; o.isFacing = ladoALado;
    o.rasterFormat = RasterFormat.CMYKA8;
    o.bleed = { left: sangria, top: sangria, right: sangria, bottom: sangria };
    if (margens) { o.marginsEnabled = true; o.margins = margens; } else { o.marginsEnabled = false; }
    o.colourProfile = ColourProfile.find('Coated FOGRA39 (ISO 12647-2:2004)');
    return Document.create(o);
}

// Acha um documento aberto pelo sessionUuid ou por parte do título.
function acharDocumento(chave) {
    const docs = [...Document.all];
    const d = docs.find((x) => x.sessionUuid === chave) || docs.find((x) => (x.title || '').includes(chave));
    if (!d) throw new Error('Documento não encontrado: ' + chave + '. Abertos: ' + docs.map((x) => x.title).join(' | '));
    return d;
}

const paginas = (doc) => [...doc.spreads];

function adicionar(doc, pagina, def) {
    const b = AddChildNodesCommandBuilder.create();
    b.addNode(def); b.setInsertionTarget(pagina);
    doc.executeCommand(b.createCommand(false, NodeChildType.Main));
    return [...pagina.children].pop();
}

function irPara(doc, pagina) { doc.executeCommand(DocumentCommand.createSetCurrentSpread(pagina)); }

// Imagem cobrindo a página inteira mais a sangria (a arte precisa ter a sangria desenhada).
function imagemSangrando(doc, pagina, arquivo, sangria = SANGRIA_MM) {
    const def = ImageNodeDefinition.create(RasterFormat.CMYKA8);
    def.bitmap = Bitmap.loadFromFile(arquivo, RasterFormat.CMYKA8);
    const img = adicionar(doc, pagina, def);
    const s = pagina.getSpreadBaseBox(false), i = img.getSpreadBaseBox(false), b = mm(sangria);
    const xf = Transform.createTranslate(s.x - b, s.y - b)
        .multiply(Transform.createScale((s.width + 2 * b) / i.width, (s.height + 2 * b) / i.height))
        .multiply(Transform.createTranslate(-i.x, -i.y));
    doc.executeCommand(DocumentCommand.createTransform(Selection.create(doc, img), xf));
    return img;
}

// Imagem numa caixa (mm). modo 'caber' mantém a proporção dentro da caixa; 'esticar' preenche.
function imagemNaCaixa(doc, pagina, arquivo, { x, y, w, h, modo = 'caber' }) {
    const def = ImageNodeDefinition.create(RasterFormat.CMYKA8);
    def.bitmap = Bitmap.loadFromFile(arquivo, RasterFormat.CMYKA8);
    const img = adicionar(doc, pagina, def);
    const i = img.getSpreadBaseBox(false), s = pagina.getSpreadBaseBox(false);
    let sx = mm(w) / i.width, sy = mm(h) / i.height, dx = 0, dy = 0;
    if (modo === 'caber') { const k = Math.min(sx, sy); dx = (mm(w) - i.width * k) / 2; dy = (mm(h) - i.height * k) / 2; sx = sy = k; }
    const xf = Transform.createTranslate(s.x + mm(x) + dx, s.y + mm(y) + dy)
        .multiply(Transform.createScale(sx, sy)).multiply(Transform.createTranslate(-i.x, -i.y));
    doc.executeCommand(DocumentCommand.createTransform(Selection.create(doc, img), xf));
    return img;
}

// Retângulo (mm). cantos = raio relativo (0–0,5); opacidade 0–1.
function retangulo(doc, pagina, { x, y, w, h, cor = null, contorno = null, espessura = 0.75, cantos = 0, opacidade = 1 }) {
    const r = ShapeRectangle.create();
    // o tipo do canto vem ANTES do raio, e nos quatro cantos (só o topLeft, ou raio antes do tipo, deixa o canto reto)
    if (cantos) for (const c of [r.topLeft, r.topRight, r.bottomLeft, r.bottomRight]) { c.cornerType = ShapeCornerType.Round; c.setRadius(cantos, mm(w), mm(h)); }
    const s = pagina.getSpreadBaseBox(false);
    const n = adicionar(doc, pagina, ShapeNodeDefinition.create(r, { x: s.x + mm(x), y: s.y + mm(y), width: mm(w), height: mm(h) },
        cor ? FillDescriptor.createSolid(cor) : null,
        contorno ? FillDescriptor.createSolid(contorno) : null,
        contorno ? LineStyleDescriptor.create(LineStyle.createDefaultWithWeight(pt(espessura))) : null));
    if (opacidade < 1) doc.setOpacity(opacidade, Selection.create(doc, n));
    return n;
}

// Quadro de texto (mm). paragrafos: lista de strings ou de objetos
//   { t: 'texto' | [trechos], alinha: 'esquerda'|'centro'|'direita'|'justificado', entrelinha: 1.2, antes: 0 (mm), recuo: 0 (mm) }
//   trecho: 'texto' ou { t, espessura, tam, cor }
// padrao: { familia: 'Nunito', espessura: 'Regular', tam: 12 (pt), cor: PRETO, alinha, entrelinha, caixaAlta: false }
const ALINHA = { esquerda: 'Left', centro: 'Centre', direita: 'Right', justificado: 'JustifyLeft' };
function texto(doc, pagina, { x, y, w, h }, paragrafos, padrao = {}) {
    const P = Object.assign({ familia: 'Nunito', espessura: 'Regular', tam: 12, cor: PRETO, alinha: 'esquerda', entrelinha: 1.2, caixaAlta: false }, padrao);
    const sb = StoryBuilder.create();
    sb.setToFrameTextDefaultStyle(doc.dpi, doc.format);
    paragrafos.forEach((par, k) => {
        const pr = typeof par === 'string' ? { t: par } : par;
        if (k) sb.addParagraphBreak();
        const p = sb.paragraphAtts;
        p.alignXType = ParagraphAlignXType[ALINHA[pr.alinha || P.alinha]];
        p.leadingType = ParagraphLeadingType.RelativeToHeight; p.relativeLeading = pr.entrelinha || P.entrelinha;
        p.spaceAfter = 0;                                   // o estilo padrão põe 12 pt depois de cada parágrafo
        p.spaceBefore = mm(pr.antes || 0); p.firstLineIndent = mm(pr.recuo || 0);
        sb.setParagraphAtts(p);
        const trechos = Array.isArray(pr.t) ? pr.t : [pr.t];
        trechos.forEach((tr) => {
            const r = typeof tr === 'string' ? { t: tr } : tr;
            const g = sb.glyphAtts;
            g.font = fonte(r.familia || P.familia, r.espessura || P.espessura);
            g.height = pt(r.tam || P.tam); g.characterSpacing = 0;
            g.brushFill = FillDescriptor.createSolid(r.cor || P.cor);
            sb.setGlyphAtts(g);
            if (r.t) sb.addText(P.caixaAlta ? r.t.toUpperCase() : r.t);
        });
    });
    const s = pagina.getSpreadBaseBox(false);
    return adicionar(doc, pagina, FrameTextNodeDefinition.createFromStoryBuilder({ x: s.x + mm(x), y: s.y + mm(y), width: mm(w), height: mm(h) }, sb));
}

// Apaga da página o que não é imagem (para refazer textos e formas sem perder a arte).
function limparMenosImagens(pagina) {
    for (const n of [...pagina.children]) if (n.constructor.name !== 'ImageNode') n.delete();
}

// Lê um JSON da pasta de trabalho (na Área de Trabalho).
const lerJSON = (caminho) => JSON.parse(fs.File.readAll(caminho).toString());
