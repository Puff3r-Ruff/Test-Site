const PREFAB_BASE = '/prefabs';
const $ = id => document.getElementById(id);

async function loadPrefabsForType(type){
  const select = $('prefabSelect');
  select.innerHTML = '<option value="">— Use generated layout —</option>';

  try {
    const res = await fetch(`${PREFAB_BASE}/${type}/index.json`, {cache:'no-store'});
    if(!res.ok) throw new Error('no index');

    const list = await res.json();
    list.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.file;
      opt.textContent = item.title || item.file;
      select.appendChild(opt);
    });
  } catch (e) {
    console.warn('No prefab index found for', type);
  }
}

async function fetchPrefabHtml(type, filename){
  if(!filename) return null;
  const url = `${PREFAB_BASE}/${type}/${filename}`;
  const res = await fetch(url, {cache:'no-store'});
  if(!res.ok) throw new Error('prefab fetch failed');
  return await res.text();
}

function readSettings(){
  return {
    siteType: $('siteType').value,
    title: $('title').value.trim(),
    subtitle: $('subtitle').value.trim(),
    navItems: $('navItems').value.split(',').map(s=>s.trim()).filter(Boolean),
    featuresRaw: $('features').value.trim(),
    rawBody: $('rawBody').value.trim()
  };
}

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

function escapeHtml(str){
  return String(str||'').replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[m]);
}

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

async function buildHTMLWithPrefab(){
  const s = readSettings();
  const css = buildCSS();

  if(s.rawBody){
    return `<!doctype html><html><head><style>${css}</style></head><body>${s.rawBody}</body></html>`;
  }

  const prefabFile = $('prefabSelect').value;
  if(prefabFile){
    try {
      const prefabHtml = await fetchPrefabHtml(s.siteType, prefabFile);
      if(/<head[\s\S]*?>/i.test(prefabHtml)){
        return prefabHtml.replace(/<\/head>/i, `<style>${css}</style></head>`);
      }
      return `<!doctype html><html><head><style>${css}</style></head><body>${prefabHtml}</body></html>`;
    } catch (e) {
      console.warn('Prefab failed, using generated layout');
    }
  }

  const body = buildGeneratedBody(s);
  return `<!doctype html><html><head><style>${css}</style></head><body>${body}</body></html>`;
}

async function updatePreview(){
  const iframe = $('preview');
  const html = await buildHTMLWithPrefab();
  iframe.srcdoc = html;
  iframe.dataset.generated = html;
}

async function randomizeForType(){
  const titles = ['Your Business Name','Quality Services','We Deliver Results'];
  const subs = ['We help customers succeed','Solutions that scale','Trusted by many'];

  $('title').value = titles[Math.floor(Math.random()*titles.length)];
  $('subtitle').value = subs[Math.floor(Math.random()*subs.length)];
  $('navItems').value = 'Home,About,Services,Contact';
  $('features').value = 'Feature A - Description\nFeature B - Description';

  await loadPrefabsForType($('siteType').value);
  updatePreview();
}

$('siteType').addEventListener('change', async () => {
  await loadPrefabsForType($('siteType').value);
  randomizeForType();
});

$('refreshPrefabsBtn').addEventListener('click', () =>
  loadPrefabsForType($('siteType').value)
);

$('prefabSelect').addEventListener('change', updatePreview);
$('updateBtn').addEventListener('click', updatePreview);
$('randomBtn').addEventListener('click', randomizeForType);

$('copyBtn').addEventListener('click', async () => {
  const html = $('preview').dataset.generated;
  await navigator.clipboard.writeText(html);
  alert('Copied HTML to clipboard');
});

window.addEventListener('DOMContentLoaded', async () => {
  await loadPrefabsForType($('siteType').value);
  randomizeForType();
});
