const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.falabella.com.pe';
const CATEGORY_URL = 'https://www.falabella.com.pe/falabella-pe/category/cat210477/TV-Televisores';

async function getTvCategoryPage() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true, // o 'new' según versión
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
    );

    await page.goto(CATEGORY_URL, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    const products = [];

    $('a.pod.pod-4_GRID.pod-link').each((i, el) => {
      const card = $(el);

      const brand = card.find('b.pod-title').first().text().trim();
      const title = card.find('b.pod-subTitle').first().text().trim();

      let link = card.attr('href') || '';
      if (link && link.startsWith('/')) link = BASE_URL + link;

      const internetAttr = card.find('li[data-internet-price]').attr('data-internet-price');
      let currentPrice = null;
      if (internetAttr) {
        const clean = internetAttr.replace(/[^\d]/g, '');
        currentPrice = parseFloat(clean);
      }

      const normalAttr = card.find('li[data-normal-price]').attr('data-normal-price');
      let oldPrice = null;
      if (normalAttr) {
        const cleanOld = normalAttr.replace(/[^\d]/g, '');
        oldPrice = parseFloat(cleanOld);
      }

      let discountPercent = null;
      const discountText = card.find('.discount-badge-item').first().text().trim();
      if (discountText) {
        const cleanDisc = discountText.replace(/[^\d-]/g, '');
        if (cleanDisc) discountPercent = parseFloat(cleanDisc);
      } else if (oldPrice && currentPrice && oldPrice > currentPrice) {
        discountPercent = Math.round(((currentPrice - oldPrice) / oldPrice) * 100);
      }

      if (!title || !currentPrice) return;

      const isSponsored = card.attr('data-sponsored') === 'true';

      products.push({
        title,
        brand,
        currentPrice,
        oldPrice,
        discountPercent,
        url: link,
        sponsored: isSponsored
      });
    });

    return products;
  } catch (err) {
    console.error('❌ Error obteniendo categoría TVs Falabella con Puppeteer:', err.message);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { getTvCategoryPage };
