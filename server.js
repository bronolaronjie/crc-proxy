const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

// ✅ Puppeteer-powered route with red/yellow styling
app.get('/', async (req, res) => {
  try {
    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      cacheDirectory: '/opt/render/.cache/puppeteer',
      product: 'chrome'
    });

    const page = await browser.newPage();
    await page.goto('https://shared.crcwiki.com/states-page/', {
      waitUntil: 'networkidle0',
    });

    // ✅ Inject styles after hydration
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        .role-name {
          color: red !important;
          background: yellow !important;
          border: 2px solid red !important;
        }

        #stateSelectDropdown,
        #citySelectDropdown {
          color: red !important;
          background: yellow !important;
        }

        .careers-container {
          margin-left: 15% !important;
          margin-right: 15% !important;
        }
      `;
      document.head.appendChild(style);
    });

    const content = await page.content();
    await browser.close();

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    res.send(content);
  } catch (err) {
    console.error('Puppeteer error:', err);
    res.status(500).send('Error rendering page');
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});



