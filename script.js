/* ============================================================
   MULTI‑TAB PREVIEW SYSTEM
   ============================================================ */

const previewPages = {}; // Stores DOM roots for each preview page
const previewTabs = document.getElementById("previewTabs");
const previewContainer = document.getElementById("previewPages");
let selectedPage = null;

/* Load a preview page into a new tab */
async function openPreviewPage(pageName) {
  // If already open → switch to it
  if (previewPages[pageName]) {
    switchToPreview(pageName);
    return;
  }

  // Fetch HTML fragment
  const response = await fetch(`./PreviewPages/${pageName}`);
  const html = await response.text();

  // Create tab
  const tab = document.createElement("div");
  tab.className = "preview-tab";
  tab.textContent = pageName.replace(".html", "");
  tab.onclick = () => switchToPreview(pageName);
  previewTabs.appendChild(tab);

  // Create preview page container
  const pageDiv = document.createElement("div");
  pageDiv.classList.add("previewPage");
  pageDiv.style.display = "none";
  pageDiv.innerHTML = html;

  previewContainer.appendChild(pageDiv);
  previewPages[pageName] = pageDiv;

  // Enable editing inside this isolated preview
  enableTextEditing(pageDiv);
  enableImageReplacement(pageDiv);
  enableHeroImageReplacement(pageDiv);

  switchToPreview(pageName);
}

/* Switch between preview tabs */
function switchToPreview(pageName) {
  // Hide all preview pages
  Object.values(previewPages).forEach(div => div.style.display = "none");

  // Show selected page
  previewPages[pageName].style.display = "block";

  // Highlight active tab
  [...previewTabs.children].forEach(tab => {
    tab.classList.toggle("active", tab.textContent === pageName.replace(".html", ""));
  });
}

/* ============================================================
   UPDATED EDITING FUNCTIONS (ROOT‑AWARE)
   ============================================================ */

function enableTextEditing(root = document) {
  const selectors = [
    ".business_name",
    ".tagline",
    ".about_us p",
    ".service-card p",
    "h1", "h2", "h3", "p", "span"
  ];

  const elements = root.querySelectorAll(selectors.join(", "));
  elements.forEach(el => {
    el.addEventListener("click", () => {
      const newText = prompt("Edit text:", el.textContent);
      if (newText !== null) el.textContent = newText;
    });
  });
}

function enableImageReplacement(root = document) {
  const images = root.querySelectorAll("img");
  images.forEach(img => {
    img.addEventListener("click", () => {
      const url = prompt("Enter new image URL:", img.src);
      if (url) img.src = url;
    });
  });
}

function enableHeroImageReplacement(root = document) {
  const hero = root.querySelector(".hero");
  if (!hero) return;

  hero.addEventListener("click", () => {
    const url = prompt("Enter new hero background URL:");
    if (url) hero.style.backgroundImage = `url('${url}')`;
  });
}

/* ============================================================
   UPDATED POPUP LOGIC (WITH PREVIEW BUTTON)
   ============================================================ */

function enableLinkPopup() {
  const popup = document.getElementById("popup-box");
  const popupSave = document.getElementById("popup-save");
  const popupCancel = document.getElementById("popup-cancel");
  const popupPreview = document.getElementById("popup-preview");

  const pageButtons = document.querySelectorAll(".page-option");

  pageButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      selectedPage = btn.dataset.page;
    });
  });

  popupPreview.addEventListener("click", () => {
    if (!selectedPage) {
      alert("Please select a page first.");
      return;
    }

    openPreviewPage(selectedPage);
    popup.style.display = "none"; // Close popup after preview
  });

  popupCancel.addEventListener("click", () => {
    popup.style.display = "none";
  });

  popupSave.addEventListener("click", () => {
    popup.style.display = "none";
  });
}

enableLinkPopup();
