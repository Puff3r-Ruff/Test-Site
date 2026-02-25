// script.js
// Randomize prefab selection and inject editable content into prefab HTML.

const PREFAB_BASE = detectBasePath() + 'prefabs/'; // auto-detect base path for GitHub Pages
const $ = id => document.getElementById(id);

function detectBasePath() {
  const path = window.location.pathname || '/';
  if (path.endsWith('index.html')) return path.replace(/index\.html$/, '');
  return path.endsWith('/') ? path : path.replace(/[^/]*$/, '');
}

function safeFetch(url, opts) {
  return fetch(url, opts).then(res => {
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    return res;
  });
}

function rand(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function escapeHtml(str){ return String(str||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }

// Load manifest for a type
async function loadPrefabsForType(type){
  const select = $('prefabSelect');
  select.innerHTML = '<option value="">— Use generated layout —</option>';
  try {
    const res = await safeFetch(`${PREFAB_BASE}${encodeURIComponent(type)}/index.json`, {cache:'no-store'});
    const list = await res.json();
    list.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.file;
      opt.textContent = item.title || item.file;
      select.appendChild(opt);
    });
  } catch (e) {
    console.warn('No prefab index for', type, e);
  }
}

// Fetch prefab HTML
async function fetchPrefabHtml(type, filename){
  if(!filename) return null;
  const url = `${PREFAB_BASE}${encodeURIComponent(type)}/${encodeURIComponent(filename)}`;
  const res = await safeFetch(url, {cache:'no-store'});
  return await res.text();
}

// Read UI settings
function readSettings(){
  return {
    siteType: $('siteType').value,
    title: $('title').value.trim(),
    subtitle: $('subtitle').value.trim(),
    navItems: $('navItems').value.split(',').map(s=>s.trim()).filter(Boolean),
    featuresRaw: $('features').value.trim(),
    rawBody: $('rawBody').value.trim(),
    prefabFile: $('prefabSelect').value
  };
}

// CSS to inject into prefab head
function buildCSS(){
  return `
:root{--space:16px;--radius:8px}
html,body{height:100%;margin:0;font-family:Inter,system-ui,Arial;background:#fff;color:#111}
.container{max-width:1100px;margin:0 auto;padding:calc(var(--space)*1.5)}
.nav{display:flex;justify-content:space-between;align-items:center;padding:calc(var(--space)/2) 0}
.logo{font-weight:700;color:#2563eb}
.cta{background:#2563eb;color:#fff;padding:10px 14px;border-radius:var(--radius);text-decoration:none}
.hero{display:flex;gap:var(--space);align-items:center;padding:calc(var(--space)*2) 0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--space);padding:calc(var(--space)*1.5) 0}
.card{background:#fff;padding:var(--space);border-radius:10px;box-shadow:0 6px 18px rgba(12,20,30,0.06)}
footer{padding:calc(var(--space)*1.5) 0;color:rgba(0,0,0,0.6);font-size:0.95rem}
@media (max-width:800px){.hero{flex-direction:column}}
`;
}

// Replace placeholders and attempt DOM injection
function applyEditableContentToPrefab(htmlString, settings) {
  // 1) placeholder replacement
  let html = htmlString;
  if (settings.title) html = html.replace(/{{\s*title\s*}}/gi, escapeHtml(settings.title));
  if (settings.subtitle) html = html.replace(/{{\s*subtitle\s*}}/gi, escapeHtml(settings.subtitle));
  if (settings.navItems && settings.navItems.length) {
    const navHtml = settings.navItems.map(n => `<a href="#">${escapeHtml(n)}</a>`).join('');
    html = html.replace(/{{\s*nav\s*}}/gi, navHtml);
  }
  if (settings.featuresRaw) {
    const features = settings.featuresRaw.split('\n').map(line => {
      const parts = line.split(' - ');
      const t = escapeHtml(parts[0] ? parts[0].trim() : '');
      const txt = escapeHtml(parts[1] ? parts[1].trim() : '');
      return `<div class="card"><h4>${t}</h4><p>${txt}</p></div>`;
    }).join('');
    html = html.replace(/{{\s*features\s*}}/gi, features);
  }

  // 2) DOM parsing and targeted injection
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // <title>
    if (settings.title) {
      const titleEl = doc.querySelector('title');
      if (titleEl) titleEl.textContent = settings.title;
      else {
        const head = doc.querySelector('head') || doc.createElement('head');
        const t = doc.createElement('title');
        t.textContent = settings.title;
        head.appendChild(t);
        if (!doc.querySelector('head')) doc.documentElement.insertBefore(head, doc.body);
      }
    }

    // first h1 or .hero h1 or header h1
    if (settings.title) {
      let h1 = doc.querySelector('.hero h1') || doc.querySelector('header h1') || doc.querySelector('h1');
      if (h1) h1.textContent = settings.title;
    }

    // subtitle: element with class .subtitle or .tagline or first p under hero
    if (settings.subtitle) {
      let sub = doc.querySelector('.subtitle') || doc.querySelector('.tagline') || doc.querySelector('.hero p') || doc.querySelector('header p');
      if (sub) sub.textContent = settings.subtitle;
    }

    // nav: try to find <nav> and replace anchors
    if (settings.navItems && settings.navItems.length) {
      const nav = doc.querySelector('nav') || doc.querySelector('.nav');
      if (nav) {
        const ul = nav.querySelector('ul');
        if (ul) {
          ul.innerHTML = '';
          settings.navItems.forEach(item => {
            const li = doc.createElement('li');
            const a = doc.createElement('a');
            a.href = '#';
            a.textContent = item;
            li.appendChild(a);
            ul.appendChild(li);
          });
        } else {
          nav.querySelectorAll('a').forEach(a => a.remove());
          settings.navItems.forEach(item => {
            const a = doc.createElement('a');
            a.href = '#';
            a.textContent = item;
            nav.appendChild(a);
          });
        }
      } else {
        const genNav = doc.querySelector('[data-gen="nav"]');
        if (genNav) {
          genNav.innerHTML = settings.navItems.map(n => `<a href="#">${escapeHtml(n)}</a>`).join('');
        }
      }
    }

    // features: find element with data-gen="features" or .features container
    if (settings.featuresRaw) {
      const featuresContainer = doc.querySelector('[data-gen="features"]') || doc.querySelector('.features') || doc.querySelector('.grid') || doc.querySelector('.features-list');
      if (featuresContainer) {
        const features = settings.featuresRaw.split('\n').map(line => {
          const parts = line.split(' - ');
          const t = escapeHtml(parts[0] ? parts[0].trim() : '');
          const txt = escapeHtml(parts[1] ? parts[1].trim() : '');
          return `<div class="card"><h4>${t}</h4><p>${txt}</p></div>`;
        }).join('');
        featuresContainer.innerHTML = features;
      }
    }

    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  } catch (err) {
    console.warn('DOM parse/inject failed, returning original', err);
    return htmlString;
  }
}

// Generated fallback body
function buildGeneratedBody(s){
  const title = s.title || 'Generated Site';
  const subtitle = s.subtitle || 'A short description';
  const navHtml = (s.navItems.length ? s.navItems : ['Home','About','Contact'])
    .map(n=>`<a href="#">${escapeHtml(n)}</a>`).join('');

  const features = s.featuresRaw
    ? s.featuresRaw.split('\n').map(line=>{
        const parts = line.split(' - ');
        return {title: parts[0].trim(), text: (parts[1]||'').trim()};
      })
    : [{title:'Feature One', text:'Short description.'}];

  return `
<div class="container">
  <div class="nav"><div class="logo">Brand</div><div>${navHtml}</div></div>
  <div class="hero">
    <div class="left">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(subtitle)}</p>
    </div>
  </div>
  <div class="grid">
    ${features.map(f=>`
      <div class="card">
        <h4>${escapeHtml(f.title)}</h4>
        <p>${escapeHtml(f.text)}</p>
      </div>`).join('')}
  </div>
  <footer>© ${new Date().getFullYear()} • ${escapeHtml(s.siteType)}</footer>
</div>
`;
}

// Build final HTML (prefab-aware)
async function buildHTMLWithPrefab(){
  const s = readSettings();
  const css = buildCSS();

  if (s.rawBody) {
    return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${css}</style></head><body>${s.rawBody}</body></html>`;
  }

  const prefabFile = s.prefabFile;
  if (prefabFile) {
    try {
      const prefabHtml = await fetchPrefabHtml(s.siteType, prefabFile);
      const injected = applyEditableContentToPrefab(prefabHtml, s);
      if (/<head[\s\S]*?>/i.test(injected)) {
        return injected.replace(/<\/head>/i, `<style>${css}</style></head>`);
      } else {
        return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${css}</style></head><body>${injected}</body></html>`;
      }
    } catch (e) {
      console.warn('Prefab load/inject failed, falling back to generated body', e);
    }
  }

  const body = buildGeneratedBody(s);
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${css}</style></head><body>${body}</body></html>`;
}

// Update preview
async function updatePreview(){
  const iframe = $('preview');
  try {
    const html = await buildHTMLWithPrefab();
    iframe.srcdoc = html;
    iframe.dataset.generated = html;
  } catch (err) {
    console.error('updatePreview error', err);
  }
}

// Randomize: picks random prefab and populates editable fields
async function randomizeForType(){
  const type = $('siteType').value;
  const titles = ['Your Business Name','Quality Services','We Deliver Results','Creative Studio'];
  const subs = ['We help customers succeed','Solutions that scale','Design and build','Trusted by many'];
  $('title').value = rand(titles);
  $('subtitle').value = rand(subs);
  $('navItems').value = 'Home,About,Services,Contact';
  $('features').value = 'Feature A - Short description\nFeature B - Short description\nFeature C - Short description';
  $('rawBody').value = '';

  await loadPrefabsForType(type);
  const select = $('prefabSelect');
  const options = Array.from(select.options).slice(1);
  if (options.length) {
    const chosen = rand(options);
    select.value = chosen.value;
  } else {
    select.value = '';
  }

  await updatePreview();
}

// Copy generated HTML
$('copyBtn').addEventListener('click', async () => {
  const html = $('preview').dataset.generated || await buildHTMLWithPrefab();
  try {
    await navigator.clipboard.writeText(html);
    const old = $('copyBtn').textContent;
    $('copyBtn').textContent = 'Copied!';
    setTimeout(()=> $('copyBtn').textContent = old, 1400);
  } catch (e) {
    alert('Copy failed. You can select and copy manually.');
  }
});

// Events
$('siteType').addEventListener('change', async () => {
  await loadPrefabsForType($('siteType').value);
  randomizeForType();
});
$('refreshPrefabsBtn').addEventListener('click', () => loadPrefabsForType($('siteType').value));
$('prefabSelect').addEventListener('change', updatePreview);
$('updateBtn').addEventListener('click', updatePreview);
$('randomBtn').addEventListener('click', randomizeForType);

// Live update on input (debounced)
document.querySelectorAll('#controls input, #controls textarea, #controls select').forEach(el=>{
  el.addEventListener('input', () => {
    if (window._debounce) clearTimeout(window._debounce);
    window._debounce = setTimeout(updatePreview, 220);
  });
});

// Init
window.addEventListener('DOMContentLoaded', async () => {
  await loadPrefabsForType($('siteType').value);
  await randomizeForType();
});
