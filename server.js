const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

// ✅ Apply CORS headers first — before anything else
app.use('/fonts', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// ✅ Then serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Proxy route
app.get('/', async (req, res) => {
  try {
    const response = await fetch('https://shared.crcwiki.com/states-page/');
    let html = await response.text();

    res.setHeader('Content-Type', 'text/html');
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

