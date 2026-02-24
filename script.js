// script.js
// Attach to index.html. Generates preview HTML and can randomize a full site.

const defaultData = {
  headings: [
    "Build something beautiful",
    "Design faster with a generator",
    "Launch your next idea",
    "Crafted for creators",
    "Simple, fast, delightful"
  ],
  subheads: [
    "A tiny generator that produces a full page using your palette and layout.",
    "Auto-generated landing pages for prototypes and demos.",
    "Clean components, responsive layout, and accessible defaults.",
    "Mix and match palettes, spacing, and typography.",
    "Instant preview and copy-ready HTML."
  ],
  navItems: [
    ["Home","Products","Pricing","Contact"],
    ["Overview","Features","Docs","Sign In"],
    ["Work","Services","About","Get Started"]
  ],
  features: [
    {title:"Fast setup", text:"Get a working page in seconds."},
    {title:"Responsive", text:"Looks great on phones and desktops."},
    {title:"Customizable", text:"Change colors, spacing, and fonts."},
    {title:"Copy-ready", text:"Copy the generated HTML and use it."}
  ],
  ctas: ["Get Started","Try Demo","Join Now","Learn More"]
};

// Utility: pick random item
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

// Read controls
function getSettings(){
  const primary = document.getElementById('primary').value;
  const secondary = document.getElementById('secondary').value;
  const accent = document.getElementById('accent').value;
  const bg = document.getElementById('bg').value;
  const text = document.getElementById('text').value;
  const font = document.getElementById('font').value;
  const fontSize = parseInt(document.getElementById('fontSize').value,10) || 16;
  const btnRadius = parseInt(document.getElementById('btnRadius')?.value || 8,10) || 8;
  const spacing = parseInt(document.getElementById('spacing')?.value || 16,10) || 16;
  const layout = document.querySelector('input[name="layout"]:checked').value;
  return { primary, secondary, accent, bg, text, font, fontSize, btnRadius, spacing, layout };
}

// Build CSS for generated page
function buildCSS(s){
  return `
:root{
  --primary:${s.primary};
  --secondary:${s.secondary};
  --accent:${s.accent};
  --bg:${s.bg};
  --text:${s.text};
  --radius:${s.btnRadius}px;
  --space:${s.spacing}px;
  --font:${s.font};
  --base-size:${s.fontSize}px;
}
html,body{height:100%;margin:0;background:var(--bg);font-family:var(--font);font-size:var(--base-size);color:var(--text);-webkit-font-smoothing:antialiased}
.container{max-width:1100px;margin:0 auto;padding:calc(var(--space) * 1.5)}
.nav{display:flex;justify-content:space-between;align-items:center;padding:calc(var(--space)/2) 0}
.logo{font-weight:700;color:var(--primary);font-size:1.05rem}
.cta{background:var(--primary);color:#fff;padding:10px 14px;border-radius:var(--radius);text-decoration:none}
.hero{display:flex;gap:var(--space);align-items:center;padding:calc(var(--space) * 2) 0}
.hero .left{flex:1}
.hero h1{font-size:2.2rem;margin:0 0 calc(var(--space)/2) 0;color:var(--text)}
.hero p{margin:0 0 var(--space) 0;color:rgba(0,0,0,0.65)}
.card{background:#fff;padding:var(--space);border-radius:10px;box-shadow:0 6px 18px rgba(12,20,30,0.06)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:var(--space);align-items:start;padding:calc(var(--space) * 1.5) 0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--space);padding:calc(var(--space) * 1.5) 0}
.feature{background:#fff;padding:var(--space);border-radius:10px;box-shadow:0 6px 18px rgba(12,20,30,0.04)}
.btn{display:inline-block;padding:10px 14px;border-radius:var(--radius);background:var(--accent);color:#fff;text-decoration:none}
footer{padding:calc(var(--space) * 1.5) 0;color:rgba(0,0,0,0.6);font-size:0.95rem}
@media (max-width:800px){ .two{grid-template-columns:1fr} .hero{flex-direction:column;align-items:flex-start} }
`;
}

// Build HTML body for chosen layout and content
function buildBody(s, content){
  const navLinks = content.nav.map(n => `<a href="#" style="margin-left:14px;color:var(--text);text-decoration:none">${n}</a>`).join('');
  const cta = rand(content.ctas);
  if(s.layout === 'hero'){
    return `
<div class="container">
  <div class="nav"><div class="logo">Brand</div><div>${navLinks}<a class="cta" href="#" style="margin-left:14px">${cta}</a></div></div>
  <div class="hero">
    <div class="left">
      <h1>${content.heading}</h1>
      <p>${content.subhead}</p>
      <a class="btn" href="#">${rand(content.ctas)}</a>
    </div>
    <div class="card" style="min-width:260px;">
      <svg width="100%" height="160" viewBox="0 0 600 320" preserveAspectRatio="none" style="border-radius:8px;display:block;margin-bottom:12px">
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0" stop-color="${s.primary}"/>
            <stop offset="1" stop-color="${s.accent}"/>
          </linearGradient>
        </defs>
        <rect width="600" height="320" fill="url(#g)"></rect>
      </svg>
      <h3 style="margin-top:0">${content.cardTitle}</h3>
      <p style="margin:0;color:rgba(0,0,0,0.6)">${content.cardText}</p>
    </div>
  </div>
  <div class="grid" style="margin-top:var(--space)">
    ${content.features.map(f => `<div class="feature"><h4 style="margin:0 0 8px 0">${f.title}</h4><p style="margin:0;color:rgba(0,0,0,0.65)">${f.text}</p></div>`).join('')}
  </div>
  <footer>© ${new Date().getFullYear()} Generated site • Hero layout</footer>
</div>
`;
  } else if(s.layout === 'two'){
    return `
<div class="container">
  <div class="nav"><div class="logo">Brand</div><div>${navLinks}<a class="cta" href="#" style="margin-left:14px">${cta}</a></div></div>
  <div class="two">
    <div>
      <h2>${content.heading}</h2>
      <p>${content.subhead}</p>
      <div class="card" style="margin-top:var(--space)"><h3 style="margin-top:0">${content.cardTitle}</h3><p style="margin:0;color:rgba(0,0,0,0.65)">${content.cardText}</p></div>
    </div>
    <div>
      <h2>Highlights</h2>
      <p>Quick actions and signup.</p>
      <div class="card" style="margin-top:var(--space)"><h3 style="margin-top:0">Signup</h3><p style="margin:0;color:rgba(0,0,0,0.65)">Join our newsletter.</p></div>
    </div>
  </div>
  <div class="grid" style="margin-top:var(--space)">
    ${content.features.map(f => `<div class="feature"><h4 style="margin:0 0 8px 0">${f.title}</h4><p style="margin:0;color:rgba(0,0,0,0.65)">${f.text}</p></div>`).join('')}
  </div>
  <footer>© ${new Date().getFullYear()} Generated site • Two column layout</footer>
</div>
`;
  } else { // grid
    return `
<div class="container">
  <div class="nav"><div class="logo">Brand</div><div>${navLinks}<a class="cta" href="#" style="margin-left:14px">${cta}</a></div></div>
  <div style="padding:calc(var(--space) * 1.5) 0">
    <h1 style="margin:0 0 var(--space) 0">${content.heading}</h1>
    <p style="margin:0 0 var(--space) 0;color:rgba(0,0,0,0.65)">${content.subhead}</p>
  </div>
  <div class="grid">
    ${content.features.map(f => `<div class="feature"><h4 style="margin:0 0 8px 0">${f.title}</h4><p style="margin:0;color:rgba(0,0,0,0.65)">${f.text}</p></div>`).join('')}
  </div>
  <footer>© ${new Date().getFullYear()} Generated site • Grid layout</footer>
</div>
`;
  }
}

// Build full HTML document string
function buildHTML(settings, content){
  const css = buildCSS(settings);
  const body = buildBody(settings, content);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(content.heading)}</title>
<style>${css}</style>
</head>
<body>
${body}
</body>
</html>`;
}

// Escape helper
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
}

// Update preview iframe
function updatePreview(){
  const settings = getSettings();
  const content = window._lastContent || generateRandomContent();
  const html = buildHTML(settings, content);
  const iframe = document.getElementById('preview');
  iframe.srcdoc = html;
  iframe.dataset.generated = html;
}

// Copy generated HTML to clipboard
async function copyHTML(){
  const iframe = document.getElementById('preview');
  const html = iframe.dataset.generated || buildHTML(getSettings(), generateRandomContent());
  try{
    await navigator.clipboard.writeText(html);
    const btn = document.getElementById('copyBtn');
    const old = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(()=> btn.textContent = old, 1400);
  }catch(e){
    alert('Copy failed. Select the preview and copy manually.');
  }
}

// Generate a full random site content object
function generateRandomContent(){
  const heading = rand(defaultData.headings);
  const subhead = rand(defaultData.subheads);
  const nav = rand(defaultData.navItems);
  // shuffle features and pick 3-6
  const shuffled = defaultData.features.slice().sort(()=>0.5-Math.random());
  const features = shuffled.slice(0, randInt(3,6)).map(f => ({title:f.title, text:f.text}));
  const cardTitle = ["Quick Info","About","Why it works","Overview"][randInt(0,3)];
  const cardText = ["Use the controls to tweak colors, spacing and typography.","A small generator for prototypes.","Designed to be copied and extended."][randInt(0,2)];
  const content = {
    heading,
    subhead,
    nav,
    features,
    cardTitle,
    cardText,
    ctas: defaultData.ctas
  };
  window._lastContent = content;
  return content;
}

// Randomize full site: random palette, layout, font, spacing, and content
function randomizeFullSite(){
  // random palette generator (pleasant palettes)
  const palettes = [
    {primary:"#0ea5a4", secondary:"#7c3aed", accent:"#ef4444", bg:"#ffffff", text:"#0f172a"},
    {primary:"#ef4444", secondary:"#f97316", accent:"#06b6d4", bg:"#fffaf0", text:"#0b1220"},
    {primary:"#0ea5a4", secondary:"#06b6d4", accent:"#7c3aed", bg:"#f8fafc", text:"#0b1220"},
    {primary:"#111827", secondary:"#6b7280", accent:"#f59e0b", bg:"#ffffff", text:"#0b1220"},
    {primary:"#2563eb", secondary:"#10b981", accent:"#f43f5e", bg:"#ffffff", text:"#0b1220"}
  ];
  const p = rand(palettes);
  document.getElementById('primary').value = p.primary;
  document.getElementById('secondary').value = p.secondary;
  document.getElementById('accent').value = p.accent;
  document.getElementById('bg').value = p.bg;
  document.getElementById('text').value = p.text;

  // random font
  const fonts = [
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto",
    "'Merriweather', serif",
    "'Courier New', monospace"
  ];
  document.getElementById('font').value = rand(fonts);

  // random sizes
  document.getElementById('fontSize').value = randInt(14,20);
  document.getElementById('btnRadius').value = randInt(0,20);
  document.getElementById('spacing').value = randInt(10,28);

  // random layout
  const layouts = ["hero","two","grid"];
  const chosen = rand(layouts);
  document.querySelectorAll('input[name="layout"]').forEach(r => r.checked = (r.value === chosen));

  // generate content and update preview
  generateRandomContent();
  updatePreview();
}

// Wire up events
document.getElementById('updateBtn').addEventListener('click', updatePreview);
document.getElementById('randomBtn').addEventListener('click', randomizeFullSite);
document.getElementById('copyBtn').addEventListener('click', copyHTML);

// Live update on control changes
document.querySelectorAll('#controls input, #controls select').forEach(i => i.addEventListener('input', updatePreview));

// Initial render
generateRandomContent();
updatePreview();
