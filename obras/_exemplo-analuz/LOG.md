# Analuz, um Raio de Sol na Terra — exemplo real de diagramação

Este foi o primeiro livro que o IEEB diagramou no Affinity com o Claude, de 23 a 26/10/2026. Ficou aqui como **exemplo**. Os scripts originais estão em `scripts/`. Eles foram escritos antes da `biblioteca/base.js` e usam a pasta de trabalho do coordenador; para uma obra nova, comece de `modelos/livro-infantil/`.

O texto do livro **não** está aqui, porque o livro ainda não foi lançado.

## Ficha

- 21 × 24 cm (largura × altura), miolo de 20 páginas, mais capa aberta com 2ª e 3ª capa. Grampeado.
- PDF/X-1a:2003, Coated FOGRA39, 3 mm de sangria, marcas de corte.
- Nunito Bold, texto em caixa alta (4 anos), todo em preto K100.
- Imagens exportadas do Canva da equipe sem texto e ampliadas 4× antes de entrar no Affinity.

## Scripts

| Script | O que faz |
|---|---|
| `scripts/preparar_paginas.py` | Corta as duplas em páginas com 3 mm de sangria: do lado da lombada vem da página vizinha; nas bordas, espelhada |
| `scripts/montar_livro.js` | Cria o documento e põe em cada página a imagem e os textos lidos de `layout_canva.json` |
| `scripts/creditos.js` | Página de créditos e ficha CIP (moldura, fios, ISBN provisório em vermelho) |
| `scripts/paginas_rosto.js` | Mapa das páginas depois que entrou a folha de rosto |

O `layout_canva.json` (não incluído) é uma lista com uma entrada por página, e cada entrada é uma lista de elementos lidos do Canva, em px de 96 dpi:

```json
[ { "k": "text", "x": 135.3, "y": 79.4, "w": 579, "h": 117.6,
    "runs": [ { "t": "TEXTO DA PÁGINA", "size": 15.97, "w": "bold", "c": "#523020", "al": "end", "lh": 1.5, "ls": 0.09, "list": "none" } ] },
  { "k": "shape", "x": 40, "y": 600, "w": 300, "h": 80, "fill": "#ffffff", "op": 0.9, "r": true } ]
```

## O que aprendemos (resumo do diário)

1. **Começo (23/10):** documento de 24 páginas simples, na ordem do Canva. As imagens vieram do próprio Canva sem texto, porque o enquadramento ali era diferente dos arquivos soltos. A resolução ficou baixa (~92 a 130 dpi), então as imagens precisaram ser ampliadas.
2. **Ampliação:** 4× em todas as imagens. Ao trocar as 23 de uma vez, **o Affinity fechou sem salvar**; daí veio a regra dos lotes de 5 páginas.
3. **Primeiro salvamento:** o script não consegue fazer o "Salvar como". O coordenador salvou pelo menu; depois disso, `doc.save()` funcionou.
4. **Divisão para a gráfica:** capa aberta num arquivo (por fora: contracapa | capa; por dentro: 2ª | 3ª capa) e miolo de 20 páginas em outro. O texto marrom do Canva passou a preto K100, por contraste.
5. **PDFs da gráfica** saíram pelo diálogo de exportação (PDF/X-1a, sangria, marcas de corte) e foram conferidos: 2 páginas de 420 × 240 mm na capa e 20 lâminas de 210 × 240 mm no miolo, fonte embutida.
6. **Revisão do texto (24/10):** as correções do docx foram aplicadas nos três `.af` por script. Créditos e ficha CIP foram refeitos com `creditos.js`.
7. **Folha de rosto:** entrou na p. 1, com os créditos no verso (p. 2). As páginas da história andaram duas posições (`paginas_rosto.js`).
8. **PDF para o ISBN:** montado a partir dos PDFs da gráfica, cortado no formato final, sem marcas, em ordem de leitura (1ª capa, 2ª capa, miolo, 3ª capa, 4ª capa), em versão alta e leve.
9. **PDF aberto não pode ser substituído:** quando o leitor de PDF estava com o arquivo aberto, foi preciso exportar com outro nome (v2, v3…).
