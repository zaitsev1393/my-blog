const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PUBLIC = path.join(__dirname, "public");

const BROWSER_RE = /^Mozilla\//i;
const BOT_RE =
  /bot|crawler|spider|facebookexternalhit|slackbot|twitterbot|linkedinbot|whatsapp|telegram|discordbot|embedly|quora|pinterest|vkshare/i;

console.log("VERCEL_URL:", process.env.VERCEL_URL);
console.log("BASE_URL:", process.env.BASE_URL);

function isBrowser(req) {
  const ua = req.headers["user-agent"] || "";
  return BROWSER_RE.test(ua) && !BOT_RE.test(ua);
}

app.get("/posts/:slug", (req, res) => {
  const file = path.join(PUBLIC, "posts", `${req.params.slug}.html`);
  if (!fs.existsSync(file)) return res.status(404).send("Not found");

  res.sendFile(isBrowser(req) ? path.join(PUBLIC, "index.html") : file);
});

app.use(express.static(PUBLIC));

app.use((req, res) => {
  res.sendFile(path.join(PUBLIC, "index.html"));
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));
}
