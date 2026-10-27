# Checklist antes de exportar

Rode e mostre o resultado à pessoa. Item que falhar: diga qual página e o que fazer.

## Por script (conferência automática)

- [ ] **Número de páginas** confere com `obra.json` e é múltiplo de 4 (grampeado).
- [ ] **Fontes**: todo texto usa fonte instalada e a espessura prevista.
- [ ] **Cor do texto**: todo texto em K100 (C0 M0 Y0 K100), salvo exceções registradas no LOG (por exemplo, texto branco sobre fundo escuro; ISBN provisório em vermelho).
- [ ] **Resolução**: toda imagem com ≥ 300 dpi no tamanho em que está na página (largura em px ÷ largura em polegadas).
- [ ] **Margem de segurança**: nenhum quadro de texto a menos de 8 mm do corte.
- [ ] **Imagens que sangram** chegam a 3 mm além do corte nos quatro lados.

## No render (olhando)

- [ ] Nenhum texto cortado no fim do quadro (overflow escondido).
- [ ] Nenhum texto em cima de rosto ou detalhe importante da ilustração.
- [ ] Números de página nas páginas certas (não em capa, rosto, créditos, salvo decisão).
- [ ] Duplas: a imagem continua certa de uma página para a outra.
- [ ] Regras visuais do IEEB (CLAUDE.md) respeitadas nas ilustrações.

## Conteúdo

- [ ] Texto confere com o docx final da equipe (letra por letra, acentos, pontuação).
- [ ] Caixa alta nos livros de 4 e 5 anos.
- [ ] Créditos e ficha CIP com o número de páginas e o formato certos.
- [ ] ISBN, QR code e link preenchidos, ou marcados em vermelho como pendência no LOG.
