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

  Navíc: kategorie v PRICE_FIRST se mají řadit od nejlevnějšího i při
  přímém vstupu (Google, sdílený odkaz) — viz blok „Výchozí řazení" níže.
*/
(function () {
  "use strict";

  if (window.__vpListingSort) return;
  window.__vpListingSort = true;

  /* == Výchozí řazení od nejlevnějšího ================================
     Platforma řadí SUFFIXEM v cestě: /price, /price_desc, /new a BEZ
     suffixu = nejprodávanější (stránkování pak přidá /<sort>/<offset>).
     Výchozí řazení kategorie se v administraci nastavit nedá, takže holou
     URL kategorie překlopíme na /price.

     Návrat na „Nejprodávanější" nejde přes explicitní /sales — ta URL
     301 přesměruje zpátky na holou (ověřeno), takže by se hned překlopila
     na /price. Používáme proto marker v query: holá URL + ?vp-sort=sales.
     Platforma neznámý parametr ignoruje (200, řazení dle prodejnosti,
     <option> „Nejprodávanější" selected) a redirect ho bere jako „uživatel
     si přeje prodejnost" a nechá stránku být.

     Redirect běží co nejdřív (ne až na DOMContentLoaded), ať výpis
     neproblikne v nesprávném pořadí. */

  var PRICE_FIRST = ["1243142"];   // Výprodej až -90 %
  var SALES_MARK = "vp-sort=sales";

  // Cesta kategorie BEZ řadicího/stránkovacího segmentu:
  //   /c/1243142-vyprodej-az-90             (produkce)
  //   /shops/28056/c/1243142-vyprodej-az-90 (technická adresa)
  var BARE_CATEGORY_RE = /^(?:\/shops\/\d+)?\/c\/(\d+)-[^/]*\/?$/;

  function priceFirstCategoryId(path) {
    var m = path.match(BARE_CATEGORY_RE);
    return m && PRICE_FIRST.indexOf(m[1]) !== -1 ? m[1] : null;
  }

  function redirectToPriceSort() {
    if (location.search.indexOf(SALES_MARK) !== -1) return;   // ruční volba prodejnosti
    if (!priceFirstCategoryId(location.pathname)) return;
    var path = location.pathname.replace(/\/$/, "") + "/price";
    location.replace(path + location.search + location.hash);
  }

  // Odkaz „Nejprodávanější" (holá URL kategorie) → tatáž URL s markerem.
  // Roletka posílá URL bez query i hashe; cokoli jiného necháváme být.
  function withSalesMark(url) {
    if (!url || url.indexOf("?") !== -1 || url.indexOf("#") !== -1) return url;
    if (!priceFirstCategoryId(url.replace(/^https?:\/\/[^/]+/i, ""))) return url;
    return url + "?" + SALES_MARK;
  }

  /* Odkazy na kategorii (menu, HP, „Zobrazit vše") rovnou na /price, ať se
     redirect výše používá jen pro vstupy zvenčí (Google, sdílený odkaz). */
  function pointLinksToPriceSort() {
    var links = document.querySelectorAll('a[href*="/c/"]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      if (!href || href.indexOf(SALES_MARK) !== -1) continue;   // náš přepínač zpět
      var cut = href.search(/[?#]/);
      var base = cut === -1 ? href : href.slice(0, cut);
      var rest = cut === -1 ? "" : href.slice(cut);
      if (!priceFirstCategoryId(base.replace(/^https?:\/\/[^/]+/i, ""))) continue;
      links[i].setAttribute("href", base.replace(/\/$/, "") + "/price" + rest);
    }
  }

  redirectToPriceSort();

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
        // „Nejprodávanější" = URL bez suffixu → u PRICE_FIRST kategorií by ji
        // redirect překlopil zpět na /price; přidáme marker (viz nahoře).
        a.href = withSalesMark(url);
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
    pointLinksToPriceSort();

    // Obsah se může dorenderovat (Vue, „Zobrazit vše" z 30-product-cards.js)
    // — pár opakování pro jistotu.
    var tries = 0;
    var iv = setInterval(function () {
      build(document);
      pointLinksToPriceSort();
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
