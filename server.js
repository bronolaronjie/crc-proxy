const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

// ✅ Manual route for Founders Grotesk
app.get('/fonts-local/founders-grotesk-v3.woff2', (req, res) => {
  console.log('Manual route hit for Founders Grotesk');
  const fontPath = path.join(__dirname, 'assets/fonts/founders-grotesk-v3.woff2');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'font/woff2');
  res.sendFile(fontPath);
});

// ✅ Manual route for Canela
app.get('/fonts-local/canela-light-web.woff2', (req, res) => {
  console.log('Manual route hit for Canela');
  const fontPath = path.join(__dirname, 'assets/fonts/canela-light-web.woff2');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'font/woff2');
  res.sendFile(fontPath);
});

// ✅ Proxy route
app.get('/', async (req, res) => {
  try {
    const response = await fetch('https://shared.crcwiki.com/states-page/');
    let html = await response.text();

    // ✅ Rewrite remote font URL to local proxy version
    html = html.replace(
      /https:\/\/shared\.crcwiki\.com\/fonts\/FoundersGrotesk-Regular\.woff2/g,
      'https://crc-proxy.onrender.com/fonts-local/founders-grotesk-v3.woff2'
    );

    // ✅ Inject MutationObserver script before </body>
    const styleMessageScript = `
<script>
  window.addEventListener('message', function (event) {
    if (event.origin === 'https://staging-crc.webflow.io' && event.data.type === 'applyRoleStyles') {
      const style = document.createElement('style');
      style.innerHTML = \`
        @font-face {
          font-family: 'Canela';
          src: url('/fonts-local/canela-light-web.woff2') format('woff2');
          font-weight: 300;
          font-style: normal;
        }

        .role-name {
          font-family: 'Canela', sans-serif !important;
          font-weight: 300 !important;
          color: red !important;
          background: yellow !important;
          border: 2px solid red !important;
        }
      \`;
      document.head.appendChild(style);
    }
  });
</script>
`;
html = html.replace('</body>', `${styleMessageScript}</body>`);

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


