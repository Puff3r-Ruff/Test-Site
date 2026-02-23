// Simple prefab site builder with drag, resize, and property editing
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
const bringForward = document.getElementById("bringForward");
const sendBack = document.getElementById("sendBack");
const deleteEl = document.getElementById("deleteEl");

let selected = null;
let dragState = null;
let resizeState = null;
let idCounter = 0;

// Make prefabs draggable from palette into canvas
prefabs.forEach(p => {
  p.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/prefab", p.dataset.type);
  });
  // support pointer drag to create element
  p.addEventListener("pointerdown", (ev) => {
    ev.preventDefault();
    const type = p.dataset.type;
    const el = createCanvasElement(type);
    // place near top-left of canvas
    const rect = canvas.getBoundingClientRect();
    el.style.left = `${Math.max(12, ev.clientX - rect.left)}px`;
    el.style.top = `${Math.max(12, ev.clientY - rect.top)}px`;
    canvas.appendChild(el);
    selectElement(el);
  });
});

// Allow dropping via native drag
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

// Create a canvas element wrapper with handles and behaviors
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

  // clone template content
  const tpl = templates[type];
  if (tpl) {
    const clone = tpl.cloneNode(true);
    wrapper.appendChild(clone);
  } else {
    wrapper.textContent = type;
  }

  // add resize handle
  const handle = document.createElement("div");
  handle.className = "handle";
  wrapper.appendChild(handle);

  // pointer events for moving
  wrapper.addEventListener("pointerdown", (e) => {
    if (e.target === handle) return; // resize handled separately
    e.stopPropagation();
    startDrag(e, wrapper);
    selectElement(wrapper);
  });

  // resize pointer
  handle.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    startResize(e, wrapper);
    selectElement(wrapper);
  });

  // allow inline editing for contenteditable children
  wrapper.querySelectorAll("[contenteditable]").forEach(node => {
    node.addEventListener("input", () => {
      if (selected === wrapper) syncPropsToUI(wrapper);
    });
    node.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  });

  // click to select
  wrapper.addEventListener("click", (e) => {
    e.stopPropagation();
    selectElement(wrapper);
  });

  // double click to focus first editable
  wrapper.addEventListener("dblclick", (e) => {
    const editable = wrapper.querySelector("[contenteditable]");
    if (editable) {
      editable.focus();
      document.execCommand("selectAll", false, null);
    }
  });

  return wrapper;
}

// selection handling
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
  // text: pick first text node or contenteditable
  const editable = el.querySelector("[contenteditable]");
  propText.value = editable ? editable.innerText : "";
  // computed styles
  const bg = rgbToHex(getComputedStyle(el).backgroundColor) || "#000000";
  propBg.value = bg;
  const color = rgbToHex(getComputedStyle(el).color) || "#ffffff";
  propColor.value = color;
  const borderColor = rgbToHex(getComputedStyle(el).borderColor) || "#000000";
  propBorderColor.value = borderColor;
  const bw = parseInt(getComputedStyle(el).borderWidth) || 0;
  propBorderWidth.value = bw;
  propWidth.value = parseInt(el.style.width) || Math.round(el.getBoundingClientRect().width);
  propHeight.value = parseInt(el.style.height) || Math.round(el.getBoundingClientRect().height);
  propX.value = Math.round(parseFloat(el.style.left) || el.getBoundingClientRect().left - canvas.getBoundingClientRect().left);
  propY.value = Math.round(parseFloat(el.style.top) || el.getBoundingClientRect().top - canvas.getBoundingClientRect().top);
  propZ.value = parseInt(el.style.zIndex) || 1;
}

// UI -> element bindings
[propText, propBg, propColor, propBorderColor, propBorderWidth, propWidth, propHeight, propX, propY, propZ].forEach(inp => {
  inp.addEventListener("input", () => {
    if (!selected) return;
    if (inp === propText) {
      const editable = selected.querySelector("[contenteditable]");
      if (editable) editable.innerText = inp.value;
    } else if (inp === propBg) {
      selected.style.background = inp.value;
    } else if (inp === propColor) {
      selected.style.color = inp.value;
      // also try to color inner text nodes
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
    el.style.width = newW + "px";
    el.style.height = newH + "px";
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

// helper to convert rgb to hex
function rgbToHex(rgb) {
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

// export HTML (simple)
document.getElementById("exportHtml").addEventListener("click", () => {
  // build a minimal HTML from canvas children
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "padding:24px;background:#fff;color:#000";
  canvas.querySelectorAll(".canvas-el").forEach(el => {
    const clone = el.cloneNode(true);
    // remove handles and selection classes
    clone.querySelectorAll(".handle").forEach(h => h.remove());
    clone.classList.remove("selected");
    // inline styles for position and size
    clone.style.position = "relative";
    clone.style.left = "";
    clone.style.top = "";
    wrapper.appendChild(clone);
  });
  const html = `<!doctype html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>Export</title>\n</head>\n<body>\n${wrapper.innerHTML}\n</body>\n</html>`;
  // show in new window
  const w = window.open();
  w.document.open();
  w.document.write(html);
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
