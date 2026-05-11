const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

function postTemplate({ title, description, image, date, slug, content }) {
  const ogImage = image ? `${BASE_URL}${image}` : `${BASE_URL}/og-default.png`;
  const canonical = `${BASE_URL}/posts/${slug}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="${canonical}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="stylesheet" href="/style.css" />
</head>
<body class="page-post">
  <header>
    <nav><a href="/">← All posts</a></nav>
  </header>
  <main class="post">
    <h1>${title}</h1>
    <time>${date}</time>
    <article>${content}</article>
  </main>
</body>
</html>`;
}

function subchapterHTML({ slug, title, date, description }) {
  return `
          <li class="subchapter" data-slug="${slug}" data-title="${title}" data-description="${description}">
            <span class="sc-title">${title}</span>
            <span class="sc-fill"></span>
            <span class="sc-date">${date}</span>
          </li>`;
}

function chapterHTML(name, posts) {
  const label = name.charAt(0).toUpperCase() + name.slice(1);
  return `
        <div class="chapter open">
          <button class="chapter-name">${label}</button>
          <ul class="subchapter-list">
            ${posts.map(subchapterHTML).join('')}
          </ul>
        </div>`;
}

function indexTemplate(chapters, order) {
  const chaptersHTML = order.map(name => chapterHTML(name, chapters[name])).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Blog</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content="" />
  <meta property="og:description" content="" />
  <meta property="og:url" content="" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="" />
  <meta name="twitter:description" content="" />
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <div class="layout">
    <aside class="index-col">
      <h2 class="index-title">Index</h2>
      <nav class="toc">${chaptersHTML}
      </nav>
    </aside>
    <main class="content-col" id="content-col">
      <p class="content-placeholder">select a section</p>
    </main>
  </div>
  <script src="/marked.umd.js"></script>
  <script src="/main.js"></script>
</body>
</html>`;
}

module.exports = { postTemplate, indexTemplate };
