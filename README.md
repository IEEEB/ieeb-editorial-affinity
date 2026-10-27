# IEEB Editorial — Affinity com o Claude

Este repositório ensina o Claude a montar, no **Affinity**, as obras do IEEB (Instituto de Educação Espírita Eurípedes Barsanulfo): livros infantis, a agenda do Instituto e outros livros. Você conversa com o Claude em português. Ele escreve os scripts, monta as páginas no Affinity e registra o que foi feito. Você confere, ajusta à mão quando quiser e exporta para a gráfica.

**Não é preciso saber programar nem ter conta no GitHub.** O Claude baixa esta pasta e configura o seu computador com você.

## Para começar (uma vez só)

1. Instale o **Affinity** (versão 3) e entre com a sua conta.
2. Instale o app **Claude** para computador (https://claude.ai/download) e entre com a sua conta.
3. No app Claude, abra a aba **Code** e escolha uma pasta para trabalhar, por exemplo **Documentos**.
4. Copie e cole esta mensagem para o Claude:

   > Baixe o repositório https://github.com/IEEEB/ieeb-editorial-affinity na minha pasta Documentos e siga o arquivo CONFIGURAR.md para configurar o meu computador comigo.

5. O Claude vai baixar a pasta e conferir, um item por vez, o que falta: o conector do Affinity, as fontes e o Python. Quando precisar que você clique em algo, ele explica onde.
6. No final, ele pede para você **abrir o Claude de novo dentro da pasta `ieeb-editorial-affinity`**. A partir daí é sempre por essa pasta que você trabalha.

## Depois de configurado

Abra a aba Code **na pasta `ieeb-editorial-affinity`** e peça, por exemplo:

- "Vamos diagramar o livro **Quadrinhas de Luz**. A pasta da obra é `<caminho no OneDrive>`."
- "Vamos montar a **agenda 2027 do Instituto**, A5, uma semana por página dupla."
- "Monte a página de teste para eu aprender."

Para pegar as novidades que o coordenador colocar aqui, peça: **"Atualize a pasta do repositório"**.

## Onde fica cada coisa

| O quê | Onde |
|---|---|
| As ferramentas (este repositório) | `Documentos\ieeb-editorial-affinity`, igual para todo mundo; só o coordenador muda |
| A obra: diário (`LOG.md`), ficha (`obra.json`), scripts, `.af`, PDFs | Pasta compartilhada da obra no **OneDrive**, que o coordenador compartilha com você |
| A cópia das imagens que o Affinity lê | **Área de Trabalho**, numa pasta com o nome da obra (o Affinity só lê ali) |

## Regras de convivência

- **Uma pessoa por vez no `.af` de uma obra.** O Affinity não junta edições de duas pessoas.
- **No fim de cada sessão, peça: "Registra no LOG o que fizemos hoje".** O `LOG.md` fica na pasta da obra e é a memória da equipe.
- Descobriu um problema novo no Affinity? O Claude anota no LOG, numa seção para o coordenador, que leva a solução para cá.

Problemas comuns e soluções: [docs/03-problemas-comuns.md](docs/03-problemas-comuns.md). Arquivos para a gráfica: [docs/02-arquivos-para-grafica.md](docs/02-arquivos-para-grafica.md).
