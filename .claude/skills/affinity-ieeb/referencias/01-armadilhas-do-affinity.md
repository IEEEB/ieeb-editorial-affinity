# Armadilhas do Affinity (aprendidas em produção, out/2026)

Cada item diz o que acontece e o que fazer. Acrescente aqui o que descobrir de novo, com a data.

## Arquivos e pastas

- **O Affinity da Microsoft Store só enxerga a Área de Trabalho.** `Bitmap.loadFromFile` e `fs.File.readAll` falham fora dela. Use `app.userDesktopPath + '\\<pasta>\\'` e mantenha as imagens e os JSON lá. (Livros Analuz e Maria, 23/10/2026.)
- **`saveAs` por script falha com `CREATE_FILE_ERROR`** num documento novo. A pessoa salva pela primeira vez pelo menu; depois `doc.save()` funciona. (23/10/2026.)
- **`doc.export` funciona**, inclusive para PDF. Mas o preset PDF/X pelo script **sai sem sangria e sem marcas de corte**, e o SDK não tem opção de "páginas individuais". O PDF da gráfica é pelo diálogo. (23/10/2026.)
- **Exportações grandes passam do tempo do conector** (o `execute_script` volta com erro de tempo), mas continuam em segundo plano e terminam. Espere o arquivo aparecer e conferir o tamanho antes de repetir. (26/10/2026.)
- **PDF aberto em outro programa não pode ser sobrescrito.** Exporte com outro nome (`v2`, `v3`) e avise que o anterior ficou velho.

- **`Document.load` falha com caminho acentuado** (`NO_SUCH_FILE_OR_DIRECTORY` em `D:\OneDrive\Área de Trabalho`), embora `Bitmap.loadFromFile` funcione na mesma pasta. Peça à pessoa para abrir o `.af` pelo menu e ache-o em `Document.all`.
- **`doc.close()` de documento não salvo pode ser bloqueado.** Não crie documentos descartáveis à toa; teste numa página do documento da obra ou peça à pessoa para fechar o de teste.

## Memória e estabilidade

- **Muitas imagens grandes num script só derrubam o Affinity** (fechou sem salvar com 23 imagens de ~3400 px). Trabalhe em lotes de 4 a 5 páginas e salve entre os lotes. (Analuz, 23/10/2026.)
- **Affinity que só bipa e não aceita clique** tem um diálogo modal escondido atrás da janela. Peça à pessoa para usar Alt+Tab ou clicar no ícone do Affinity na barra de tarefas.

## Texto

- **O estilo padrão do quadro de texto põe 12 pt depois de cada parágrafo.** Sempre zere: `p.spaceAfter = 0` (e `spaceBefore`, se for o caso).
- **Fonte instalada "só para mim" pode não aparecer no Affinity.** Num computador da equipe, a Nunito só apareceu depois de arrastada para a pasta Fontes do Windows (`C:\Windows\Fonts`) e com o Affinity fechado e aberto de novo. (27/10/2026.)
- **Fonte inexistente não dá erro**: o texto sai em outra fonte. Procure a fonte antes (`F.FontFamily.all`, depois `fonts` da família e `traitsName`, por exemplo `'Regular'`, `'Bold'`, `'ExtraBold'`) e pare se não achar. Em 27/10/2026 a Nunito Medium não estava instalada no computador do coordenador.
- **Largura do texto muda entre programas.** O mesmo texto do Canva em Nunito ocupa mais espaço no Affinity. Dê folga de ~12% na largura do quadro e confira no render.
- **Caixa alta**: converta no script (`toUpperCase()`), não na fonte, para o PDF ter o texto certo.
- Texto que não cabe no quadro fica escondido (overflow) sem aviso. Depois de montar, confira no render se a última linha aparece.

## Imagens e cor

- Carregue bitmaps já em CMYK: `Bitmap.loadFromFile(caminho, RasterFormat.CMYKA8)` e `ImageNodeDefinition.create(RasterFormat.CMYKA8)`.
- **Documento**: `o.rasterFormat = RasterFormat.CMYKA8` e `o.colourProfile = ColourProfile.find('Coated FOGRA39 (ISO 12647-2:2004)')`.
- **Preto do texto**: `CMYKA8(0, 0, 0, 255)` (K100). Valores de `CMYKA8` vão de 0 a 255, não de 0 a 100: C22 = `Math.round(22 * 2.55)`.
- **Imagem que sangra**: ponha a imagem cobrindo a página mais 3 mm de cada lado (`imagemSangrando` da biblioteca). Ela precisa ter a sangria desenhada; se não tiver, crie espelhando a borda antes (Python).
- **Dupla impressa em lâminas separadas**: cada página leva 3 mm da outra metade da dupla como sangria. Monte com páginas simples (não lado a lado) e corte a dupla em duas imagens com 3 mm a mais do lado da dobra.
- **Upscale**: imagens do Canva ou do ChatGPT chegam a ~100–150 dpi no tamanho final. Amplie 3× ou 4× antes (Magnific Precision ou outro), e só depois corte em páginas.

## Documento

- `NewDocumentOptions.createDefault()`, depois `units = UnitType.Millimetre`, `dpi = 300`, `width`/`height` em mm, `isMultiPage = true`, `pageCount`, `isFacing` (false para lâminas da gráfica), `bleed = {left:3, top:3, right:3, bottom:3}`.
- Dentro do documento, as posições são em **pixels a 300 dpi** (1 mm = 300/25,4 px; 1 pt = 300/72 px). A biblioteca tem `mm()` e `pt()`.
- A origem (0,0) de cada página é o canto do corte, não o da sangria: a sangria fica em coordenadas negativas.
- Para achar o documento: `[...Document.all].find(d => d.sessionUuid === ID)`. O `sessionUuid` muda quando o arquivo é fechado e reaberto.
- **Objeto novo entra sempre por cima** dos que já estão na página. Monte na ordem: fundo/imagem, depois formas, depois texto. Para mandar uma imagem para trás: `DocumentCommand.createMoveNodes(Selection.create(doc, img), primeiroTexto, NodeMoveType.Before, NodeChildType.Main)`.
- **Cantos arredondados**: defina `cornerType = Round` **antes** do `setRadius`, nos quatro cantos (`topLeft`, `topRight`, `bottomLeft`, `bottomRight`). Só no `topLeft`, ou com o raio primeiro, o canto sai reto. (27/10/2026.)
- `node.delete()` apaga um objeto. Para limpar só texto e formas e manter a imagem, filtre por `n.constructor.name !== 'ImageNode'`.
- **Não há API de página-mestre.** O SDK só tem `NewDocumentOptions.createMaster` (cria uma mestre vazia); não dá para desenhar nela nem aplicá-la por script. Faça cada tipo de página como uma função que limpa a página e desenha o esqueleto, como em `modelos/agenda/montar_agenda.js`. (Agenda SUNO, 27/10/2026.)
