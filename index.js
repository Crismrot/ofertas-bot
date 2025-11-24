const { getTvCategoryPage } = require('./scrapers/falabellaCategory');
const { sendMessage } = require('./services/telegram');

(async () => {
  console.log('🔎 Leyendo categoría TVs Falabella (página 1)...');

  const products = await getTvCategoryPage();
  console.log(`Encontrados ${products.length} productos en la página 1`);

  // Filtrar ofertas FUERTES (ej: -20% o más)
  const buenasOfertas = products.filter(
    (p) => p.discountPercent !== null && p.discountPercent <= -20
  );

  console.log(`Ofertas fuertes: ${buenasOfertas.length}`);

  for (const p of buenasOfertas.slice(0, 5)) {
    const msg = `
🔥 *OFERTA TV FALABELLA*
*${p.title}*
Marca: *${p.brand || 'N/D'}*
Precio actual: *S/ ${p.currentPrice.toLocaleString('es-PE')}* ${
      p.oldPrice ? `(antes S/ ${p.oldPrice.toLocaleString('es-PE')})` : ''
    }
Descuento: *${p.discountPercent}%*
${p.sponsored ? '📌 (Patrocinado)' : ''}

🔗 [Ver producto](${p.url})
    `.trim();

    await sendMessage(msg);
  }

  console.log('🏁 Fin de la prueba');
})();
