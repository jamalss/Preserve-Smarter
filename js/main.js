// Preserve Smarter — shared site behavior
(function () {
  "use strict";

  /* ---------- Theme: time-of-day default, user override persisted ---------- */
  var root = document.documentElement;
  var STORAGE_KEY = "whl-theme";

  function systemDefault() {
    var hour = new Date().getHours();
    return (hour >= 19 || hour < 6) ? "dark" : "light";
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    var btn = document.querySelector(".theme-toggle i");
    if (btn) btn.className = theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
  }

  var saved = localStorage.getItem(STORAGE_KEY);
  applyTheme(saved || systemDefault());

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var isDark = root.getAttribute("data-theme") === "dark";
        var next = isDark ? "light" : "dark";
        applyTheme(next);
        localStorage.setItem(STORAGE_KEY, next);
      });
    }

    /* ---------- Mobile nav ---------- */
    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        navLinks.classList.toggle("open");
        var expanded = navLinks.classList.contains("open");
        navToggle.setAttribute("aria-expanded", expanded);
      });
    }

    /* ---------- Scroll reveal for reading-path cards ---------- */
    var reveals = document.querySelectorAll(".path-card");
    if (reveals.length && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry, i) {
            if (entry.isIntersecting) {
              setTimeout(function () {
                entry.target.classList.add("revealed");
              }, i * 60);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("revealed"); });
    }

    /* ---------- Newsletter form (placeholder — wire to backend later) ---------- */
    var form = document.querySelector(".newsletter form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var btn = form.querySelector("button");
        var original = btn.textContent;
        btn.textContent = "Subscribed";
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
          form.reset();
        }, 2500);
        // TODO: replace with real endpoint (Google Apps Script / ESP form action)
      });
    }
  });
})();
