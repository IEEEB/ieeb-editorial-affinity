// Página de créditos e ficha CIP do Analuz (texto do docx "CRÉDITOS E FICHA CATALOGRÁFICA ANALUZ", 24/10/2026).
// Uso: definir ALVOS = [[sessionUuid, índice do spread]] e rodar. Substitui tudo que não é imagem na metade esquerda (0–210 mm).
const { Document } = require('/document.js');
const { FrameTextNodeDefinition, ShapeNodeDefinition } = require('/nodes.js');
const { AddChildNodesCommandBuilder, DocumentCommand, NodeChildType } = require('/commands.js');
const { StoryBuilder } = require('/storybuilder.js');
const { ParagraphAlignXType, ParagraphLeadingType } = require('/paragraphatts.js');
const F = require('/fonts.js'); const { RGBA8, CMYKA8 } = require('/colours.js'); const { FillDescriptor } = require('/fills.js');
const { ShapeRectangle } = require('/shapes.js'); const { LineStyle, LineStyleDescriptor } = require('/linestyle.js');

const MM = 300 / 25.4, PT = 300 / 72;
const PRETO = CMYKA8(0, 0, 0, 255), VERMELHO = RGBA8(255, 49, 49);
const nunito = [...F.FontFamily.all].find((f) => f.name === 'Nunito');
const FONTE = { r: [...nunito.fonts].find((f) => f.traitsName === 'Regular'), b: [...nunito.fonts].find((f) => f.traitsName === 'Bold') };
const AL = { e: 'Left', c: 'Centre', d: 'Right', j: 'JustifyLeft' };

// parágrafo: [alinhamento, recuo 1ª linha mm, recuo esquerdo mm, ...runs]; run: texto | {t, b, cor}
const B = (t) => ({ t, b: true });
const BLOCOS = [
    { x: 20, y: 16, w: 170, h: 30, pt: 10, lh: 1.35, pars: [
        ['e', 0, 0, B('© 2026')], ['e', 0, 0, 'Instituto de Educação Espírita Eurípedes Barsanulfo'], ['e', 0, 0, ''],
        ['e', 0, 0, '1ª edição'], ['e', 0, 0, 'Novembro de 2026']] },
    { x: 20, y: 50, w: 170, h: 42, pt: 10, lh: 1.35, pars: [
        ['e', 0, 0, B('Autoria e responsabilidade institucional:')], ['e', 0, 0, 'Instituto de Educação Espírita Eurípedes Barsanulfo'], ['e', 0, 0, ''],
        ['e', 0, 0, B('Capa, projeto gráfico, diagramação, tratamento de imagens e ilustrações:')], ['e', 0, 0, 'Instituto de Educação Espírita Eurípedes Barsanulfo'], ['e', 0, 0, ''],
        ['e', 0, 0, B('Revisão:')], ['e', 0, 0, 'Comissão da Educação do Instituto de Educação Espírita Eurípedes Barsanulfo']] },
    // ficha CIP (dentro da moldura de 20–190 mm × 100–166 mm)
    { x: 24, y: 102.5, w: 162, h: 7, pt: 9, lh: 1.3, pars: [['c', 0, 0, B('Dados Internacionais de Catalogação na Publicação (CIP)')]] },
    { x: 26, y: 113, w: 158, h: 42, pt: 9, lh: 1.35, pars: [
        ['e', 0, 0, 'Instituto de Educação Espírita Eurípedes Barsanulfo.'],
        ['e', 8, 0, 'Analuz : um raio de sol na Terra / Instituto de Educação Espírita Eurípedes Barsanulfo. – 1. ed. – Goiânia, GO : Instituto de Educação Espírita Eurípedes Barsanulfo, 2026.'],
        ['e', 8, 0, '20 p. : il. color. ; 24 × 21 cm.'],
        ['e', 8, 0, 'ISBN ', { t: 'xxxx', cor: VERMELHO }],
        ['e', 8, 0, ''],
        ['e', 8, 0, '1. Literatura infantil. 2. Literatura espírita infantil. 3. Amizade – Literatura infantil. I. Título.']] },
    { x: 26, y: 147.5, w: 158, h: 6, pt: 9, lh: 1.3, pars: [['d', 0, 0, 'CDD 028.5']] },
    { x: 26, y: 156, w: 158, h: 12, pt: 9, lh: 1.35, pars: [['e', 0, 0, 'Índice para catálogo sistemático:'], ['e', 0, 0, '1. Literatura infantil 028.5']] },
    // rodapé
    // direitos reservados (docx de 24/10, segunda versão)
    { x: 20, y: 173, w: 170, h: 16, pt: 8.5, lh: 1.35, pars: [
        ['j', 0, 0, 'Todos os direitos reservados ao Instituto de Educação Espírita Eurípedes Barsanulfo. É proibida a reprodução, distribuição ou disponibilização, total ou parcial, desta obra, por qualquer meio ou processo, impresso, eletrônico ou digital, sem autorização prévia e expressa, por escrito, do Instituto, nos termos da Lei nº 9.610/98.']] },
    { x: 20, y: 192, w: 170, h: 40, pt: 9.5, lh: 1.4, pars: [
        ['c', 0, 0, 'Toda a receita obtida com a venda desta obra é destinada à manutenção dos serviços pedagógicos do Instituto de Educação Espírita Eurípedes Barsanulfo.'],
        ['c', 0, 0, ''],
        ['c', 0, 0, 'Rua da União, esquina com Rua da Paz, Qd. 176, Lt. 10,'], ['c', 0, 0, 'Jardim Nova Esperança, Goiânia, Goiás'],
        ['c', 0, 0, 'Telefone: +55 (62) 3297-3117, CEP: 74465-310.'], ['c', 0, 0, 'www.ieeb.com.br'], ['c', 0, 0, 'editora@ieeb.com.br']] },
];
// moldura da CIP e os dois fios (mm)
const MOLDURA = { x: 20, y: 100, w: 170, h: 68 };
const FIOS = [{ x: 24, y: 110, w: 162 }, { x: 24, y: 154, w: 162 }];

function montar(doc, sp) {
    const add = (def) => { const b = AddChildNodesCommandBuilder.create(); b.addNode(def); b.setInsertionTarget(sp); doc.executeCommand(b.createCommand(false, NodeChildType.Main)); };
    doc.executeCommand(DocumentCommand.createSetCurrentSpread(sp));
    for (const n of [...sp.children]) { if (n.constructor.name === 'ImageNode') continue; if (n.getSpreadBaseBox(false).x < 205 * MM) n.delete(); }
    add(ShapeNodeDefinition.create(ShapeRectangle.create(), { x: MOLDURA.x * MM, y: MOLDURA.y * MM, width: MOLDURA.w * MM, height: MOLDURA.h * MM },
        null, FillDescriptor.createSolid(PRETO), LineStyleDescriptor.create(LineStyle.createDefaultWithWeight(0.75 * PT))));
    for (const f of FIOS) add(ShapeNodeDefinition.create(ShapeRectangle.create(), { x: f.x * MM, y: f.y * MM, width: f.w * MM, height: 0.25 * MM }, FillDescriptor.createSolid(PRETO), null, null));
    for (const bl of BLOCOS) {
        const sb = StoryBuilder.create(); sb.setToFrameTextDefaultStyle(doc.dpi, doc.format);
        bl.pars.forEach(([al, primeira, esquerda, ...runs], k) => {
            if (k) sb.addParagraphBreak();
            const p = sb.paragraphAtts; p.alignXType = ParagraphAlignXType[AL[al]]; p.leadingType = ParagraphLeadingType.RelativeToHeight;
            p.relativeLeading = bl.lh; p.spaceAfter = 0; p.firstLineIndent = primeira * MM; p.leftIndent = esquerda * MM; sb.setParagraphAtts(p);
            if (!runs.length || runs.every((r) => r === '')) { const g = sb.glyphAtts; g.font = FONTE.r; g.height = bl.pt * PT; sb.setGlyphAtts(g); return; }
            for (const r of runs) {
                const run = typeof r === 'string' ? { t: r } : r; if (!run.t) continue;
                const g = sb.glyphAtts; g.font = run.b ? FONTE.b : FONTE.r; g.height = bl.pt * PT; g.characterSpacing = 0;
                g.brushFill = FillDescriptor.createSolid(run.cor || PRETO); sb.setGlyphAtts(g); sb.addText(run.t);
            }
        });
        add(FrameTextNodeDefinition.createFromStoryBuilder({ x: bl.x * MM, y: bl.y * MM, width: bl.w * MM, height: bl.h * MM }, sb));
    }
}
