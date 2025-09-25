const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

// ✅ Serve static files with CORS headers injected
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.woff2') || filePath.endsWith('.woff') || filePath.endsWith('.ttf') || filePath.endsWith('.otf') || filePath.endsWith('.eot')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  }
}));

// ✅ Proxy route
app.get('/', async (req, res) => {
  try {
    const response = await fetch('https://shared.crcwiki.com/states-page/');
    let html = await response.text();

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');

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
