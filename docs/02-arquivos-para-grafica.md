# Arquivos para a gráfica

Exigências da gráfica do IEEB (Fábio, out/2026). Confirme a cada obra nova.

- **PDF/X-1a**, perfil **Coated FOGRA39**, com **3 mm de sangria** e **marcas de corte**.
- **Capa** em um arquivo à parte, **aberta** (capa e contracapa lado a lado).
- **Miolo** em outro PDF, em **lâminas individuais**: uma página por folha do PDF, na ordem de leitura (1, 2, 3…). Quem monta a ordem para grampear é a gráfica.

## Exportar pelo Affinity (é você quem faz)

O script não liga as marcas de corte nem a sangria do PDF/X. Por isso o PDF da gráfica sai pelo diálogo (os nomes podem mudar um pouco conforme a versão do Affinity; na dúvida, mande um print ao Claude):

1. Arquivo → **Exportar** → **PDF**.
2. Predefinição: **PDF/X-1a:2003**.
3. Clique em **Mais**:
   - Área: **Todas as páginas**; marque **Incluir sangria**;
   - **Marcas de corte** ligadas;
   - Perfil de cor: **Coated FOGRA39**;
   - Páginas: **individuais** (não lado a lado).
4. Exporte com o nome `<Obra> miolo.pdf` (ou `capacontracapa.pdf`) na pasta da obra no OneDrive.
5. Peça ao Claude: **"Confere o PDF da gráfica"**. Ele mede páginas, sangria, fontes embutidas e cores.

Se aparecer aviso de transparência ou RGB, chame o Claude antes de mandar.

## Capa

- **Por fora**: contracapa à esquerda, capa à direita.
- **Por dentro**: 2ª capa à esquerda (fica de frente para a 1ª página do miolo) e 3ª capa à direita.
- **Grampeado**: sem lombada (confirme com a gráfica se vai algum espaço entre as duas metades).
- **Colado**: a gráfica informa a largura da lombada a partir do papel e do número de páginas.

## PDF para o ISBN

A agência do ISBN pede o livro inteiro, em ordem de leitura, sem sangria e sem marcas: 1ª capa, 2ª capa, miolo, 3ª capa, 4ª capa. O Claude monta esse PDF a partir dos PDFs da gráfica (e uma versão leve, de ~150 dpi, para enviar por e-mail).

## Antes de enviar

Peça à gráfica uma **prova** (digital ou impressa) e confira cor, corte e ordem das páginas.
