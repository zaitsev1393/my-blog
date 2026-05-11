const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');
const { postTemplate, indexTemplate } = require('./template');

const POSTS_DIR = path.join(__dirname, '../posts');
const OUT_DIR = path.join(__dirname, '../public');
const POSTS_OUT_DIR = path.join(OUT_DIR, 'posts');
const CONTENT_OUT_DIR = path.join(OUT_DIR, 'content');

fs.mkdirSync(POSTS_OUT_DIR, { recursive: true });
fs.mkdirSync(CONTENT_OUT_DIR, { recursive: true });

const CHAPTER_ORDER = ['main', 'articles', 'portfolio'];

function parseDate(val) {
  if (!val) return new Date(0);
  // gray-matter returns JS Date objects for YAML dates
  return val instanceof Date ? val : new Date(val);
}

function formatDate(val) {
  const d = parseDate(val);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

const posts = files.map(file => {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
  const { data, content } = matter(raw);
  const slug = path.basename(file, '.md');

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: formatDate(data.date),
    _date: parseDate(data.date),
    category: data.category || 'articles',
    image: data.image || null,
    content: marked(content),
    rawContent: content,
  };
});

posts.sort((a, b) => b._date - a._date);

// Individual post pages (for OG sharing)
for (const post of posts) {
  const html = postTemplate(post);
  fs.writeFileSync(path.join(POSTS_OUT_DIR, `${post.slug}.html`), html);
  console.log(`built: posts/${post.slug}.html`);
}

// Copy raw markdown (without frontmatter) to public/content/
for (const post of posts) {
  fs.writeFileSync(path.join(CONTENT_OUT_DIR, `${post.slug}.md`), post.rawContent);
  console.log(`built: content/${post.slug}.md`);
}

// Copy marked UMD build for browser use
fs.copyFileSync(
  path.join(__dirname, '../node_modules/marked/lib/marked.umd.js'),
  path.join(OUT_DIR, 'marked.umd.js')
);

// Group by chapter
const chapters = {};
for (const cat of CHAPTER_ORDER) chapters[cat] = [];
for (const post of posts) {
  const cat = CHAPTER_ORDER.includes(post.category) ? post.category : 'articles';
  chapters[cat].push(post);
}

// index.html
const html = indexTemplate(chapters, CHAPTER_ORDER);
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), html);
console.log('built: index.html');
