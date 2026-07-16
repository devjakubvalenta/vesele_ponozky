/*
  Řazení ve výpisech — JS doplněk ke stylu v src/css/26-listing-sort.css:
  nativní roletku řazení (<select.sorting>) přestaví na klikací odkazy
  zarovnané vpravo; počet položek („Zobrazeno…") zůstane vlevo. Aktivní
  volba je modrá + podtržená (odvozeno z <option selected>).

  Vkládá se do: Administrace → Skripty → nová položka
     • Název: „Řazení ve výpisech (klikací odkazy)"
     • Zobrazit na stránkách: Na všech stránkách
     • Umístit v Head: ne (patička)
     • Obsah položky (PIN HASHEM — je svázán s CSS):
         <script src="https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@<hash>/src/scripts/35-listing-sort.js"></script>

  Klik na odkaz je obyčejná navigace (href = URL z <option value>), takže
  funguje i bez dalšího JS na kliknutí; po reloadu se aktivní stav odvodí
  ze <select> znovu. Idempotentní; mimo výpisy (chybí select.sorting)
  neudělá nic. Bez JS/CSS zůstane funkční nativní roletka.
*/
(function () {
  "use strict";

  if (window.__vpListingSort) return;
  window.__vpListingSort = true;

  /* == Roletka → odkazy (idempotentní, per-toolbar guard) ============== */

  function build(scope) {
    var selects = (scope || document).querySelectorAll("select.sorting");
    Array.prototype.forEach.call(selects, function (sel) {
      var col = sel.parentElement;                 // sloupec s ikonou + roletkou
      if (!col) return;
      var row = sel.closest(".row");
      if (!row) return;
      if (col.querySelector(".vp-sort")) return;   // už přestaveno

      row.classList.add("vp-sort-row");
      col.classList.add("vp-sort-col");

      var nav = document.createElement("nav");
      nav.className = "vp-sort";
      nav.setAttribute("aria-label", "Řazení");

      Array.prototype.forEach.call(sel.options, function (opt) {
        var label = (opt.textContent || "").replace(/\s+/g, " ").trim();
        var url = opt.value;
        if (!label || !url) return;
        var a = document.createElement("a");
        a.className = "vp-sort__link";
        a.href = url;
        a.textContent = label;
        if (opt.selected) {
          a.classList.add("is-active");
          a.setAttribute("aria-current", "true");
        }
        nav.appendChild(a);
      });

      if (nav.children.length) col.appendChild(nav);
    });
  }

  /* == Orchestrace ===================================================== */

  function init() {
    build(document);

    // Obsah se může dorenderovat (Vue) — pár opakování pro jistotu.
    var tries = 0;
    var iv = setInterval(function () {
      build(document);
      if (++tries >= 8) clearInterval(iv);
    }, 250);

    // Kategorie umí AJAX filtrování/stránkování → toolbar se překreslí.
    // Nová (nezpracovaná) roletka se přestaví znovu díky per-toolbar guardu.
    if ("MutationObserver" in window) {
      var pending = null;
      var mo = new MutationObserver(function (mutations) {
        var relevant = mutations.some(function (mu) {
          return Array.prototype.some.call(mu.addedNodes, function (n) {
            return n.nodeType === 1 &&
              (n.matches && n.matches("select.sorting") ||
               n.querySelector && n.querySelector("select.sorting"));
          });
        });
        if (!relevant) return;
        clearTimeout(pending);
        pending = setTimeout(function () { build(document); }, 150);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
