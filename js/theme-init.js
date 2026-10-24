/* Preserve Smarter — runs in <head> BEFORE the page paints, so dark mode never flashes light.
   Keep this file tiny. Load it with a plain <script src="js/theme-init.js"></script> (no defer). */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js"); // tells CSS that JavaScript is running (enables scroll-reveal)
  var saved = null;
  try { saved = localStorage.getItem("ps-theme"); } catch (e) { /* storage blocked: fall back to clock */ }
  var hour = new Date().getHours();
  var theme = (saved === "dark" || saved === "light") ? saved : ((hour >= 18 || hour < 6) ? "dark" : "light");
  if (theme === "dark") root.setAttribute("data-theme", "dark");
})();
