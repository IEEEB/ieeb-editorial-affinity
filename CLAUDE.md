# IEEB Editorial — instruções para o Claude

Esta pasta é onde a equipe do IEEB (Instituto de Educação Espírita Eurípedes Barsanulfo) monta obras no **Affinity 3** com a sua ajuda: livros infantis, a agenda do Instituto, livros de texto e outras peças impressas. Quem conversa com você **não é programador**. Explique em português simples, mostre o resultado (render da página) e não despeje código na conversa.

Todo trabalho de diagramação segue a skill `affinity-ieeb` (em `.claude/skills/`). Carregue-a ao começar.

## Como trabalhar

1. **Antes de qualquer script**, leia `.claude/skills/affinity-ieeb/referencias/01-armadilhas-do-affinity.md`. Ela traz o que já quebrou e como contornar.
2. **Cada obra tem a sua pasta no OneDrive compartilhado**, fora deste repositório. Pergunte à pessoa onde está, se ela não disser. Na pasta da obra ficam:
   - `obra.json`: formato, páginas, sangria, fontes, cores, pasta de trabalho;
   - `LOG.md`: o diário da obra (datas, quem, decisões, pendências);
   - `scripts/` e `dados/`: os scripts que montam a obra, numerados na ordem em que rodam, e os textos e layouts em JSON;
   - os `.af` e os PDFs.
   Leia o `LOG.md` antes de começar e escreva nele antes de terminar. É a memória da equipe: o Claude de cada pessoa não enxerga a memória do outro.
3. **Comece de um modelo.** `modelos/livro-infantil`, `modelos/agenda` ou `modelos/livro-texto`, mais `modelos/obra.exemplo.json` e `modelos/LOG.modelo.md`. Copie para a pasta da obra e ajuste.
4. **Use a biblioteca.** Os scripts do Affinity não importam arquivos locais: ao rodar, leia `biblioteca/base.js` e cole o conteúdo no início do script, seguido do código da obra. Não reescreva o que a biblioteca já faz.
5. **Mostre antes de seguir.** Depois de montar uma página nova ou um tipo novo de página, use `render_spread` e mostre à pessoa. Só monte o resto depois do "ok".
6. **Lotes pequenos.** Com imagens grandes, no máximo 4 a 5 páginas por script. Num script só, o Affinity já fechou sem salvar.
7. **Salvar.** O primeiro "Salvar como" é sempre manual (pelo menu). Peça à pessoa e espere. Depois disso, `doc.save()` funciona.
8. **PDF da gráfica sai pelo diálogo** de exportação do Affinity (PDF/X-1a, sangria de 3 mm, marcas de corte). Diga à pessoa como fazer; o script não liga as marcas de corte. Ver `docs/02-arquivos-para-grafica.md`.
9. **Registre o que aprender.** Armadilha nova do Affinity ou peça de script que serviu bem → anote no `LOG.md` da obra, na seção **"Para levar ao repositório"**, com a data e o trecho de código. O coordenador traz isso para cá.

## Este repositório é só de leitura para a equipe

A equipe não tem conta no GitHub. Para quem não é o coordenador:
- **Não edite** os arquivos deste repositório, não faça commit nem push. O trabalho vai para a pasta da obra no OneDrive.
- **Para atualizar** ("atualize a pasta do repositório"): `git pull` se a pasta tiver `.git`; senão, baixe o ZIP de novo como em `CONFIGURAR.md` e substitua a pasta (nada da equipe se perde, porque as obras ficam no OneDrive).
- Se a pessoa ainda não configurou o computador, siga `CONFIGURAR.md`.

Para o coordenador: imagens, `.af`, PDFs, docx e fontes nunca entram aqui (o `.gitignore` barra). O repositório é público: não ponha texto de livro não lançado, links internos, caminhos pessoais nem dados de pessoas.

## Regras do IEEB para qualquer obra

- **Texto em preto 100% K** (C0 M0 Y0 K100), salvo decisão registrada da obra. Preto composto (CMYK misturado) borra na gráfica.
- **Perfil de cor Coated FOGRA39**, documento em CMYK, imagens a pelo menos 300 dpi no tamanho final. Imagem abaixo disso: avise e sugira ampliar (o Magnific ou outro upscale) antes de seguir.
- **Sangria de 3 mm** em toda peça que vai para a gráfica. Texto e rostos a pelo menos 8 mm do corte.
- **Livros de 4 e 5 anos: texto todo em caixa alta.**
- **Fonte da casa: Nunito.** Confira se a espessura pedida está instalada antes de usar (`fonts.js`); se faltar, avise.
- Créditos e ficha catalográfica (CIP) seguem o modelo em `modelos/livro-infantil/creditos-cip.md`. ISBN que ainda não existe fica em vermelho, para ninguém esquecer.

### Regras visuais (livros e artes com personagens)

- Espíritos, anjos e mensageiros **nunca têm asas**: são pessoas envoltas em luz suave.
- **Ninguém ajoelhado em prece, penitência ou reverência.** Agachar para abraçar uma criança, na altura dela, pode.
- Sem auréola, coroa, manto celestial ou raios saindo do corpo. Maria e personagens espirituais nunca acima das pessoas.
- Maria segue o retrato mediúnico associado a Chico Xavier: olhos azuis com íris visível e cabelo dourado solto.
- Texto nunca dentro da imagem gerada: o texto é sempre do Affinity.

Se uma ilustração recebida desrespeitar uma dessas regras, avise antes de diagramar.
