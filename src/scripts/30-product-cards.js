/*
  Produktové karty ve výpisech — JS doplňky ke stylu v src/css/25-products.css:
    1. dvouřádkový název (černý typ produktu + modrý název motivu),
    2. zeleně zvýrazněné datum v „doručíme 15.07.",
    3. tlačítko „Zobrazit vše" pod produktovými bloky na HP (nativně neexistuje),
    4. tlačítko „Zobrazit vše" pod hlavním HP výpisem „Všechny naše produkty"
       (CSS nechá viditelné jen 4 karty; JS přidá odkaz na Katalog).

  Vkládá se do: Administrace → Skripty → nová položka
     • Název: „Produktové karty (název, datum, Zobrazit vše)"
     • Zobrazit na stránkách: Na všech stránkách
     • Umístit v Head: ne (patička)
     • Obsah položky (JS musí být v <script>):
         <script src="https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@main/src/scripts/30-product-cards.js"></script>

  Vše je idempotentní (lze spustit opakovaně) a bez JS web degraduje
  elegantně — karty jen zůstanou s jednobarevným názvem a bez tlačítka.
*/
(function () {
  "use strict";

  if (window.__vpProductCards) return;
  window.__vpProductCards = true;

  /* == Konfigurace ======================================================= */

  // Mapa HP produktových bloků → URL pro tlačítko „Zobrazit vše".
  // Klíč = číslo z třídy section.recommend-block-{id}. Blok bez záznamu
  // tlačítko nedostane. Na HP jsou teď bloky: 3224 = Novinky, 3236 = Dárkové sety.
  var SHOW_ALL = {
    "3236": "https://www.exitshop.cz/shops/28056/c/1243139-darkove-sety"
    // "3224": ""  // Novinky — doplnit URL, až bude kam vést
  };
  var SHOW_ALL_LABEL = "Zobrazit vše";

  // Hlavní HP výpis „Všechny naše produkty" (nativní grid pod #homepage_text):
  // CSS nechá viditelné jen první 4 karty, JS pod grid přidá tlačítko „Zobrazit
  // vše" mířící sem. (Pozn.: stránka Katalog teď ukazuje jen část sortimentu —
  // až bude lepší cíl, stačí přepsat tuto URL.)
  var HP_ALL_URL = "https://www.exitshop.cz/shops/28056/c/1196952-katalog";
  var HP_ALL_LIMIT = 4;

  // Rozdělení názvu na 2 řádky:
  //  1. obsahuje-li název „ - ", dělí se na první pomlčce (pomlčka se nezobrazí),
  //  2. jinak začíná-li některým prefixem, dělí se za ním (delší prefix má přednost),
  //  3. jinak zůstane název vcelku (jednobarevný).
  var NAME_PREFIXES = [
    "Veselé ponožky",
    "Dětské ponožky",
    "Dárková krabička",
    "Dárkový set",
    "WiT Box",
    "Termo"
  ];

  /* == 1) Název na dva řádky ============================================ */

  function splitName(scope) {
    var headings = scope.querySelectorAll(".products .product .product-content h2");
    Array.prototype.forEach.call(headings, function (h2) {
      if (h2.querySelector(".pc-name-brand")) return; // už zpracováno
      var name = (h2.textContent || "").replace(/\s+/g, " ").trim();
      if (!name) return;

      var line1 = null, line2 = null;
      var dash = name.indexOf(" - ");
      if (dash > 0) {
        line1 = name.slice(0, dash).trim();
        line2 = name.slice(dash + 3).trim();
      } else {
        for (var i = 0; i < NAME_PREFIXES.length; i++) {
          var p = NAME_PREFIXES[i];
          if (name.length > p.length + 1 &&
              name.slice(0, p.length + 1).toLowerCase() === (p + " ").toLowerCase()) {
            line1 = name.slice(0, p.length);
            line2 = name.slice(p.length + 1).trim();
            break;
          }
        }
      }
      if (!line1 || !line2) return; // nedělitelný název — nechat být

      var brand = document.createElement("span");
      brand.className = "pc-name-brand";
      brand.textContent = line1;
      var variant = document.createElement("span");
      variant.className = "pc-name-variant";
      variant.textContent = line2;
      variant.title = name; // celý název v tooltipu (řádek se ořezává ellipsis)
      h2.textContent = "";
      h2.appendChild(brand);
      h2.appendChild(variant);
    });
  }

  /* == 2) Zelené datum v „doručíme 15.07." ============================== */

  function wrapDeliveryDate(scope) {
    var counts = scope.querySelectorAll(".products .product .stored-count");
    Array.prototype.forEach.call(counts, function (el) {
      if (el.querySelector(".pc-delivery-date")) return;
      // jen přímé textové uzly (uvnitř může být popup šablony)
      var nodes = Array.prototype.slice.call(el.childNodes);
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.nodeType !== 3) continue;
        var m = node.nodeValue.match(/(\d{1,2}\.\s?\d{1,2}\.(?:\s?\d{2,4})?)/);
        if (!m) continue;
        var span = document.createElement("span");
        span.className = "pc-delivery-date";
        span.textContent = m[1];
        var after = node.splitText(m.index);
        after.nodeValue = after.nodeValue.slice(m[1].length);
        el.insertBefore(span, after);
        break;
      }
    });
  }

  /* == 3) „Zobrazit vše" pod HP bloky =================================== */

  function addShowAllButtons(scope) {
    var blocks = (scope.querySelectorAll ? scope : document)
      .querySelectorAll("section.recommend-block");
    Array.prototype.forEach.call(blocks, function (block) {
      if (block.querySelector(".pc-show-all")) return;
      var m = block.className.match(/recommend-block-(\d+)/);
      if (!m || !SHOW_ALL[m[1]]) return;
      var a = document.createElement("a");
      a.className = "pc-show-all";
      a.href = SHOW_ALL[m[1]];
      a.textContent = SHOW_ALL_LABEL;
      block.appendChild(a);
    });
  }

  /* == 4) „Zobrazit vše" pod hlavním HP výpisem ========================= */

  // Grid „Všechny naše produkty" = section.products.row hned za #homepage_text
  // (existuje jen na HP). CSS skryje 5.+ kartu; sem přidáme odkaz na Katalog.
  function addHomepageShowAll() {
    var grid = document.querySelector("#homepage_text + section.products.row");
    if (!grid) return;                                              // jen HP
    if (grid.parentNode.querySelector("a.pc-show-all-hp")) return;  // už hotovo
    if (grid.querySelectorAll(":scope > a.product").length <= HP_ALL_LIMIT) return;
    var a = document.createElement("a");
    a.className = "pc-show-all-hp";
    a.href = HP_ALL_URL;
    a.textContent = SHOW_ALL_LABEL;
    grid.insertAdjacentElement("afterend", a);
  }

  /* == Orchestrace ====================================================== */

  function runAll() {
    splitName(document);
    wrapDeliveryDate(document);
    addShowAllButtons(document);
    addHomepageShowAll();
  }

  function init() {
    runAll();

    // Pár opakování pro jistotu (obsah se může dorenderovávat)
    var tries = 0;
    var iv = setInterval(function () {
      runAll();
      if (++tries >= 8) clearInterval(iv);
    }, 250);

    // Kategorie umí AJAX filtrování/stránkování — nové karty zpracovat také.
    // Reagujeme jen na přidané elementy obsahující produktové karty,
    // vlastní zásahy (spany uvnitř h2) observer nespustí znovu díky guardům.
    if ("MutationObserver" in window) {
      var pending = null;
      var mo = new MutationObserver(function (mutations) {
        var relevant = mutations.some(function (mu) {
          return Array.prototype.some.call(mu.addedNodes, function (n) {
            return n.nodeType === 1 &&
              (n.matches && n.matches(".product") || n.querySelector && n.querySelector(".product"));
          });
        });
        if (!relevant) return;
        clearTimeout(pending);
        pending = setTimeout(runAll, 150);
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
