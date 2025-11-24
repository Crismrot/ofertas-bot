const productos = require("../data/productos.json");
const { getPriceFromFalabella } = require("../scrapers/falabella");
const { sendMessage } = require("./telegram");

async function revisarPrecios() {
  for (const producto of productos) {
    let precio = null;

    if (producto.store === "falabella") {
      precio = await getPriceFromFalabella(producto.url);
    }

    if (!precio) continue;

    const mensaje = `
🔥 *OFERTA DETECTADA*  
Producto: *${producto.name}*  
Tienda: *${producto.store}*  
Precio actual: *S/ ${precio}*  
🔗 [Ver producto](${producto.url})
    `;

    await sendMessage(mensaje);
  }
}

module.exports = { revisarPrecios };
