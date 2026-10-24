/* Preserve Smarter — shared site behaviour. Loaded with defer at the end of <body>.
   No inline handlers, no innerHTML, no eval. Theme is first set by js/theme-init.js. */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "ps-theme";
  var ICONS = "images/icons.svg#i-";

  function setIcon(svg, name) {
    if (!svg) return;
    var use = svg.querySelector("use");
    if (use) use.setAttribute("href", ICONS + name);
  }

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Theme toggle (state announced to screen readers) ---------- */
    var toggle = document.querySelector(".theme-toggle");
    function syncToggle() {
      if (!toggle) return;
      var isDark = root.getAttribute("data-theme") === "dark";
      toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
      toggle.setAttribute("aria-label", "Dark mode");
      setIcon(toggle.querySelector(".icon"), isDark ? "sun" : "moon-stars");
    }
    if (toggle) {
      syncToggle();
      toggle.addEventListener("click", function () {
        var nextDark = root.getAttribute("data-theme") !== "dark";
        if (nextDark) { root.setAttribute("data-theme", "dark"); }
        else { root.removeAttribute("data-theme"); }
        try { localStorage.setItem(STORAGE_KEY, nextDark ? "dark" : "light"); } catch (e) { /* not saved — fine */ }
        syncToggle();
      });
    }

    /* ---------- Mobile nav ---------- */
    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.getElementById("navLinks");
    function setMenu(open) {
      if (!navToggle || !navLinks) return;
      navLinks.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      setIcon(navToggle.querySelector(".icon"), open ? "x-lg" : "list");
    }
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        setMenu(!navLinks.classList.contains("open"));
      });
      // close on Escape and return focus to the button
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && navLinks.classList.contains("open")) {
          setMenu(false);
          navToggle.focus();
        }
      });
      // close when a link is chosen or the user clicks elsewhere
      navLinks.addEventListener("click", function (e) {
        if (e.target.closest("a")) setMenu(false);
      });
      document.addEventListener("click", function (e) {
        if (navLinks.classList.contains("open") && !e.target.closest(".site-nav")) setMenu(false);
      });
    }

    /* ---------- Scroll reveal for reading-path cards ---------- */
    var reveals = document.querySelectorAll(".path-card");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reveals.length && "IntersectionObserver" in window && !reduce) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            setTimeout(function () { entry.target.classList.add("revealed"); }, i * 60);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("revealed"); });
    }

    /* ---------- Footer year ---------- */
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  });
})();
