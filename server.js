const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PUBLIC = path.join(__dirname, 'public');

const CRAWLER_RE = /bot|crawler|spider|facebookexternalhit|slackbot|twitterbot|linkedinbot|whatsapp|telegram|discordbot|embedly|quora|pinterest|vkshare|w3c_validator/i;

app.get('/posts/:slug', (req, res) => {
  const file = path.join(PUBLIC, 'posts', `${req.params.slug}.html`);
  if (!fs.existsSync(file)) return res.status(404).send('Not found');

  const isCrawler = CRAWLER_RE.test(req.headers['user-agent'] || '');
  res.sendFile(isCrawler ? file : path.join(PUBLIC, 'index.html'));
});

app.use(express.static(PUBLIC));

app.use((req, res) => {
  res.sendFile(path.join(PUBLIC, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));
