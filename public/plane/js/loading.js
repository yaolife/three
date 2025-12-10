(function(){
  // 平面图使用 "plane-" 前缀的key
  const canvasContent = localStorage.getItem("md-plane-canvasContent");
  const isDark = localStorage.getItem("md-darkmode");
  if (!isDark && isDark !== null) document.body.classList.add("inverted");
  if (!canvasContent) return;
  const parser = new DOMParser();
  const doc = parser.parseFromString(canvasContent, "image/svg+xml");
  const workarea = document.getElementById("workarea");
  workarea.appendChild(doc.documentElement);
  const svgCanvas = document.getElementById("svgcanvas");
  const canvasTitle = localStorage.getItem("md-plane-canvasTitle");
  svgCanvas.setAttribute("title", canvasTitle ? "Loading " + canvasTitle  : "Loading Drawing");
  const svg = workarea.querySelector("svg");
})();