// script.js
// Website generator with ZIP export, hero image upload, multi-page generation,
// theme presets, drag-and-drop ordering, and custom CSS. AI features removed.

const siteTypeDescriptions = {
  business: "Serve as a digital storefront to showcase products, services, and company information.",
  ecommerce: "Allow online sales of products or services with product pages and checkout.",
  portfolio: "Highlight creative work to attract clients and showcase projects.",
  blog: "Focus on regularly updated content and articles to build authority.",
  informational: "Provide knowledge or resources on specific topics or guides.",
  community: "Facilitate interaction among users, forums, or membership features.",
  landing: "Single-page marketing pages for campaigns and lead generation.",
  nonprofit: "Promote causes, accept donations, and engage supporters.",
  educational: "Offer courses, tutorials, or learning resources.",
  entertainment: "Streaming, gaming, or media portals for engagement."
};

const templates = {
  business: { headings:["Trusted Business Solutions","Grow your business with confidence","Professional services that deliver"], subheads:["Showcase services, case studies, and contact info to convert visitors into customers."], nav:["Home","Services","Case Studies","Contact"], features:[{title:"Expert Team",text:"Experienced professionals delivering results."},{title:"Trusted Partners",text:"We work with leading brands."},{title:"Consultation",text:"Free initial consultation to scope your needs."}], cta:["Get a Quote","Contact Sales"] },
  ecommerce: { headings:["Shop the Latest","Quality products, fast shipping","Your online store"], subheads:["Product pages, carts, and secure checkout to sell online."], nav:["Home","Shop","Collections","Cart"], features:[{title:"Secure Checkout",text:"Payments protected with industry standards."},{title:"Fast Shipping",text:"Reliable delivery across regions."},{title:"Easy Returns",text:"Hassle-free returns and exchanges."}], cta:["Shop Now","View Collection"] },
  portfolio: { headings:["Showcase Your Work","Designs that tell a story","Portfolio of creative projects"], subheads:["Highlight projects, case studies, and client testimonials."], nav:["Home","Work","About","Contact"], features:[{title:"Selected Projects",text:"Curated work that demonstrates skill."},{title:"Client Testimonials",text:"What clients say about collaborating."},{title:"Contact",text:"Hire me for your next project."}], cta:["View Portfolio","Hire Me"] },
  blog: { headings:["Insights and Stories","Thoughtful articles and guides","Read our latest posts"], subheads:["Regularly updated content to build an audience and authority."], nav:["Home","Articles","Topics","Subscribe"], features:[{title:"Latest Posts",text:"Fresh content published weekly."},{title:"Categories",text:"Organized topics for easy browsing."},{title:"Subscribe",text:"Get new posts delivered to your inbox."}], cta:["Read More","Subscribe"] },
  informational: { headings:["Learn More","Guides and resources","Trusted information hub"], subheads:["Educational resources, how-tos, and reference material."], nav:["Home","Guides","Resources","About"], features:[{title:"Comprehensive Guides",text:"Step-by-step tutorials and references."},{title:"Expert Contributors",text:"Content from subject matter experts."},{title:"Searchable Library",text:"Find answers quickly."}], cta:["Explore Guides","Start Learning"] },
  community: { headings:["Join the Community","Connect and collaborate","Members sharing knowledge"], subheads:["Forums, groups, and membership features to engage users."], nav:["Home","Forum","Members","Join"], features:[{title:"Active Forums",text:"Discussions across many topics."},{title:"Member Profiles",text:"Showcase contributions and expertise."},{title:"Events",text:"Online and offline meetups."}], cta:["Join Now","Create Account"] },
  landing: { headings:["Launch Faster","One page to convert","Campaign landing page"], subheads:["Focused messaging and a single CTA for conversions."], nav:["Home","Features","Pricing","Contact"], features:[{title:"Clear Value",text:"Communicate benefits in seconds."},{title:"Strong CTA",text:"Drive signups or leads."},{title:"A/B Ready",text:"Test variations to improve results."}], cta:["Get Started","Sign Up"] },
  nonprofit: { headings:["Make an Impact","Support our cause","Join our mission"], subheads:["Promote causes, accept donations, and engage supporters."], nav:["Home","About","Programs","Donate"], features:[{title:"Our Mission",text:"What we stand for and why it matters."},{title:"Programs",text:"How donations are used."},{title:"Volunteer",text:"Ways to get involved."}], cta:["Donate Now","Support Us"] },
  educational: { headings:["Learn New Skills","Courses and tutorials","Education for everyone"], subheads:["Courses, lessons, and interactive resources for learners."], nav:["Home","Courses","Instructors","Enroll"], features:[{title:"Structured Courses",text:"Curriculum designed by experts."},{title:"Certificates",text:"Earn recognition for completion."},{title:"Community",text:"Study groups and mentors."}], cta:["Browse Courses","Enroll"] },
  entertainment: { headings:["Stream and Play","Entertainment for everyone","Watch, listen, play"], subheads:["Media portals, streaming, and interactive experiences."], nav:["Home","Shows","Games","Subscribe"], features:[{title:"New Releases",text:"Latest shows and content."},{title:"Exclusive",text:"Members-only content and perks."},{title:"Play Anywhere",text:"Cross-device streaming."}], cta:["Watch Now","Subscribe"] }
};

// Helpers
function $(id){ return document.getElementById(id); }
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function escapeHtml(str){ return String(str||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }

// ---------- State for pages, features, hero image ----------
let state = {
  pages: [{slug:'index', title:'Home', type: 'home'}],
  features: [], // array of {title,text}
  heroImageDataUrl: '', // base64
};

// ---------- UI helpers for dynamic lists (pages & features) ----------
function renderPages(){
  const container = $('pagesList');
  container.innerHTML = '';
  state.pages.forEach((p, idx) => {
    const el = document.createElement('div');
    el.className = 'page-row';
    el.innerHTML = `<input class="page-title" data-idx="${idx}" value="${escapeHtml(p.title)}" /><select class="page-type" data-idx="${idx}">
      <option value="home">Home</option><option value="content">Content</option><option value="contact">Contact</option>
    </select>`;
    el.querySelector('.page-type').value = p.type || 'content';
    container.appendChild(el);
  });
  // wire events
  container.querySelectorAll('.page-title').forEach(inp=>{
    inp.addEventListener('input', e=>{
      const i = +e.target.dataset.idx;
      state.pages[i].title = e.target.value;
    });
  });
  container.querySelectorAll('.page-type').forEach(sel=>{
    sel.addEventListener('change', e=>{
      const i = +e.target.dataset.idx;
      state.pages[i].type = e.target.value;
    });
  });
}

function renderFeatures(){
  const container = $('featuresList');
  container.innerHTML = '';
  state.features.forEach((f, idx) => {
    const row = document.createElement('div');
    row.className = 'feature-row';
    row.draggable = true;
    row.dataset.idx = idx;
    row.innerHTML = `
      <div class="drag-handle">☰</div>
      <input class="feature-title" data-idx="${idx}" value="${escapeHtml(f.title)}" placeholder="Title" />
      <input class="feature-text" data-idx="${idx}" value="${escapeHtml(f.text)}" placeholder="Short description" />
      <button class="btn small remove-feature" data-idx="${idx}">Remove</button>
    `;
    container.appendChild(row);
  });

  // events: input updates
  container.querySelectorAll('.feature-title').forEach(inp=>{
    inp.addEventListener('input', e=>{
      const i = +e.target.dataset.idx;
      state.features[i].title = e.target.value;
    });
  });
  container.querySelectorAll('.feature-text').forEach(inp=>{
    inp.addEventListener('input', e=>{
      const i = +e.target.dataset.idx;
      state.features[i].text = e.target.value;
    });
  });
  container.querySelectorAll('.remove-feature').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const i = +e.target.dataset.idx;
      state.features.splice(i,1);
      renderFeatures();
      schedulePreviewUpdate();
    });
  });

  // drag & drop reordering
  let dragSrc = null;
  container.querySelectorAll('.feature-row').forEach(row=>{
    row.addEventListener('dragstart', e=>{
      dragSrc = +row.dataset.idx;
      row.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    row.addEventListener('dragend', e=>{
      row.classList.remove('dragging');
      dragSrc = null;
    });
    row.addEventListener('dragover', e=>{
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const over = +row.dataset.idx;
      if(dragSrc === null || dragSrc === over) return;
      const item = state.features.splice(dragSrc,1)[0];
      state.features.splice(over,0,item);
      renderFeatures();
      schedulePreviewUpdate();
    });
  });
}

// ---------- Read UI settings ----------
function readSettings(){
  return {
    siteType: $('siteType').value,
    primary: $('primary').value,
    bg: $('bg').value,
    text: $('text').value,
    font: $('font').value,
    fontSize: parseInt($('fontSize').value,10) || 16,
    title: $('title').value.trim(),
    subtitle: $('subtitle').value.trim(),
    navItems: $('navItems').value.split(',').map(s=>s.trim()).filter(Boolean),
    ctaText: $('ctaText').value.trim() || 'Get Started',
    rawBody: $('rawBody').value.trim(),
    customCss: $('customCss').value || '',
    pages: state.pages.slice(),
    heroImageDataUrl: state.heroImageDataUrl || ''
  };
}

// ---------- CSS builder ----------
function buildCSS(s){
  return `
:root{
  --primary:${s.primary};
  --bg:${s.bg};
  --text:${s.text};
  --font:${s.font};
  --base-size:${s.fontSize}px;
  --space:16px;
  --radius:8px;
}
html,body{height:100%;margin:0;background:var(--bg);font-family:var(--font);font-size:var(--base-size);color:var(--text);-webkit-font-smoothing:antialiased}
.container{max-width:1100px;margin:0 auto;padding:calc(var(--space) * 1.5)}
.nav{display:flex;justify-content:space-between;align-items:center;padding:calc(var(--space)/2) 0}
.logo{font-weight:700;color:var(--primary);font-size:1.05rem}
.nav a{margin-left:14px;color:var(--text);text-decoration:none}
.cta{background:var(--primary);color:#fff;padding:10px 14px;border-radius:var(--radius);text-decoration:none}
.hero{display:flex;gap:var(--space);align-items:center;padding:calc(var(--space) * 2) 0}
.hero .left{flex:1}
.hero h1{font-size:2.2rem;margin:0 0 calc(var(--space)/2) 0;color:var(--text)}
.hero p{margin:0 0 var(--space) 0;color:rgba(0,0,0,0.65)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--space);padding:calc(var(--space) * 1.5) 0}
.card{background:#fff;padding:var(--space);border-radius:10px;box-shadow:0 6px 18px rgba(12,20,30,0.06)}
footer{padding:calc(var(--space) * 1.5) 0;color:rgba(0,0,0,0.6);font-size:0.95rem}
.hero img{max-width:100%;border-radius:10px;display:block}
@media (max-width:800px){ .hero{flex-direction:column;align-items:flex-start} .grid{grid-template-columns:1fr} }
${s.customCss || ''}
`;
}

// ---------- Build body for a single page ----------
function buildBodyForPage(settings, page){
  if(settings.rawBody) return settings.rawBody;

  const type = settings.siteType;
  const tpl = templates[type] || templates.business;

  const title = page.title || settings.title || rand(tpl.headings);
  const subtitle = settings.subtitle || rand(tpl.subheads);
  const nav = (settings.navItems.length ? settings.navItems : tpl.nav).slice(0,6);
  const cta = settings.ctaText || rand(tpl.cta);

  const features = state.features.length ? state.features : tpl.features.slice(0,3);

  const navHtml = nav.map(n => `<a href="#">${escapeHtml(n)}</a>`).join('');

  // hero image
  const heroImgHtml = settings.heroImageDataUrl ? `<img src="${settings.heroImageDataUrl}" alt="Hero image" />` : '';

  if(page.type === 'contact'){
    return `
<div class="container">
  <div class="nav"><div class="logo">Brand</div><div>${navHtml}<a class="cta" href="#" style="margin-left:14px">${escapeHtml(cta)}</a></div></div>
  <div style="padding:calc(var(--space) * 1.5) 0">
    <h1 style="margin:0 0 var(--space) 0">${escapeHtml(title)}</h1>
    <p style="margin:0 0 var(--space) 0;color:rgba(0,0,0,0.65)">${escapeHtml(subtitle)}</p>
    <div class="card">
      <h3>Contact Us</h3>
      <form>
        <label>Name</label><input style="width:100%;padding:8px;margin:6px 0;border-radius:6px;border:1px solid #e6e9ee" />
        <label>Email</label><input style="width:100%;padding:8px;margin:6px 0;border-radius:6px;border:1px solid #e6e9ee" />
        <label>Message</label><textarea style="width:100%;padding:8px;margin:6px 0;border-radius:6px;border:1px solid #e6e9ee"></textarea>
        <button class="cta" type="button">Send</button>
      </form>
    </div>
  </div>
  <footer>© ${new Date().getFullYear()} • ${escapeHtml(page.title || 'Contact')}</footer>
</div>`;
  }

  return `
<div class="container">
  <div class="nav"><div class="logo">Brand</div><div>${navHtml}<a class="cta" href="#" style="margin-left:14px">${escapeHtml(cta)}</a></div></div>
  <div class="hero">
    <div class="left">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(subtitle)}</p>
      <a class="cta" href="#">${escapeHtml(cta)}</a>
    </div>
    <div class="card" style="min-width:260px;">
      ${heroImgHtml}
      <h3 style="margin-top:12px">${escapeHtml(features[0]?.title || 'Quick Info')}</h3>
      <p style="margin:0;color:rgba(0,0,0,0.65)">${escapeHtml(features[0]?.text || '')}</p>
    </div>
  </div>
  <div class="grid" style="margin-top:var(--space)">
    ${features.map(f=>`<div class="card"><h4 style="margin:0 0 8px 0">${escapeHtml(f.title)}</h4><p style="margin:0;color:rgba(0,0,0,0.65)">${escapeHtml(f.text)}</p></div>`).join('')}
  </div>
  <footer>© ${new Date().getFullYear()} • ${escapeHtml(page.title || 'Page')}</footer>
</div>`;
}

// ---------- Build full HTML document for a page ----------
function buildHTMLForPage(settings, page){
  const css = buildCSS(settings);
  const body = buildBodyForPage(settings, page);
  const title = page.title || settings.title || (templates[settings.siteType] ? templates[settings.siteType].headings[0] : 'Generated Site');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>${css}</style>
</head>
<body>
${body}
</body>
</html>`;
}

// ---------- Preview update ----------
function updatePreview(){
  const s = readSettings();
  const html = buildHTMLForPage(s, s.pages[0] || {slug:'index', title:'Home', type:'home'});
  const iframe = $('preview');
  iframe.srcdoc = html;
  iframe.dataset.generated = html;
}

// ---------- Copy HTML ----------
async function copyHTML(){
  const iframe = $('preview');
  const html = iframe.dataset.generated || buildHTMLForPage(readSettings(), state.pages[0]);
  try{
    await navigator.clipboard.writeText(html);
    const btn = $('copyBtn');
    const old = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(()=> btn.textContent = old, 1400);
  }catch(e){
    alert('Copy failed. You can select and copy manually.');
  }
}

// ---------- Export ZIP (multiple pages + styles) ----------
async function exportZip(){
  const s = readSettings();
  const zip = new JSZip();
  const cssContent = buildCSS(s);
  zip.file('styles.css', cssContent);

  s.pages.forEach(page=>{
    const html = buildHTMLForPage(s, page);
    const filename = (page.slug || page.title || 'page').toString().toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'') || 'page';
    zip.file(`${filename}.html`, html);
  });

  const blob = await zip.generateAsync({type:'blob'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(s.title||'site').toLowerCase().replace(/\s+/g,'-') || 'site'}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---------- Randomize content (updated) ----------
function randomizeContent(){
  const type = $('siteType').value;
  const tpl = templates[type] || templates.business;

  $('title').value = rand(tpl.headings);
  $('subtitle').value = rand(tpl.subheads);
  $('navItems').value = tpl.nav.join(',');
  $('ctaText').value = rand(tpl.cta);

  const features = tpl.features.slice().sort(()=>0.5-Math.random()).slice(0, randInt(3,6));
  state.features = features.map(f=>({title:f.title, text:f.text}));
  renderFeatures();

  const palettes = [
    {primary:"#2563eb", bg:"#ffffff", text:"#0b1220"},
    {primary:"#0ea5a4", bg:"#ffffff", text:"#0b1220"},
    {primary:"#ef4444", bg:"#fffaf0", text:"#0b1220"},
    {primary:"#7c3aed", bg:"#ffffff", text:"#0b1220"},
    {primary:"#0f172a", bg:"#f8fafc", text:"#0b1220"}
  ];
  const p = rand(palettes);
  $('primary').value = p.primary;
  $('bg').value = p.bg;
  $('text').value = p.text;

  const fonts = [
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
    "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto",
    "'Merriweather', serif"
  ];
  $('font').value = rand(fonts);
  $('fontSize').value = randInt(14,18);

  state.pages = [{slug:'index', title: $('title').value || 'Home', type:'home'}];
  renderPages();

  state.heroImageDataUrl = '';
  $('rawBody').value = '';
  $('customCss').value = '';

  updatePreview();
}

// ---------- Hero image handling ----------
function handleHeroImageFile(file){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e=>{
    state.heroImageDataUrl = e.target.result;
    schedulePreviewUpdate();
  };
  reader.readAsDataURL(file);
}

// ---------- Pages management ----------
function addPage(){
  const idx = state.pages.length + 1;
  state.pages.push({slug:`page-${idx}`, title:`Page ${idx}`, type:'content'});
  renderPages();
  schedulePreviewUpdate();
}
function removeLastPage(){
  if(state.pages.length > 1) state.pages.pop();
  renderPages();
  schedulePreviewUpdate();
}

// ---------- Theme preset handling ----------
function applyThemePreset(jsonStr){
  if(!jsonStr) return;
  try{
    const p = JSON.parse(jsonStr);
    if(p.primary) $('primary').value = p.primary;
    if(p.bg) $('bg').value = p.bg;
    if(p.text) $('text').value = p.text;
    schedulePreviewUpdate();
  }catch(e){}
}

// ---------- Debounce preview updates ----------
let _debounceTimer = null;
function schedulePreviewUpdate(){
  if(_debounceTimer) clearTimeout(_debounceTimer);
  _debounceTimer = setTimeout(updatePreview, 220);
}

// ---------- Wire events ----------
document.addEventListener('DOMContentLoaded', ()=>{
  renderPages();
  renderFeatures();

  $('updateBtn').addEventListener('click', updatePreview);
  $('randomBtn').addEventListener('click', randomizeContent);
  $('copyBtn').addEventListener('click', copyHTML);
  $('exportZipBtn').addEventListener('click', exportZip);

  $('addPageBtn').addEventListener('click', addPage);
  $('removePageBtn').addEventListener('click', removeLastPage);

  $('addFeatureBtn').addEventListener('click', ()=>{
    state.features.push({title:'New Feature', text:'Short description'});
    renderFeatures();
    schedulePreviewUpdate();
  });
  $('clearFeaturesBtn').addEventListener('click', ()=>{
    state.features = [];
    renderFeatures();
    schedulePreviewUpdate();
  });

  $('heroImage').addEventListener('change', e=>{
    const f = e.target.files && e.target.files[0];
    handleHeroImageFile(f);
  });

  $('themePreset').addEventListener('change', e=>{
    applyThemePreset(e.target.value);
  });

  // live update when editing fields
  document.querySelectorAll('#controls input[type="text"], #controls input[type="color"], #controls input[type="number"], #controls textarea, #controls select').forEach(el=>{
    el.addEventListener('input', schedulePreviewUpdate);
  });

  // initialize
  randomizeContent();
});
