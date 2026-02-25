/* script.js
   Prototype generator logic:
   - generateSite(): builds HTML/CSS/JS strings
   - renderPreview(): loads into iframe
   - toggleModifyView(): enables contenteditable on elements with data-editable
   - downloadZip(): packages current preview into index.html, styles.css, script.js using JSZip
*/

(() => {
  // Helpers
  const $ = (sel) => document.querySelector(sel);
  const siteTypeEl = $('#siteType');
  const colorThemeEl = $('#colorTheme');
  const pagesInput = $('#pagesInput');
  const generateBtn = $('#generateBtn');
  const modifyToggleBtn = $('#modifyToggleBtn');
  const downloadBtn = $('#downloadBtn');
  const previewFrame = $('#previewFrame');
  const viewportSelect = $('#viewportSelect');

  let currentFiles = { html: '', css: '', js: '' };
  let modifyMode = false;

  // Simple content pools for randomization
  const headings = {
    business: ['Welcome to', 'Solutions by', 'Trusted by', 'Grow with'],
    portfolio: ['Work of', 'Portfolio —', 'Projects by', 'Creative —'],
    blog: ['Thoughts by', 'Latest from', 'Journal —', 'Insights by'],
    landing: ['Introducing', 'Meet', 'Discover', 'Get started with']
  };
  const lorem = [
    'We craft thoughtful experiences that connect brands and people.',
    'Delivering measurable results through design and engineering.',
    'A small team with big ideas and a focus on quality.',
    'We help businesses scale with modern web solutions.'
  ];
  const services = ['Design', 'Development', 'Strategy', 'Branding', 'Marketing'];

  // Theme generator
  function themeVars(theme) {
    switch (theme) {
      case 'dark': return { bg: '#0f1724', text: '#e6eef8', accent: '#7c9cff', card: '#0b1220' };
      case 'pastel': return { bg: '#fffaf6', text: '#2b2b2b', accent: '#ff9aa2', card: '#fff' };
      case 'vibrant': return { bg: '#fff7f0', text: '#2b2b2b', accent: '#ff6b6b', card: '#fff' };
      default: return { bg: '#ffffff', text: '#222', accent: '#2b6ef6', card: '#fff' };
    }
  }

  // Build CSS for generated site
  function buildSiteCSS(themeVars) {
    return `
/* Generated site styles */
:root{
  --bg:${themeVars.bg};
  --text:${themeVars.text};
  --accent:${themeVars.accent};
  --card:${themeVars.card};
  --radius:10px;
  --maxw:1100px;
}
*{box-sizing:border-box}
body{margin:0;font-family:Inter,system-ui,Segoe UI,Roboto,Arial;background:var(--bg);color:var(--text);line-height:1.5}
.container{max-width:var(--maxw);margin:0 auto;padding:28px}
.header{display:flex;justify-content:space-between;align-items:center;padding:18px 0}
.brand{font-weight:700;font-size:20px}
.nav a{margin-left:14px;color:var(--text);text-decoration:none}
.hero{background:linear-gradient(90deg, rgba(0,0,0,0.03), transparent);padding:36px;border-radius:var(--radius);margin:18px 0}
.hero h1{margin:0 0 12px;font-size:32px}
.hero p{margin:0 0 18px;color:rgba(0,0,0,0.6)}
.btn{display:inline-block;padding:10px 16px;border-radius:8px;background:var(--accent);color:#fff;text-decoration:none}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:18px}
.card{background:var(--card);padding:16px;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,0.04)}
.footer{margin-top:28px;padding:18px 0;color:rgba(0,0,0,0.5);font-size:14px}

/* editable highlight when in modify mode */
[data-editable]{outline: none}
.modify-highlight [data-editable]{box-shadow:0 0 0 2px rgba(99,102,241,0.12);border-radius:6px}
@media (max-width:700px){ .hero h1{font-size:24px} }
`;
  }

  // Build JS for generated site (simple interactivity)
  function buildSiteJS() {
    return `
// Generated site script
document.addEventListener('click', (e) => {
  if (e.target.matches('.nav-toggle')) {
    document.querySelector('.nav')?.classList.toggle('open');
  }
});
`;
  }

  // Build HTML for generated site
  function buildSiteHTML({ siteType, pages, themeName }) {
    const heading = sample(headings[siteType] || headings.business);
    const intro = sample(lorem);
    const serviceList = shuffle(services).slice(0,3).map(s => `<li>${s}</li>`).join('');
    const navLinks = pages.map(p => `<a href="#${slug(p)}" data-editable="true" class="nav-link">${escapeHtml(p)}</a>`).join('');
    // Build page sections
    const sections = pages.map(p => {
      const id = slug(p);
      if (id.toLowerCase() === 'home') {
        return `<section id="${id}" class="container hero">
  <h1 data-editable="true">${escapeHtml(heading)} ${escapeHtml(siteType === 'portfolio' ? '— Portfolio' : '— ' + 'Company')}</h1>
  <p data-editable="true">${escapeHtml(intro)}</p>
  <a class="btn" href="#${id}" data-editable="true">Get Started</a>
</section>`;
      } else if (id.toLowerCase() === 'about') {
        return `<section id="${id}" class="container">
  <div class="card" data-editable="true">
    <h2>About Us</h2>
    <p>${escapeHtml(sample(lorem))}</p>
  </div>
</section>`;
      } else if (id.toLowerCase() === 'services') {
        return `<section id="${id}" class="container">
  <h2 data-editable="true">Our Services</h2>
  <ul class="grid card" data-editable="true">${serviceList}</ul>
</section>`;
      } else if (id.toLowerCase() === 'contact') {
        return `<section id="${id}" class="container">
  <div class="card" data-editable="true">
    <h2>Contact</h2>
    <p>Email: <a href="mailto:hello@example.com" data-editable="true">hello@example.com</a></p>
  </div>
</section>`;
      } else {
        return `<section id="${id}" class="container">
  <div class="card" data-editable="true">
    <h2>${escapeHtml(p)}</h2>
    <p>${escapeHtml(sample(lorem))}</p>
  </div>
</section>`;
      }
    }).join('\n');

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(capitalize(siteType))} Site</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="container header">
    <div class="brand" data-editable="true">${escapeHtml(capitalize(siteType))} Co</div>
    <nav class="nav">${navLinks}</nav>
  </header>

  ${sections}

  <footer class="container footer">
    <div data-editable="true">© ${new Date().getFullYear()} ${escapeHtml(capitalize(siteType))} Co. All rights reserved.</div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;
    return html;
  }

  // Utility functions
  function sample(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
  function shuffle(arr){ return arr.slice().sort(()=>Math.random()-0.5); }
  function slug(s){ return s.trim().toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,''); }
  function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
  function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // Generate site files and render preview
  function generateSite() {
    const siteType = siteTypeEl.value;
    const themeName = colorThemeEl.value;
    const pages = pagesInput.value.split(',').map(p => p.trim()).filter(Boolean);
    if (pages.length === 0) pages.push('Home');

    const theme = themeVars(themeName);
    const css = buildSiteCSS(theme);
    const js = buildSiteJS();
    const html = buildSiteHTML({ siteType, pages, themeName });

    currentFiles = { html, css, js };

    renderPreview(html, css, js);
  }

  // Render into iframe using a blob URL for CSS and JS
  function renderPreview(html, css, js) {
    // Create blob URLs for CSS and JS and inject into HTML
    const cssBlob = new Blob([css], { type: 'text/css' });
    const jsBlob = new Blob([js], { type: 'application/javascript' });
    const cssUrl = URL.createObjectURL(cssBlob);
    const jsUrl = URL.createObjectURL(jsBlob);

    // Replace references in HTML to point to blob URLs
    const htmlWithBlobs = html.replace('styles.css', cssUrl).replace('script.js', jsUrl);

    // Set iframe srcdoc (safer) or use blob URL
    previewFrame.srcdoc = htmlWithBlobs;

    // Clean up object URLs when iframe loads to avoid leaks
    previewFrame.onload = () => {
      URL.revokeObjectURL(cssUrl);
      URL.revokeObjectURL(jsUrl);
      // If modify mode is active, re-enable editing inside iframe
      if (modifyMode) enableModifyInIframe();
    };
  }

  // Toggle modify view: enable contenteditable on elements with data-editable
  function toggleModifyView() {
    modifyMode = !modifyMode;
    modifyToggleBtn.textContent = modifyMode ? 'Exit Modify View' : 'Enter Modify View';
    enableModifyInIframe();
  }

  function enableModifyInIframe() {
    const win = previewFrame.contentWindow;
    const doc = previewFrame.contentDocument;
    if (!doc) return;

    // Add or remove a class on body to style editable highlights
    if (modifyMode) {
      doc.body.classList.add('modify-highlight');
    } else {
      doc.body.classList.remove('modify-highlight');
    }

    // Find all elements with data-editable and toggle contenteditable
    const editableEls = doc.querySelectorAll('[data-editable]');
    editableEls.forEach(el => {
      el.contentEditable = modifyMode ? 'true' : 'false';
      if (modifyMode) {
        // allow simple inline editing and prevent navigation on links
        el.addEventListener('keydown', editableKeyHandler);
      } else {
        el.removeEventListener('keydown', editableKeyHandler);
      }
    });

    // Prevent link navigation while editing
    const links = doc.querySelectorAll('a');
    links.forEach(a => {
      if (modifyMode) {
        a.dataset.href = a.getAttribute('href') || '';
        a.setAttribute('href', 'javascript:void(0)');
      } else {
        if (a.dataset.href) a.setAttribute('href', a.dataset.href);
      }
    });
  }

  function editableKeyHandler(e) {
    // Allow basic editing; prevent Enter from navigating away in some contexts
    if (e.key === 'Enter') {
      e.preventDefault();
      // insert line break
      document.execCommand('insertHTML', false, '<br><br>');
    }
  }

  // Download current preview as ZIP (index.html, styles.css, script.js)
  async function downloadZip() {
    // Grab current DOM from iframe and serialize to HTML, CSS, JS
    const doc = previewFrame.contentDocument;
    if (!doc) {
      alert('Preview not ready.');
      return;
    }

    // Clone doc to sanitize and inline any edits
    const clone = doc.documentElement.cloneNode(true);

    // Restore original link/script references to local filenames
    // Replace blob URLs with local filenames
    const links = clone.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(l => l.setAttribute('href', 'styles.css'));
    const scripts = clone.querySelectorAll('script');
    scripts.forEach(s => {
      if (s.getAttribute('src')) s.setAttribute('src', 'script.js');
    });

    // Remove sandbox attributes or injected handlers
    // Serialize HTML
    const serialized = '<!doctype html>\n' + clone.outerHTML;

    // Use currentFiles.css and currentFiles.js as base, but we must incorporate edits:
    // For edits, we will extract text content from the clone for elements with data-editable
    // and replace placeholders in the serialized HTML (we already have the clone with edits).
    const finalHtml = serialized;

    // Use JSZip to package
    const zip = new JSZip();
    zip.file('index.html', finalHtml);
    zip.file('styles.css', currentFiles.css);
    zip.file('script.js', currentFiles.js);

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-site.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Viewport control
  function applyViewport() {
    const mode = viewportSelect.value;
    const wrapper = document.getElementById('previewFrameWrapper');
    if (mode === 'mobile') {
      wrapper.style.maxWidth = '420px';
      wrapper.style.margin = '0 auto';
    } else if (mode === 'tablet') {
      wrapper.style.maxWidth = '820px';
      wrapper.style.margin = '0 auto';
    } else {
      wrapper.style.maxWidth = '100%';
      wrapper.style.margin = '0';
    }
  }

  // Event bindings
  generateBtn.addEventListener('click', generateSite);
  modifyToggleBtn.addEventListener('click', toggleModifyView);
  downloadBtn.addEventListener('click', downloadZip);
  viewportSelect.addEventListener('change', applyViewport);

  // Initialize with a generated site
  generateSite();
  applyViewport();

})();
