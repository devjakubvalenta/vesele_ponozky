/*
  Výpis kategorie na mobilu — dvě věci, obě jen pod 768 px:

  1) FILTR výchozí SBALENÝ, otevírá ho tlačítko „Filtr" (nativní toggle).
     Na desktopu (≥768 px) řeší CSS (vždy otevřený, horní tlačítko skryté).
     Platforma renderuje filtr otevřený přes inline `style="display:flex"`,
     který CSS nepřebije — proto ho na mobilu sbalí tento JS. Nativní tlačítko
     (.filter-button) i tak funguje na otevření/zavření (přepíná inline style).

  2) PODKATEGORIE nad výpisem (.children_categories) zkrácené na 3 řádky
     = 6 dlaždic, zbytek odkryje tlačítko „Zobrazit všechny". Pánské mají
     18 podkategorií = 9 řádků scrollu, než zákazník dojede k produktům.
     Sbalení dělá CSS (.vp-subcat--collapsed v 26-subcategories.css), JS jen
     přidá třídu a tlačítko. Po kliknutí tlačítko zmizí (zpátky se nesbaluje).

  Vkládá se do: Administrace → Skripty → nová položka
     • Název: „Výpis kategorie — filtr + podkategorie (mobil)"
     • Zobrazit na stránkách: Na všech stránkách
     • Umístit v Head: ne (patička)
     • Obsah položky (PIN HASHEM — je svázán s CSS):
         <script src="https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@<hash>/src/scripts/36-filter.js"></script>

  Idempotentní; mimo výpis kategorie (chybí .category-filters-collapsible
  i .children_categories) neudělá nic. Po prvním uživatelském kliknutí na
  toggle filtru se přestane vynucovat sbalení (userToggled).
*/
(function () {
  "use strict";

  if (window.__vpFilter) return;
  window.__vpFilter = true;

  var MOBILE = "(max-width: 767.98px)";
  var SUBCAT_VISIBLE = 6;        // 3 řádky × 2 dlaždice (mobilní grid)
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

  /* Podkategorie: nechat 6 dlaždic a zbytek schovat za tlačítko.
     Sbalení kreslí CSS třídou na kontejneru, tady jen třída + tlačítko —
     kdyby se skript nenačetl, zůstane nativní (všechny dlaždice vidět). */
  function collapseSubcategories() {
    if (!window.matchMedia(MOBILE).matches) return;
    var box = document.querySelector(".children_categories");
    if (!box) return;                                   // mimo výpis kategorie
    if (box.getAttribute("data-vp-subcat") === "1") return;  // idempotence
    if (box.children.length <= SUBCAT_VISIBLE) return;  // krátký seznam řešit netřeba
    box.setAttribute("data-vp-subcat", "1");
    box.classList.add("vp-subcat--collapsed");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "vp-subcat-more";
    btn.innerHTML =
      'Zobrazit všechny<span class="vp-subcat-more__ic" aria-hidden="true">›</span>';
    btn.addEventListener("click", function () {
      box.classList.remove("vp-subcat--collapsed");
      if (btn.parentNode) btn.parentNode.removeChild(btn);
    });
    box.insertAdjacentElement("afterend", btn);
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
    collapseSubcategories();

    // Pár opakování — kdyby platforma nastavila inline display:flex až po loadu.
    var tries = 0;
    var iv = setInterval(function () {
      relabel();
      collapseOnMobile();
      collapseSubcategories();
      if (++tries >= 6) clearInterval(iv);
    }, 150);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
