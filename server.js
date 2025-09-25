const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

// ✅ Manual route for font delivery (bypasses Render static layer)
app.get('/custom-font/founders-grotesk-v3.woff2', (req, res) => {
  console.log('Manual route hit for custom font');
  const fontPath = path.join(__dirname, 'assets/fonts/founders-grotesk-v3.woff2');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'font/woff2');
  res.sendFile(fontPath);
});

// ✅ Proxy route
app.get('/', async (req, res) => {
  try {
    const response = await fetch('https://shared.crcwiki.com/states-page/');
    let html = await response.text();

    // ✅ Rewrite font URL to use proxy-hosted version
    html = html.replace(
      /https:\/\/shared\.crcwiki\.com\/fonts\/FoundersGrotesk-Regular\.woff2/g,
      'https://crc-proxy.onrender.com/custom-font/founders-grotesk-v3.woff2'
    );

    // ✅ Inject custom font styling
    const customStyle = `
  <style>
    @font-face {
      font-family: 'Founders Grotesk';
      src: url('/custom-font/founders-grotesk-v3.woff2') format('woff2');
      font-weight: 300;
      font-style: normal;
    }

    @font-face {
      font-family: 'Canela';
      src: url('/custom-font/canela-light-web.woff2') format('woff2');
      font-weight: 300;
      font-style: normal;
    }

    .role-name {
      font-family: 'Canela', sans-serif;
      font-weight: 300;
    }

    #stateSelectDropdown,
    #citySelectDropdown {
      font-family: 'Founders Grotesk', sans-serif;
      font-weight: 300;
    }
  </style>
`;

    // ✅ Inject the style block before </head>
    html = html.replace('</head>', `${customStyle}</head>`);

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



