/* Preserve Smarter — payback calculator (freeze-dryer-payback-calculator.html only).
   Net yearly savings = weekly savings × 52 − batches/week × cost per batch × 52.
   Payback (years)    = machine price ÷ net yearly savings. Never pays back if net ≤ 0. */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("paybackCalc");
    if (!form) return;

    var savings = document.getElementById("weeklySavings");
    var savingsOut = document.getElementById("weeklySavingsValue");
    var batches = document.getElementById("batchesPerWeek");
    var batchesOut = document.getElementById("batchesPerWeekValue");
    var size = document.getElementById("machineSize");
    var price = document.getElementById("machinePrice");
    var perBatch = document.getElementById("costPerBatch");
    var errorEl = document.getElementById("calcError");
    var outNet = document.getElementById("resNet");
    var outRun = document.getElementById("resRunning");
    var outPayback = document.getElementById("resPayback");
    var verdict = document.getElementById("resVerdict");

    function money(n) {
      var r = Math.round(n);
      return (r < 0 ? "−$" : "$") + Math.abs(r).toLocaleString("en-US");
    }

    // Choosing a size fills in its typical price and running cost; both stay editable.
    size.addEventListener("change", function () {
      var opt = size.options[size.selectedIndex];
      price.value = opt.getAttribute("data-price");
      perBatch.value = opt.getAttribute("data-batch");
      calculate();
    });

    function calculate() {
      var weekly = parseFloat(savings.value);
      var perWeek = parseInt(batches.value, 10);
      var cost = parseFloat(price.value);
      var batchCost = parseFloat(perBatch.value);

      savingsOut.textContent = "$" + weekly;
      savings.setAttribute("aria-valuetext", "$" + weekly + " per week");
      batchesOut.textContent = String(perWeek);
      batches.setAttribute("aria-valuetext", perWeek + (perWeek === 1 ? " batch" : " batches") + " per week");

      if (!(cost > 0) || !(batchCost >= 0) || batchCost > 50) {
        errorEl.hidden = false;
        errorEl.textContent = "Enter a machine price above $0 and a cost per batch between $0 and $50.";
        return;
      }
      errorEl.hidden = true;

      var gross = weekly * 52;
      var running = perWeek * batchCost * 52;
      var net = gross - running;

      outRun.textContent = money(running);
      outNet.textContent = money(net);

      if (net <= 0) {
        outPayback.textContent = "Never";
        verdict.textContent = "At these numbers, running costs eat all of your savings — the machine never pays for itself.";
        return;
      }
      var years = cost / net;
      outPayback.textContent = years < 1 ? Math.max(1, Math.round(years * 12)) + " months" : years.toFixed(1) + " years";
      if (years <= 2) {
        verdict.textContent = "Fast payback — if you really keep up this level of savings every week.";
      } else if (years <= 5) {
        verdict.textContent = "Moderate payback — worth it only if you'll use the machine steadily for years.";
      } else {
        verdict.textContent = "Slow payback — at these numbers, the money case is weak. Non-financial reasons would need to carry it.";
      }
    }

    [savings, batches, price, perBatch].forEach(function (el) {
      el.addEventListener("input", calculate);
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    calculate();
  });
})();
