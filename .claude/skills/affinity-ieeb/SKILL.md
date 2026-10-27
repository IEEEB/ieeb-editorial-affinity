---
name: affinity-ieeb
description: Processo do IEEB para diagramar obras no Affinity 3 pelo conector MCP — livros infantis, agenda do Instituto, livros de texto, capas, créditos e ficha CIP, arquivos para a gráfica (PDF/X-1a, sangria, lâminas, capa aberta). Use SEMPRE que alguém pedir para "diagramar", "montar no Affinity", "montar as páginas", "fazer a capa", "agenda", "ficha catalográfica", "exportar para a gráfica", "trocar o texto da página", "ampliar imagens para o livro", ou citar uma obra da pasta obras/.
---

# Diagramação no Affinity — processo do IEEB

Caminhos relativos à raiz do repositório. `SK` = `.claude/skills/affinity-ieeb`.

## Etapa 0 — Abertura

1. Leia `SK/referencias/01-armadilhas-do-affinity.md`. Não pule.
2. Teste o conector: rode `biblioteca/teste-conexao.js` com `execute_script`. Ele devolve a versão, a Área de Trabalho e os documentos abertos. Erro → peça à pessoa para abrir o Affinity e ligar o MCP (ver `docs/01-primeiro-uso.md`).
3. Pergunte onde está a pasta da obra no OneDrive (se a pessoa não disse). Se a obra já existe, leia o `LOG.md` e o `obra.json` de lá. Se o computador ainda não foi configurado, siga `CONFIGURAR.md` primeiro.
4. Pessoa nova na equipe ou pedido de "página de teste": rode `biblioteca/base.js` + `biblioteca/exemplo-pagina-teste.js`, mostre o render e explique o que cada função fez. Peça para fechar o documento de teste sem salvar.

## Etapa 1 — Briefing (obra nova)

Pergunte o que faltar, numa mensagem só, e registre em `obra.json`:
- tipo (livro infantil, agenda, livro de texto, peça avulsa);
- formato final (largura × altura em mm), número de páginas e se as páginas são lado a lado;
- acabamento (grampo, cola/lombada, wire-o) e gráfica, se já souberem;
- de onde vêm o texto (docx, Canva, planilha) e as imagens;
- fontes e cores; faixa etária, se for infantil.

Confira: miolo grampeado precisa de páginas em **múltiplo de 4**. Ver `SK/referencias/02-formatos-e-medidas.md`.

## Etapa 2 — Pasta de trabalho

O Affinity da Microsoft Store **só lê e grava na Área de Trabalho**. Crie lá `<Área de Trabalho>/<Nome da obra>/` com:
- `imagens/` (as artes, já com o nome da página: `p01.jpg`, `capa.jpg`…);
- `dados/` (textos e layout em JSON, que os scripts leem).

Os originais (scripts, JSON, imagens, `.af`) ficam na pasta da obra no OneDrive; a pasta da Área de Trabalho é só a cópia que o Affinity consegue ler. Ao terminar, copie de volta para a pasta da obra os scripts e JSON que mudaram. O campo `pasta_trabalho` do `obra.json` diz o nome da pasta na Área de Trabalho.

Prepare as imagens com Python antes de levá-las ao Affinity: confira a resolução (≥ 300 dpi no tamanho final, com sangria), converta para JPG de alta qualidade e, se a arte não tiver sangria, crie 3 mm espelhando a borda (ver `modelos/livro-infantil/preparar_imagens.py`).

## Etapa 3 — Documento e página-modelo

1. Copie o modelo para `<pasta da obra>/scripts/` e ajuste as constantes do topo.
2. Monte o documento vazio e **uma página de cada tipo** (abertura, página de texto, dupla, créditos…).
3. `render_spread` de cada uma e mostre. Ajuste até a pessoa aprovar.
4. Peça à pessoa para **salvar pelo menu** (Arquivo → Salvar como) na pasta da obra no OneDrive. Registre o caminho no `LOG.md`.

## Etapa 4 — Montagem em lotes

- Lotes de 4 a 5 páginas por script quando houver imagens grandes. Depois de cada lote: `doc.save()`, render de conferência de uma página.
- Scripts que mexem em páginas já montadas devem **apagar só o que vão recriar** (nunca a página toda sem avisar).
- Ache o documento pelo `sessionUuid` (guarde no LOG enquanto a sessão estiver aberta) ou pelo título, nunca "o documento ativo" se houver mais de um aberto.

## Etapa 5 — Conferência

Antes de exportar, rode o checklist de `SK/referencias/03-checklist-de-conferencia.md`: texto K100, fontes presentes, imagens ≥ 300 dpi, nada importante a menos de 8 mm do corte, número de páginas, ficha CIP, ISBN.

## Etapa 6 — Arquivos para a gráfica

Siga `docs/02-arquivos-para-grafica.md`. A exportação PDF/X-1a com marcas de corte é feita **pela pessoa, no diálogo**. Você pode exportar PDFs de prova (`doc.export`) para conferir. Exportação por script pode passar do tempo do conector e terminar em segundo plano: espere o arquivo aparecer antes de concluir que falhou.

## Etapa 7 — Registro

No fim de cada sessão, acrescente ao `LOG.md` da obra (no OneDrive): data, quem, o que foi feito, decisões (com o porquê), pendências, onde estão os `.af` e PDFs. Armadilha nova do Affinity ou peça de script reaproveitável → seção **"Para levar ao repositório"** do mesmo LOG. Não edite este repositório (ver CLAUDE.md).

## Tipos de obra

| Tipo | Modelo | Referência |
|---|---|---|
| Livro infantil ilustrado | `modelos/livro-infantil/` | exemplo real em `obras/_exemplo-analuz/` |
| Agenda do Instituto | `modelos/agenda/` | gera as páginas a partir de um calendário em JSON |
| Livro de texto | `modelos/livro-texto/` | texto corrido em quadros encadeados, estilos de parágrafo |
