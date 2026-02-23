// Prefab site builder with full adjustable elements and exact visual export
const canvas = document.getElementById("canvas");
const prefabs = document.querySelectorAll(".prefab");
const templates = {
  hero: document.getElementById("tpl-hero").content,
  nav: document.getElementById("tpl-nav").content,
  card: document.getElementById("tpl-card").content,
  button: document.getElementById("tpl-button").content,
  image: document.getElementById("tpl-image").content
};

// Properties UI
const propsPanel = document.getElementById("props");
const noSelection = document.getElementById("noSelection");
const propType = document.getElementById("propType");
const propText = document.getElementById("propText");
const propBg = document.getElementById("propBg");
const propColor = document.getElementById("propColor");
const propBorderColor = document.getElementById("propBorderColor");
const propBorderWidth = document.getElementById("propBorderWidth");
const propWidth = document.getElementById("propWidth");
const propHeight = document.getElementById("propHeight");
const propX = document.getElementById("propX");
const propY = document.getElementById("propY");
const propZ = document.getElementById("propZ");
const propFontSize = document.getElementById("propFontSize");
const propPadding = document.getElementById("propPadding");
const bringForward = document.getElementById("bringForward");
const sendBack = document.getElementById("sendBack");
const deleteEl = document.getElementById("deleteEl");

let selected = null;
let dragState = null;
let resizeState = null;
let idCounter = 0;

// Make prefabs draggable and clickable to create
prefabs.forEach(p => {
  p.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/prefab", p.dataset.type);
  });
  p.addEventListener("pointerdown", (ev) => {
    ev.preventDefault();
    const type = p.dataset.type;
    const el = createCanvasElement(type);
    const rect = canvas.getBoundingClientRect();
    el.style.left = `${Math.max(12, ev.clientX - rect.left)}px`;
    el.style.top = `${Math.max(12, ev.clientY - rect.top)}px`;
    canvas.appendChild(el);
    selectElement(el);
  });
});

// Drop support
canvas.addEventListener("dragover", (e) => e.preventDefault());
canvas.addEventListener("drop", (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData("text/prefab");
  if (!type) return;
  const el = createCanvasElement(type);
  const rect = canvas.getBoundingClientRect();
  el.style.left = `${Math.max(12, e.clientX - rect.left)}px`;
  el.style.top = `${Math.max(12, e.clientY - rect.top)}px`;
  canvas.appendChild(el);
  selectElement(el);
});

// Create wrapper with behaviors
function createCanvasElement(type) {
  idCounter++;
  const wrapper = document.createElement("div");
  wrapper.className = "canvas-el";
  wrapper.dataset.type = type;
  wrapper.dataset.id = `el-${idCounter}`;
  wrapper.style.left = "20px";
  wrapper.style.top = "20px";
  wrapper.style.width = "320px";
  wrapper.style.height = "auto";
  wrapper.style.zIndex = 1;
  wrapper.style.padding = "8px";
  wrapper.style.background = "transparent";

  const tpl = templates[type];
  if (tpl) {
    const clone = tpl.cloneNode(true);
    wrapper.appendChild(clone);
  } else {
    wrapper.textContent = type;
  }

  const handle = document.createElement("div");
  handle.className = "handle";
  wrapper.appendChild(handle);

  // move
  wrapper.addEventListener("pointerdown", (e) => {
    if (e.target === handle) return;
    e.stopPropagation();
    startDrag(e, wrapper);
    selectElement(wrapper);
  });

  // resize
  handle.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    startResize(e, wrapper);
    selectElement(wrapper);
  });

  // inline editing
  wrapper.querySelectorAll("[contenteditable]").forEach(node => {
    node.addEventListener("input", () => {
      if (selected === wrapper) syncPropsToUI(wrapper);
    });
    node.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  });

  wrapper.addEventListener("click", (e) => {
    e.stopPropagation();
    selectElement(wrapper);
  });

  wrapper.addEventListener("dblclick", (e) => {
    const editable = wrapper.querySelector("[contenteditable]");
    if (editable) {
      editable.focus();
      document.execCommand("selectAll", false, null);
    }
  });

  return wrapper;
}

// selection
function selectElement(el) {
  if (selected) selected.classList.remove("selected");
  selected = el;
  if (!el) {
    propsPanel.classList.add("hidden");
    noSelection.classList.remove("hidden");
    return;
  }
  el.classList.add("selected");
  propsPanel.classList.remove("hidden");
  noSelection.classList.add("hidden");
  syncPropsToUI(el);
}

// sync element -> UI
function syncPropsToUI(el) {
  propType.value = el.dataset.type || "";
  const editable = el.querySelector("[contenteditable]");
  propText.value = editable ? editable.innerText : "";
  const cs = getComputedStyle(el);
  propBg.value = colorToHex(cs.backgroundColor) || "#000000";
  propColor.value = colorToHex(cs.color) || "#ffffff";
  propBorderColor.value = colorToHex(cs.borderColor) || "#000000";
  propBorderWidth.value = parseInt(cs.borderWidth) || 0;
  propWidth.value = Math.round(parseFloat(el.style.width) || el.getBoundingClientRect().width);
  propHeight.value = Math.round(parseFloat(el.style.height) || el.getBoundingClientRect().height);
  const crect = el.getBoundingClientRect();
  const crectCanvas = canvas.getBoundingClientRect();
  propX.value = Math.round(crect.left - crectCanvas.left);
  propY.value = Math.round(crect.top - crectCanvas.top);
  propZ.value = parseInt(el.style.zIndex) || 1;
  propFontSize.value = parseInt(cs.fontSize) || 16;
  propPadding.value = parseInt(cs.padding) || 8;
}

// UI -> element bindings
[
  propText, propBg, propColor, propBorderColor, propBorderWidth,
  propWidth, propHeight, propX, propY, propZ, propFontSize, propPadding
].forEach(inp => {
  inp.addEventListener("input", () => {
    if (!selected) return;
    if (inp === propText) {
      const editable = selected.querySelector("[contenteditable]");
      if (editable) editable.innerText = inp.value;
    } else if (inp === propBg) {
      selected.style.background = inp.value;
    } else if (inp === propColor) {
      selected.style.color = inp.value;
      selected.querySelectorAll("*").forEach(n => {
        if (n.matches && n.matches("a, p, h1, h2, h3, h4, span, div, button")) {
          n.style.color = inp.value;
        }
      });
    } else if (inp === propBorderColor) {
      selected.style.borderColor = inp.value;
      selected.style.borderStyle = selected.style.borderStyle || "solid";
    } else if (inp === propBorderWidth) {
      selected.style.borderWidth = inp.value + "px";
      selected.style.borderStyle = selected.style.borderStyle || "solid";
    } else if (inp === propWidth) {
      selected.style.width = inp.value + "px";
    } else if (inp === propHeight) {
      selected.style.height = inp.value + "px";
    } else if (inp === propX) {
      selected.style.left = inp.value + "px";
    } else if (inp === propY) {
      selected.style.top = inp.value + "px";
    } else if (inp === propZ) {
      selected.style.zIndex = inp.value;
    } else if (inp === propFontSize) {
      selected.style.fontSize = inp.value + "px";
      selected.querySelectorAll("*").forEach(n => {
        if (n.matches && n.matches("h1,h2,h3,h4,p,span,div,a,button")) {
          n.style.fontSize = inp.value + "px";
        }
      });
    } else if (inp === propPadding) {
      selected.style.padding = inp.value + "px";
    }
  });
});

// bring forward / send back / delete
bringForward.addEventListener("click", () => {
  if (!selected) return;
  selected.style.zIndex = (parseInt(selected.style.zIndex || 1) + 1);
  syncPropsToUI(selected);
});
sendBack.addEventListener("click", () => {
  if (!selected) return;
  selected.style.zIndex = Math.max(0, (parseInt(selected.style.zIndex || 1) - 1));
  syncPropsToUI(selected);
});
deleteEl.addEventListener("click", () => {
  if (!selected) return;
  selected.remove();
  selected = null;
  selectElement(null);
});

// canvas deselect
canvas.addEventListener("pointerdown", (e) => {
  if (e.target === canvas) {
    if (selected) selected.classList.remove("selected");
    selected = null;
    selectElement(null);
  }
});

// dragging logic
function startDrag(e, el) {
  const rect = canvas.getBoundingClientRect();
  const startX = e.clientX;
  const startY = e.clientY;
  const origLeft = parseFloat(el.style.left) || el.getBoundingClientRect().left - rect.left;
  const origTop = parseFloat(el.style.top) || el.getBoundingClientRect().top - rect.top;
  dragState = { el, startX, startY, origLeft, origTop };

  el.setPointerCapture(e.pointerId);
  function onMove(ev) {
    const dx = ev.clientX - dragState.startX;
    const dy = ev.clientY - dragState.startY;
    el.style.left = Math.max(0, dragState.origLeft + dx) + "px";
    el.style.top = Math.max(0, dragState.origTop + dy) + "px";
    if (selected === el) syncPropsToUI(el);
  }
  function onUp(ev) {
    el.releasePointerCapture(ev.pointerId);
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", onUp);
    dragState = null;
  }
  document.addEventListener("pointermove", onMove);
  document.addEventListener("pointerup", onUp);
}

// resizing logic
function startResize(e, el) {
  const rect = el.getBoundingClientRect();
  const startX = e.clientX;
  const startY = e.clientY;
  const startW = rect.width;
  const startH = rect.height;
  resizeState = { el, startX, startY, startW, startH };

  el.setPointerCapture(e.pointerId);
  function onMove(ev) {
    const dx = ev.clientX - resizeState.startX;
    const dy = ev.clientY - resizeState.startY;
    const newW = Math.max(40, resizeState.startW + dx);
    const newH = Math.max(20, resizeState.startH + dy);
    resizeState.el.style.width = newW + "px";
    resizeState.el.style.height = newH + "px";
    if (selected === el) syncPropsToUI(el);
  }
  function onUp(ev) {
    el.releasePointerCapture(ev.pointerId);
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", onUp);
    resizeState = null;
  }
  document.addEventListener("pointermove", onMove);
  document.addEventListener("pointerup", onUp);
}

// helpers
function colorToHex(rgb) {
  if (!rgb) return null;
  const m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return null;
  return "#" + [1,2,3].map(i => parseInt(m[i]).toString(16).padStart(2,"0")).join("");
}

// clear canvas
document.getElementById("clearCanvas").addEventListener("click", () => {
  canvas.querySelectorAll(".canvas-el").forEach(n => n.remove());
  selected = null;
  selectElement(null);
});

// EXPORT: produce exact-looking HTML by inlining computed styles and absolute positions
document.getElementById("exportHtml").addEventListener("click", () => {
  const canvasRect = canvas.getBoundingClientRect();

  // create a container to hold clones
  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.width = canvasRect.width + "px";
  container.style.height = canvasRect.height + "px";
  container.style.background = getComputedStyle(canvas).backgroundImage || getComputedStyle(canvas).backgroundColor || "#ffffff";
  container.style.padding = "0";
  container.style.margin = "0";

  // properties to copy from computed style
  const propsToCopy = [
    "backgroundColor","backgroundImage","backgroundSize","backgroundRepeat","backgroundPosition",
    "color","fontSize","fontFamily","fontWeight","lineHeight","textAlign",
    "borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth",
    "borderTopStyle","borderRightStyle","borderBottomStyle","borderLeftStyle",
    "borderTopColor","borderRightColor","borderBottomColor","borderLeftColor",
    "borderRadius","boxShadow","paddingTop","paddingRight","paddingBottom","paddingLeft",
    "marginTop","marginRight","marginBottom","marginLeft",
    "width","height","minWidth","minHeight"
  ];

  // for each canvas child, clone and inline styles
  canvas.querySelectorAll(".canvas-el").forEach(el => {
    const rect = el.getBoundingClientRect();
    const clone = el.cloneNode(true);

    // remove editor-only nodes (handles)
    clone.querySelectorAll(".handle").forEach(h => h.remove());
    clone.classList.remove("selected");

    // set absolute position relative to canvas
    const left = rect.left - canvasRect.left;
    const top = rect.top - canvasRect.top;
    clone.style.position = "absolute";
    clone.style.left = left + "px";
    clone.style.top = top + "px";

    // copy computed styles
    const cs = getComputedStyle(el);
    propsToCopy.forEach(p => {
      try {
        const val = cs[p];
        if (val && val !== "0px" && val !== "normal" && val !== "none" && val !== "rgba(0, 0, 0, 0)") {
          // convert camelCase to kebab-case
          const kebab = p.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
          clone.style.setProperty(kebab, val);
        }
      } catch (err) {
        // ignore
      }
    });

    // ensure width/height are explicit
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    clone.style.width = w + "px";
    clone.style.height = h + "px";

    // ensure z-index
    clone.style.zIndex = el.style.zIndex || getComputedStyle(el).zIndex || 1;

    // for images, keep src attribute (already cloned)
    clone.querySelectorAll("img").forEach(img => {
      // keep src as-is; alt preserved
      img.style.maxWidth = "100%";
      img.style.height = "auto";
    });

    // remove contenteditable attributes (exported site shouldn't be editable)
    clone.querySelectorAll("[contenteditable]").forEach(n => n.removeAttribute("contenteditable"));

    container.appendChild(clone);
  });

  // build final HTML
  const exportedHtml = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Exported Page</title>
<style>
  /* Minimal reset for exported page */
  html,body{margin:0;padding:0}
  body{font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; background: ${getComputedStyle(canvas).backgroundColor || "#fff"}}
  a{color:inherit;text-decoration:none}
</style>
</head>
<body>
${container.outerHTML}
</body>
</html>`;

  // open in new tab
  const w = window.open();
  w.document.open();
  w.document.write(exportedHtml);
  w.document.close();
});

// keyboard delete
document.addEventListener("keydown", (e) => {
  if ((e.key === "Delete" || e.key === "Backspace") && selected) {
    selected.remove();
    selected = null;
    selectElement(null);
  }
});
