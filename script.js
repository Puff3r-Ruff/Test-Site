const templates = {
  landing: {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Landing Page</title>
</head>
<body>
  <header class="hero">
    <h1>Grow your ideas online</h1>
    <p>Simple, beautiful landing pages in minutes.</p>
    <button class="cta">Get Started</button>
  </header>

  <section class="features">
    <div class="feature">
      <h2>Fast</h2>
      <p>Launch your page in under 5 minutes.</p>
    </div>
    <div class="feature">
      <h2>Responsive</h2>
      <p>Looks great on any device.</p>
    </div>
    <div class="feature">
      <h2>Customizable</h2>
      <p>Change colors, fonts, and layout easily.</p>
    </div>
  </section>
</body>
</html>`,
    css: `:root {
  --bg: #020617;
  --accent: #22c55e;
  --accent-soft: rgba(34, 197, 94, 0.12);
  --text-main: #e5e7eb;
  --text-muted: #9ca3af;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: radial-gradient(circle at top, #0f172a, #020617 55%);
  color: var(--text-main);
}

.hero {
  text-align: center;
  padding: 4rem 1.5rem 3rem;
}

.hero h1 {
  font-size: clamp(2.2rem, 4vw, 3rem);
  margin-bottom: 0.75rem;
}

.hero p {
  margin: 0 auto 1.5rem;
  max-width: 28rem;
  color: var(--text-muted);
}

.cta {
  background: var(--accent);
  color: #022c22;
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.6rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(34, 197, 94, 0.35);
}

.cta:hover {
  filter: brightness(1.05);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  padding: 0 1.5rem 3rem;
  max-width: 900px;
  margin: 0 auto;
}

.feature {
  background: #020617;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.7);
}

.feature h2 {
  margin-top: 0;
  margin-bottom: 0.4rem;
}

.feature p {
  margin: 0;
  color: var(--text-muted);
}`,
    js: `document.addEventListener("click", (e) => {
  if (e.target.matches(".cta")) {
    alert("Imagine this opens your signup flow ✨");
  }
});`
  },

  portfolio: {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Portfolio</title>
</head>
<body>
  <nav class="nav">
    <span class="logo">E. Doe</span>
    <div class="nav-links">
      <a href="#work">Work</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </div>
  </nav>

  <main>
    <section class="intro">
      <h1>Designer & Frontend Developer</h1>
      <p>I design interfaces that feel calm, clear, and a little bit playful.</p>
    </section>

    <section id="work" class="grid">
      <article class="card">
        <h2>Product Dashboard</h2>
        <p>Analytics dashboard for a SaaS product.</p>
      </article>
      <article class="card">
        <h2>Marketing Site</h2>
        <p>Landing page for a new mobile app.</p>
      </article>
      <article class="card">
        <h2>Brand System</h2>
        <p>Visual identity for a small studio.</p>
      </article>
    </section>
  </main>
</body>
</html>`,
    css: `body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #020617;
  color: #e5e7eb;
}

a {
  color: inherit;
  text-decoration: none;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1.5rem;
  border-bottom: 1px solid #1f2937;
  background: rgba(2, 6, 23, 0.9);
  position: sticky;
  top: 0;
  backdrop-filter: blur(12px);
}

.logo {
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #9ca3af;
}

.nav-links a:hover {
  color: #e5e7eb;
}

.intro {
  padding: 3rem 1.5rem 2rem;
  max-width: 720px;
  margin: 0 auto;
}

.intro h1 {
  font-size: clamp(2rem, 3vw, 2.6rem);
  margin-bottom: 0.75rem;
}

.intro p {
  margin: 0;
  color: #9ca3af;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.5rem;
  padding: 0 1.5rem 3rem;
  max-width: 960px;
  margin: 0 auto;
}

.card {
  background: #020617;
  border-radius: 1rem;
  padding: 1.4rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.7);
}

.card h2 {
  margin-top: 0;
  margin-bottom: 0.4rem;
}

.card p {
  margin: 0;
  color: #9ca3af;
}`,
    js: `document.addEventListener("click", (e) => {
  if (e.target.closest(".card")) {
    const title = e.target.closest(".card").querySelector("h2").textContent;
    alert("Open case study: " + title);
  }
});`
  },

  blog: {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Simple Blog</title>
</head>
<body>
  <header class="blog-header">
    <h1>Notes on Building Things</h1>
    <p>Short posts about design, code, and the messy middle.</p>
  </header>

  <main class="posts">
    <article class="post">
      <h2>Designing with constraints</h2>
      <p>Constraints are not the enemy; they’re the shape of the problem.</p>
    </article>
    <article class="post">
      <h2>Shipping tiny versions</h2>
      <p>Small, shippable slices beat giant, perfect plans every time.</p>
    </article>
    <article class="post">
      <h2>Interfaces that breathe</h2>
      <p>Whitespace is not empty; it’s where the reading happens.</p>
    </article>
  </main>
</body>
</html>`,
    css: `body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #020617;
  color: #e5e7eb;
}

.blog-header {
  padding: 3rem 1.5rem 2rem;
  max-width: 720px;
  margin: 0 auto;
}

.blog-header h1 {
  font-size: clamp(2rem, 3vw, 2.6rem);
  margin-bottom: 0.75rem;
}

.blog-header p {
  margin: 0;
  color: #9ca3af;
}

.posts {
  max-width: 720px;
  margin: 0 auto 3rem;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post {
  background: #020617;
  border-radius: 1rem;
  padding: 1.4rem 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.7);
}

.post h2 {
  margin-top: 0;
  margin-bottom: 0.4rem;
}

.post p {
  margin: 0;
  color: #9ca3af;
}`,
    js: `document.addEventListener("click", (e) => {
  if (e.target.matches(".post h2")) {
    alert("Imagine this opens the full post: " + e.target.textContent);
  }
});`
  }
};

const htmlEditor = document.getElementById("htmlEditor");
const cssEditor = document.getElementById("cssEditor");
const jsEditor = document.getElementById("jsEditor");
const templateSelect = document.getElementById("template");
const resetBtn = document.getElementById("resetTemplate");
const runBtn = document.getElementById("runBtn");
const previewFrame = document.getElementById("previewFrame");

function loadTemplate(name) {
  const tpl = templates[name];
  if (!tpl) return;
  htmlEditor.value = tpl.html;
  cssEditor.value = tpl.css;
  jsEditor.value = tpl.js;
  updatePreview();
}

function updatePreview() {
  const html = htmlEditor.value;
  const css = `<style>${cssEditor.value}</style>`;
  const js = `<script>${jsEditor.value}<\/script>`;

  const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
  doc.open();
  doc.write(html.replace("</head>", `${css}</head>`).replace("</body>", `${js}</body>`));
  doc.close();
}

templateSelect.addEventListener("change", () => {
  loadTemplate(templateSelect.value);
});

resetBtn.addEventListener("click", () => {
  loadTemplate(templateSelect.value);
});

runBtn.addEventListener("click", () => {
  updatePreview();
});

// Live-ish feel: update on typing with debounce
let typingTimer;
[htmlEditor, cssEditor, jsEditor].forEach((el) => {
  el.addEventListener("input", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(updatePreview, 400);
  });
});

// Initial load
loadTemplate("landing");
