const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

// ✅ Proxy route with injected color styling
app.get('/', async (req, res) => {
  try {
    const response = await fetch('https://shared.crcwiki.com/states-page/');
    let html = await response.text();

    // ✅ Inject color-only style script before </body>
    const dynamicStyleScript = `
<script>
  const style = document.createElement('style');
  style.innerHTML = \`
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
  \`;
  document.head.appendChild(style);
</script>
`;

    html = html.replace('</body>', `${dynamicStyleScript}</body>`);

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
