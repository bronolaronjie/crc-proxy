const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

// ✅ Proxy route with color-only styling injected into <body>
app.get('/', async (req, res) => {
  try {
    const response = await fetch('https://shared.crcwiki.com/states-page/');
    let html = await response.text();

    // ✅ Inject <style> directly before </body>
    const injectedStyle = `
<style>
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
</style>
`;

    html = html.replace('</body>', `${injectedStyle}</body>`);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    res.send(html);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).send('Error fetching content');
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
