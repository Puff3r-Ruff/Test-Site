// script.js
// Website generator with manual editing and type-based random content

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
  business: {
    headings: ["Trusted Business Solutions", "Grow your business with confidence", "Professional services that deliver"],
    subheads: ["Showcase services, case studies, and contact info to convert visitors into customers."],
    nav: ["Home","Services","Case Studies","Contact"],
    features: [
      {title:"Expert Team", text:"Experienced professionals delivering results."},
      {title:"Trusted Partners", text:"We work with leading brands."},
      {title:"Consultation", text:"Free initial consultation to scope your needs."}
    ],
    cta: ["Get a Quote","Contact Sales"]
  },
  ecommerce: {
    headings: ["Shop the Latest", "Quality products, fast shipping", "Your online store"],
    subheads: ["Product pages, carts, and secure checkout to sell online."],
    nav: ["Home","Shop","Collections","Cart"],
    features: [
      {title:"Secure Checkout", text:"Payments protected with industry standards."},
      {title:"Fast Shipping", text:"Reliable delivery across regions."},
      {title:"Easy Returns", text:"Hassle-free returns and exchanges."}
    ],
    cta: ["Shop Now","View Collection"]
  },
  portfolio: {
    headings: ["Showcase Your Work", "Designs that tell a story", "Portfolio of creative projects"],
    subheads: ["Highlight projects, case studies, and client testimonials."],
    nav: ["Home","Work","About","Contact"],
    features: [
      {title:"Selected Projects", text:"Curated work that demonstrates skill."},
      {title:"Client Testimonials", text:"What clients say about collaborating."},
      {title:"Contact", text:"Hire me for your next project."}
    ],
    cta: ["View Portfolio","Hire Me"]
  },
  blog: {
    headings: ["Insights and Stories", "Thoughtful articles and guides", "Read our latest posts"],
    subheads: ["Regularly updated content to build an audience and authority."],
    nav: ["Home","Articles","Topics","Subscribe"],
    features: [
      {title:"Latest Posts", text:"Fresh content published weekly."},
      {title:"Categories", text:"Organized topics for easy browsing."},
      {title:"Subscribe", text:"Get new posts delivered to your inbox."}
    ],
    cta: ["Read More","Subscribe"]
  },
  informational: {
    headings: ["Learn More", "Guides and resources", "Trusted information hub"],
    subheads: ["Educational resources, how-tos, and reference material."],
    nav: ["Home","Guides","Resources","About"],
    features: [
      {title:"Comprehensive Guides", text:"Step-by-step tutorials and references."},
      {title:"Expert Contributors", text:"Content from subject matter experts."},
      {title:"Searchable Library", text:"Find answers quickly."}
    ],
    cta: ["Explore Guides","Start Learning"]
  },
  community: {
    headings: ["Join the Community", "Connect and collaborate", "Members sharing knowledge"],
    subheads: ["Forums, groups, and membership features to engage users."],
    nav: ["Home","Forum","Members","Join"],
    features: [
      {title:"Active Forums", text:"Discussions across many topics."},
      {title:"Member Profiles", text:"Showcase contributions and expertise."},
      {title:"Events", text:"Online and offline meetups."}
    ],
    cta: ["Join Now","Create Account"]
  },
  landing: {
    headings: ["Launch Faster", "One page to convert", "Campaign landing page"],
    subheads: ["Focused messaging and a single CTA for conversions."],
    nav: ["Home","Features","Pricing","Contact"],
    features: [
      {title:"Clear Value", text:"Communicate benefits in seconds."},
      {title:"Strong CTA", text:"Drive signups or leads."},
      {title:"A/B Ready", text:"Test variations to improve results."}
    ],
    cta: ["Get Started","Sign Up"]
  },
  nonprofit: {
    headings: ["Make an Impact", "Support our cause", "Join our mission"],
    subheads: ["Promote causes, accept donations, and engage supporters."],
    nav: ["Home","About","Programs","Donate"],
    features: [
      {title:"Our Mission", text:"What we stand for and why it matters."},
      {title:"Programs", text:"How donations are used."},
      {title:"Volunteer", text:"Ways to get involved."}
    ],
    cta: ["Donate Now","Support Us"]
  },
  educational: {
    headings: ["Learn New Skills", "Courses and tutorials", "Education for everyone"],
    subheads: ["Courses, lessons, and interactive resources for learners."],
    nav: ["Home","Courses","Instructors","Enroll"],
    features: [
      {title:"Structured Courses", text:"Curriculum designed by experts."},
      {title:"Certificates", text:"Earn recognition for completion."},
      {title:"Community", text:"Study groups and mentors."}
    ],
    cta: ["Browse Courses","Enroll"]
  },
  entertainment: {
    headings: ["Stream and Play", "Entertainment for everyone", "Watch, listen, play"],
    subheads: ["Media portals, streaming, and interactive experiences."],
    nav: ["Home","Shows","Games","Subscribe"],
    features: [
      {title:"New Releases", text:"Latest shows and content."},
      {title:"Exclusive", text:"Members-only content and perks."},
      {title:"Play Anywhere", text:"Cross-device streaming."}
    ],
    cta: ["Watch Now","Subscribe"]
  }
};

// Helpers
function $(id){ return document.getElementById(id); }
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function escapeHtml(str){ return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }

// Read UI settings
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
    featuresRaw: $('features').value.trim(),
    rawBody: $('rawBody').value.trim()
  };
}

// Build CSS for generated page
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
@media (max-width:800px){ .hero{flex-direction:column;align-items:flex-start} .grid{grid-template-columns:1fr} }
`;
}

// Build generated body based on type and content
function buildBody(settings){
  // If rawBody provided, use it directly (user override)
  if(settings.rawBody) return settings.rawBody;

  const type = settings.siteType;
  const tpl = templates[type] || templates.business;

  const title = settings.title || rand(tpl.headings);
  const subtitle = settings.subtitle || rand(tpl.subheads);
  const nav = (settings.navItems.length ? settings.navItems : tpl.nav).slice(0,6);
  const cta = settings.ctaText || rand(tpl.cta);

  // features: prefer user-provided lines, else template features
  let features = [];
  if(settings.featuresRaw){
    features = settings.featuresRaw.split('\n').map(line=>{
      const parts = line.split(' - ');
      return { title: parts[0].trim(), text: (parts[1]||'').trim() };
    }).filter(f=>f.title);
  } else {
    // pick 3-6 features from template
    const pool = tpl.features.slice();
    // shuffle
    pool.sort(()=>0.5-Math.random());
    features = pool.slice(0, Math.min(6, pool.length));
  }

  // Build nav HTML
  const navHtml = nav.map(n => `<a href="#">${escapeHtml(n)}</a>`).join('');

  // Layout selection: choose hero for landing/business/portfolio/blog, grid for ecommerce/informational/educational/entertainment, community uses two-column style
  let body = '';
  if(type === 'landing' || type === 'business' || type === 'portfolio' || type === 'blog'){
    body = `
<div class="container">
  <div class="nav"><div class="logo">Brand</div><div>${navHtml}<a class="cta" href="#" style="margin-left:14px">${escapeHtml(cta)}</a></div></div>
  <div class="hero">
    <div class="left">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(subtitle)}</p>
      <a class="cta" href="#">${escapeHtml(cta)}</a>
    </div>
    <div class="card" style="min-width:260px;">
      <h3 style="margin-top:0">${escapeHtml(features[0]?.title || 'Quick Info')}</h3>
      <p style="margin:0;color:rgba(0,0,0,0.65)">${escapeHtml(features[0]?.text || '')}</p>
    </div>
  </div>
  <div class="grid" style="margin-top:var(--space)">
    ${features.map(f=>`<div class="card"><h4 style="margin:0 0 8px 0">${escapeHtml(f.title)}</h4><p style="margin:0;color:rgba(0,0,0,0.65)">${escapeHtml(f.text)}</p></div>`).join('')}
  </div>
  <footer>© ${new Date().getFullYear()} • ${escapeHtml(type.charAt(0).toUpperCase()+type.slice(1))} site</footer>
</div>
`;
  } else if(type === 'ecommerce' || type === 'informational' || type === 'educational' || type === 'entertainment'){
    // grid-first layout
    body = `
<div class="container">
  <div class="nav"><div class="logo">Brand</div><div>${navHtml}<a class="cta" href="#" style="margin-left:14px">${escapeHtml(cta)}</a></div></div>
  <div style="padding:calc(var(--space) * 1.5) 0">
    <h1 style="margin:0 0 var(--space) 0">${escapeHtml(title)}</h1>
    <p style="margin:0 0 var(--space) 0;color:rgba(0,0,0,0.65)">${escapeHtml(subtitle)}</p>
  </div>
  <div class="grid">
    ${features.map(f=>`<div class="card"><h4 style="margin:0 0 8px 0">${escapeHtml(f.title)}</h4><p style="margin:0;color:rgba(0,0,0,0.65)">${escapeHtml(f.text)}</p></div>`).join('')}
  </div>
  <footer>© ${new Date().getFullYear()} • ${escapeHtml(type.charAt(0).toUpperCase()+type.slice(1))} site</footer>
</div>
`;
  } else if(type === 'community' || type === 'nonprofit'){
    // two-column style
    body = `
<div class="container">
  <div class="nav"><div class="logo">Brand</div><div>${navHtml}<a class="cta" href="#" style="margin-left:14px">${escapeHtml(cta)}</a></div></div>
  <div style="display:grid;grid-template-columns:1fr 320px;gap:var(--space);padding:calc(var(--space) * 1.5) 0">
    <div>
      <h2 style="margin-top:0">${escapeHtml(title)}</h2>
      <p>${escapeHtml(subtitle)}</p>
      ${features.map(f=>`<div style="margin-top:var(--space)"><h4 style="margin:0 0 8px 0">${escapeHtml(f.title)}</h4><p style="margin:0;color:rgba(0,0,0,0.65)">${escapeHtml(f.text)}</p></div>`).join('')}
    </div>
    <aside class="card">
      <h3 style="margin-top:0">${escapeHtml(cta)}</h3>
      <p style="margin:0;color:rgba(0,0,0,0.65)">Quick actions and membership or donation form placeholder.</p>
    </aside>
  </div>
  <footer>© ${new Date().getFullYear()} • ${escapeHtml(type.charAt(0).toUpperCase()+type.slice(1))} site</footer>
</div>
`;
  } else {
    // fallback hero
    body = `
<div class="container">
  <div class="nav"><div class="logo">Brand</div><div>${navHtml}<a class="cta" href="#" style="margin-left:14px">${escapeHtml(cta)}</a></div></div>
  <div class="hero">
    <div class="left">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(subtitle)}</p>
      <a class="cta" href="#">${escapeHtml(cta)}</a>
    </div>
    <div class="card" style="min-width:260px;">
      <h3 style="margin-top:0">${escapeHtml(features[0]?.title || 'Info')}</h3>
      <p style="margin:0;color:rgba(0,0,0,0.65)">${escapeHtml(features[0]?.text || '')}</p>
    </div>
  </div>
  <footer>© ${new Date().getFullYear()} • Generated site</footer>
</div>
`;
  }

  return body;
}

// Build full HTML document
function buildHTML(){
  const s = readSettings();
  const css = buildCSS(s);
  const body = buildBody(s);
  const title = s.title || (templates[s.siteType] ? templates[s.siteType].headings[0] : 'Generated Site');
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

// Update preview iframe
function updatePreview(){
  const html = buildHTML();
  const iframe = $('preview');
  iframe.srcdoc = html;
  iframe.dataset.generated = html;
}

// Copy HTML to clipboard
async function copyHTML(){
  const iframe = $('preview');
  const html = iframe.dataset.generated || buildHTML();
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

// Generate random content for selected type and populate fields
function randomizeContent(){
  const type = $('siteType').value;
  const tpl = templates[type] || templates.business;

  // pick random heading/subhead
  $('title').value = rand(tpl.headings);
  $('subtitle').value = rand(tpl.subheads);
  $('navItems').value = tpl.nav.join(',');
  $('ctaText').value = rand(tpl.cta);

  // features: join as lines "Title - text"
  const features = tpl.features.slice().sort(()=>0.5-Math.random()).slice(0, randInt(3,6));
  $('features').value = features.map(f=>`${f.title} - ${f.text}`).join('\n');

  // random pleasant palette
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

  // random font and size
  const fonts = [
    "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
    "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto",
    "'Merriweather', serif"
  ];
  $('font').value = rand(fonts);
  $('fontSize').value = randInt(14,18);

  // clear raw body override
  $('rawBody').value = '';

  // update preview
  updatePreview();
}

// Wire events
$('updateBtn').addEventListener('click', updatePreview);
$('randomBtn').addEventListener('click', randomizeContent);
$('copyBtn').addEventListener('click', copyHTML);

// Live update when editing fields
document.querySelectorAll('#controls input, #controls textarea, #controls select').forEach(el=>{
  el.addEventListener('input', () => {
    // small debounce to avoid too many updates
    if(window._debounce) clearTimeout(window._debounce);
    window._debounce = setTimeout(updatePreview, 220);
  });
});

// Initialize with a random content for the default type
randomizeContent();
