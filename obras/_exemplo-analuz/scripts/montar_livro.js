// Monta o livro "Analuz, um raio de Sol na Terra" no Affinity a partir do layout do Canva.
// 24 páginas simples de 210x240 mm, sangria 3 mm, CMYK FOGRA39, Nunito.
// Lê layout_canva.json (posições em px de 96 dpi, como no Canva) e as imagens de paginas/.
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

const PASTA = app.userDesktopPath + '\\Livro Analuz\\';
const DPI = 300, SANGRIA = 3 * DPI / 25.4;
const px = (v) => v * DPI / 96;              // px do Canva -> px do documento
const pt = (v) => v * DPI / 72;              // pt -> px do documento
const IMAGENS = ['capa', 'p00'].concat(Array.from({ length: 21 }, (_, i) => 'p' + String(i + 1).padStart(2, '0')), ['contracapa']);
const CAIXA_ALTA = (i) => i >= 2 && i <= 22;   // miolo em caixa alta (4 anos); créditos e contracapa não

const layout = JSON.parse(fs.File.readAll(PASTA + 'layout_canva.json').toString());
const nunito = [...F.FontFamily.all].find((f) => f.name === 'Nunito');
const fonte = (peso) => [...nunito.fonts].find((f) => f.traitsName === (peso === 'bold' ? 'Bold' : 'Regular'));
// 23/10: os marrons do Canva viraram preto só de K (C0 M0 Y0 K100) por decisão do coordenador, para dar contraste.
const MARRONS = ['#523020', '#7f4c34', '#593423'];
const cor = (hex) => MARRONS.includes(hex.toLowerCase()) ? CMYKA8(0, 0, 0, 255) : RGBA8(parseInt(hex.substr(1, 2), 16), parseInt(hex.substr(3, 2), 16), parseInt(hex.substr(5, 2), 16));
const ALINHA = { start: 'Left', justify: 'Left', end: 'Right', center: 'Centre' };

const o = NewDocumentOptions.createDefault();
o.units = UnitType.Millimetre; o.dpi = DPI; o.width = 210; o.height = 240;
o.isMultiPage = true; o.pageCount = 24; o.isFacing = false; o.rasterFormat = RasterFormat.CMYKA8;
o.bleed = { left: 3, top: 3, right: 3, bottom: 3 }; o.marginsEnabled = false;
o.colourProfile = ColourProfile.find('Coated FOGRA39 (ISO 12647-2:2004)');
const doc = Document.create(o);
const spreads = [...doc.spreads];

function adicionar(sp, def) {
    const b = AddChildNodesCommandBuilder.create();
    b.addNode(def); b.setInsertionTarget(sp);
    doc.executeCommand(b.createCommand(false, NodeChildType.Main));
    return [...sp.children].pop();
}

function imagem(sp, nome) {
    const def = ImageNodeDefinition.create(RasterFormat.CMYKA8);
    // ampliadas\ = Magnific Precision (sublime) 4x, ~400 dpi; os créditos (p00) ficam em paginas\.
    // Com as 23 imagens grandes, rodar em lotes de 4–5 páginas: num script só o Affinity fechou.
    const pasta = nome === 'p00' ? 'paginas\\' : 'ampliadas\\';
    def.bitmap = Bitmap.loadFromFile(PASTA + pasta + nome + '.jpg', RasterFormat.CMYKA8);
    const img = adicionar(sp, def);
    const s = sp.getSpreadBaseBox(false), i = img.getSpreadBaseBox(false);
    const xf = Transform.createTranslate(s.x - SANGRIA, s.y - SANGRIA)
        .multiply(Transform.createScale((s.width + 2 * SANGRIA) / i.width, (s.height + 2 * SANGRIA) / i.height))
        .multiply(Transform.createTranslate(-i.x, -i.y));
    doc.executeCommand(DocumentCommand.createTransform(Selection.create(doc, img), xf));
}

function retangulo(sp, e) {
    const r = ShapeRectangle.create();
    if (e.r) { r.topLeft.setRadius(0.08, px(e.w), px(e.h)); r.topLeft.cornerType = ShapeCornerType.Round; }
    const fill = e.fill ? FillDescriptor.createSolid(cor(e.fill)) : null;
    const line = e.stroke ? FillDescriptor.createSolid(cor(e.stroke)) : null;
    const ls = e.stroke ? LineStyleDescriptor.create(LineStyle.createDefaultWithWeight(pt(e.sw * 0.75))) : null;
    const n = adicionar(sp, ShapeNodeDefinition.create(r, { x: px(e.x), y: px(e.y), width: px(e.w), height: px(e.h) }, fill, line, ls));
    if (e.op < 1) doc.setOpacity(e.op, Selection.create(doc, n));
}

function texto(sp, e, caixaAlta, folga = 1.12) {
    const sb = StoryBuilder.create();
    sb.setToFrameTextDefaultStyle(doc.dpi, doc.format);
    const p = sb.paragraphAtts;
    const r0 = e.runs[0];
    p.alignXType = (r0.al === 'justify' && !caixaAlta) ? ParagraphAlignXType.JustifyLeft : ParagraphAlignXType[ALINHA[r0.al]];
    p.leadingType = ParagraphLeadingType.RelativeToHeight; p.relativeLeading = r0.lh;
    p.spaceAfter = 0;                        // o estilo padrão põe 12 pt depois de cada parágrafo
    sb.setParagraphAtts(p);
    let inicio = true;
    e.runs.forEach((r, k) => {
        const g = sb.glyphAtts;
        g.font = fonte(r.w); g.height = pt(r.size); g.characterSpacing = r.ls;
        g.brushFill = FillDescriptor.createSolid(cor(r.c));
        sb.setGlyphAtts(g);
        let t = r.t;
        if (k === e.runs.length - 1) t = t.replace(/\s+$/, '');
        if (caixaAlta) t = t.split('\n').map((l) => l.trim()).join('\n').toUpperCase();
        const linhas = t.split('\n');
        linhas.forEach((l, j) => {
            if (j > 0) sb.addParagraphBreak();
            if (r.list === 'disc' && l && (j > 0 || inicio)) l = '•  ' + l;
            if (l) sb.addText(l);
        });
        inicio = t.endsWith('\n');
    });
    // margem de folga: a Nunito não tem a mesma largura da fonte do Canva
    let x = e.x, w = e.w * folga, h = e.h * 1.35 + 20;
    if (r0.al === 'end') x = e.x + e.w - w;
    if (r0.al === 'center') x = e.x + (e.w - w) / 2;
    if (x + w > 794 - 30) { w = 794 - 30 - x; }
    adicionar(sp, FrameTextNodeDefinition.createFromStoryBuilder({ x: px(x), y: px(e.y), width: px(w), height: px(h) }, sb));
}

spreads.forEach((sp, i) => {
    doc.executeCommand(DocumentCommand.createSetCurrentSpread(sp));
    imagem(sp, IMAGENS[i]);
    for (const e of layout[i]) {
        if (e.k === 'shape') {
            if (i === 23 && e.y > 700) continue;              // pílula do logo já está na imagem
            retangulo(sp, e);
            if (e.txt && e.txt.length) texto(sp, { x: e.x, y: e.y + e.h / 4, w: e.w, h: e.h / 2, runs: e.txt.map((t) => ({ t: t.characters, size: t.formatting.fontSize * 0.75, w: 'bold', c: t.formatting.color, al: 'center', lh: 1.2, ls: 0 })) }, false);
            continue;
        }
        const numero = /^\d+$/.test(e.runs[0].t.trim());
        if (numero) {                                         // número de página: posição única para todas
            const n = +e.runs[0].t;
            texto(sp, { x: n % 2 ? 712 : 40, y: 827.7, w: 40, h: 24.7, runs: [Object.assign({}, e.runs[0], { al: 'center' })] }, false);
        } else {
            texto(sp, e, CAIXA_ALTA(i), i === 1 ? 1 : 1.12);   // na ficha CIP o texto fica dentro da moldura
        }
    }
});
doc.executeCommand(DocumentCommand.createSetCurrentSpread(spreads[0]));
console.log('documento', doc.sessionUuid, spreads.length, 'páginas');
