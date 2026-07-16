/*
  Filtr ve výpisu kategorie — výchozí stav podle šířky displeje:
    • mobil (<768 px): filtr SBALENÝ, otevírá tlačítko „Filtr" (nativní toggle),
    • desktop (≥768 px): řeší CSS (vždy otevřený, horní tlačítko skryté).

  Platforma renderuje filtr otevřený přes inline `style="display:flex"`, který
  CSS nepřebije — proto ho na mobilu sbalí tento JS. Nativní tlačítko
  (.filter-button) i tak funguje na otevření/zavření (přepíná inline style).

  Vkládá se do: Administrace → Skripty → nová položka
     • Název: „Filtr — výchozí sbalený na mobilu"
     • Zobrazit na stránkách: Na všech stránkách
     • Umístit v Head: ne (patička)
     • Obsah položky (PIN HASHEM — je svázán s CSS):
         <script src="https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@<hash>/src/scripts/36-filter.js"></script>

  Idempotentní; mimo výpis kategorie (chybí .category-filters-collapsible)
  neudělá nic. Po prvním uživatelském kliknutí na toggle se přestane
  vynucovat sbalení (userToggled).
*/
(function () {
  "use strict";

  if (window.__vpFilter) return;
  window.__vpFilter = true;

  var MOBILE = "(max-width: 767.98px)";
  var userToggled = false;

  function relabel() {
    var b = document.querySelector(".filter-button-row .filter-button");
    if (b && /Filtrov/i.test(b.textContent)) b.textContent = "Filtr";
  }

  function collapseOnMobile() {
    if (userToggled) return;
    if (!window.matchMedia(MOBILE).matches) return;
    var coll = document.querySelector(".category-filters-collapsible");
    if (!coll) return;                                  // mimo výpis kategorie
    coll.style.display = "none";
    var btn = document.querySelector(".filter-button-row .filter-button");
    if (btn) btn.classList.remove("active");
    var arrow = document.querySelector(".category-filters-arrow");
    if (arrow) arrow.classList.remove("upside-down");
  }

  function init() {
    // Po prvním kliknutí na jakýkoli toggle přestat vynucovat sbalení.
    document.addEventListener("click", function (ev) {
      if (ev.target.closest &&
          ev.target.closest(".filter-button, .category-filters-collapse")) {
        userToggled = true;
      }
    }, true);

    relabel();
    collapseOnMobile();

    // Pár opakování — kdyby platforma nastavila inline display:flex až po loadu.
    var tries = 0;
    var iv = setInterval(function () {
      relabel();
      collapseOnMobile();
      if (++tries >= 6) clearInterval(iv);
    }, 150);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
