// Remontagem com folha de rosto (24/10/2026). Miolo de 20 p.:
// p1 rosto (imagem da capa) | p2 créditos e ficha | p3 trova | p4–19 = antigas p2–17 | p20 = colorir (antiga 18).
// Labirinto (antiga 20) vai para a 2ª capa; a página de desenhar (antiga 19) sai.
// Este arquivo é a referência do mapeamento; o código que roda no Affinity é colado em lotes de 5 páginas.
function specMiolo(n) {                       // n = página nova do miolo (1–20)
    if (n === 1) return { img: 'ampliadas\\capa', layout: null, numero: null };
    if (n === 2) return { img: 'paginas\\p00', layout: null, numero: null, creditos: true };
    if (n <= 19) { const o = n - 2; return { img: 'ampliadas\\p' + String(o).padStart(2, '0'), layout: o + 1, numero: n }; }
    return { img: 'ampliadas\\p18', layout: 19, numero: 20 };
}
// arquivo completo (24 faces): spread 0 capa, 1 = 2ª capa (labirinto), 2–21 = miolo p1–20, 22 música, 23 contracapa
const specCompleto = (s) => s === 1 ? { img: 'ampliadas\\p20', layout: 21, numero: null } : specMiolo(s - 1);
