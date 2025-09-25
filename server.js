const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

// ✅ Serve static files with CORS headers injected
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.woff2')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'font/woff2'); // ✅ This is the key fix
      console.log('Serving font:', filePath);
    }
  }
}));

// ✅ Manual route for font delivery (fallback)
app.get('/fonts/FoundersGrotesk-Regular.woff2', (req, res) => {
  const fontPath = path.join(__dirname, 'public/fonts/FoundersGrotesk-Regular.woff2');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'font/woff2');
  res.sendFile(fontPath);
  console.log('Manually Serving font:', filePath);
});

// ✅ Proxy route
app.get('/', async (req, res) => {
  try {
    const response = await fetch('https://shared.crcwiki.com/states-page/');
    let html = await response.text();

    // ✅ Rewrite font URL to use proxy-hosted version
    html = html.replace(
      /https:\/\/shared\.crcwiki\.com\/fonts\/FoundersGrotesk-Regular\.woff2/g,
      'https://crc-proxy.onrender.com/fonts/FoundersGrotesk-Regular.woff2'
    );

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



