const express = require('express');
const fetch = require('node-fetch');
const app = express();
const path = require('path');

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Add CORS headers for all static assets
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', async (req, res) => {
  try {
    const response = await fetch('https://shared.crcwiki.com/states-page/');
    let html = await response.text();

    // Strip restrictive headers
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


