:root{
  --ui-bg:#f4f6f8;
  --panel-bg:#fff;
  --accent:#2563eb;
  --text:#0b1220;
  --muted:#6b7280;
}

*{box-sizing:border-box}
html,body{
  height:100%;
  margin:0;
  font-family:Inter,system-ui,Arial;
  background:var(--ui-bg);
  color:var(--text);
}

body{
  display:grid;
  grid-template-columns:420px 1fr;
  gap:18px;
  padding:18px;
}

.panel{
  background:var(--panel-bg);
  border-radius:10px;
  padding:16px;
  box-shadow:0 6px 18px rgba(12,20,30,0.06);
  overflow:auto;
}

.preview-panel{padding:12px}

.label{
  display:block;
  font-size:13px;
  margin:10px 0 6px;
  color:var(--muted);
}

input,select,textarea{
  width:100%;
  padding:8px;
  border-radius:6px;
  border:1px solid #e6e9ee;
  font-size:14px;
}

textarea{resize:vertical}

.btn{
  background:var(--accent);
  color:#fff;
  border:0;
  padding:8px 12px;
  border-radius:8px;
  cursor:pointer;
}

.small{padding:6px 8px;font-size:13px}

.footer{
  margin-top:12px;
  display:flex;
  gap:8px;
  align-items:center;
}

.preview{
  width:100%;
  height:78vh;
  border:0;
  border-radius:10px;
  background:#fff;
}

@media (max-width:900px){
  body{grid-template-columns:1fr}
  .preview{height:60vh}
}
