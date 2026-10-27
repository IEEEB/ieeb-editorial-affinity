// Teste do conector: não cria nada, só informa. Rode sozinho (sem a base.js).
const { app } = require('/application.js');
const { Document } = require('/document.js');
const F = require('/fonts.js');
const nunito = [...F.FontFamily.all].find((f) => f.name === 'Nunito');
console.log(JSON.stringify({
    areaDeTrabalho: app.userDesktopPath,
    documentosAbertos: [...Document.all].map((d) => ({ titulo: d.title, id: d.sessionUuid, paginas: [...d.spreads].length })),
    nunito: nunito ? [...nunito.fonts].map((f) => f.traitsName) : 'NÃO INSTALADA',
}, null, 2));
