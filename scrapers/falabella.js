const axios = require('axios');
const cheerio = require('cheerio');

async function getPriceFromFalabella(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(response.data);

    // Selección aproximada (luego ajustamos según el producto real)
    let priceText = $(".fb-price__current").first().text();

    if (!priceText) {
      console.log("⚠ No se encontró el precio en Falabella");
      return null;
    }

    priceText = priceText.replace(/[^\d.]/g, "");
    const price = parseFloat(priceText);

    return price;
  } catch (err) {
    console.error("❌ Error en scraper Falabella:", err.message);
    return null;
  }
}

module.exports = { getPriceFromFalabella };
