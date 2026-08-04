/*
  Popup „Produkt byl přidán do košíku" — JS doplněk ke stylu
  v src/css/33-cart-popup.css (třídy .acp-*):
    1. rozdělí nativní jednořádkový název „Ponožky - Berušky nízké - 35-38"
       na název + řádek „Velikost 35-38 · 1 ks" (.acp-meta),
    2. doplní zelenou cenu (.acp-price), když je zjistitelná
       (data-product-price kliknuté varianty, na detailu cena z DOM),
    3. počet ks čte z cart cookie shopping_cart_<shopId>
       (URL-encoded JSON {"productId-variantId": "ks"}; shop id se
       nehardcoduje — na produkci bude jiné).

  Vkládá se do: Administrace → Skripty → nová položka
     • Název: „Popup přidáno do košíku"
     • Zobrazit na stránkách: Na všech stránkách
     • Umístit v Head: ne (patička)
     • Obsah položky (JS musí být v <script>):
         <script src="https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@<hash>/src/scripts/45-cart-popup.js"></script>

  Idempotentní; bez JS zůstane nativní obsah popupu jen nastylovaný CSS.
*/
(function () {
  "use strict";

  if (window.__vpCartPopup) return;
  window.__vpCartPopup = true;

  // Naposledy kliknutá varianta / add tlačítko — zdroj ceny a přesného
  // id "productId-variantId" pro dohledání počtu ks v cookie.
  var lastPick = null; // { id, price, name, label, at }

  function rememberPick(el) {
    lastPick = {
      id: el.getAttribute("data-product-id") || null,
      price: el.getAttribute("data-product-price") || null,
      name: (el.getAttribute("data-product-name") || "").trim() || null,
      label: (el.textContent || "").trim() || null,
      at: Date.now()
    };
  }

  document.addEventListener("click", function (e) {
    if (!e.target || !e.target.closest) return;
    var box = e.target.closest(".variant-box[data-product-id]");
    if (box) { rememberPick(box); return; }
    // tlačítko bez variant nese data-* někdy samo
    var btn = e.target.closest(".product-add-to-shopping-basket[data-product-id]");
    if (btn) rememberPick(btn);
  }, true);

  /* == Košík z cookie ==================================================== */

  function readCart() {
    var m = document.cookie.match(/(?:^|;\s*)shopping_cart_\d+=([^;]*)/);
    if (!m) return {};
    try { return JSON.parse(decodeURIComponent(m[1])) || {}; }
    catch (err) { return {}; }
  }

  function quantityFor(fullId, productId) {
    var cart = readCart();
    if (fullId && cart[fullId]) return parseInt(cart[fullId], 10) || 1;
    if (productId) {
      // jediná položka daného produktu v košíku → její počet
      var keys = Object.keys(cart).filter(function (k) {
        return k === productId || k.indexOf(productId + "-") === 0;
      });
      if (keys.length === 1) return parseInt(cart[keys[0]], 10) || 1;
    }
    return 1;
  }

  /* == Cena ============================================================== */

  function formatPrice(raw) {
    var n = parseFloat(String(raw).replace(",", ".").replace(/[^\d.]/g, ""));
    if (!isFinite(n) || n <= 0) return null;
    var s = n % 1 ? n.toFixed(2).replace(".", ",") : String(n);
    return s + " Kč";
  }

  function findPrice(h4text) {
    // 1) čerstvě kliknutá varianta se shodným názvem (do 30 s)
    if (lastPick && lastPick.price && Date.now() - lastPick.at < 30000 &&
        (!lastPick.name || lastPick.name === h4text)) {
      return lastPick.price;
    }
    // 2) produktový detail — cena v pravém sloupci
    var el = document.querySelector("#app.product-detail .product-price-our") ||
             document.querySelector(".product-price-and-cart-button .product-price-our");
    if (el) return el.textContent;
    return null;
  }

  /* == Rozdělení názvu =================================================== */

  function splitVariant(name) {
    // přesně: název končí „ - <label kliknuté varianty>"
    if (lastPick && lastPick.label &&
        name.length > lastPick.label.length + 3 &&
        name.slice(-(lastPick.label.length + 3)) === " - " + lastPick.label) {
      return { base: name.slice(0, -(lastPick.label.length + 3)).trim(), variant: lastPick.label };
    }
    // heuristika: poslední segment vypadá jako velikost („35-38", „23-26"…)
    var i = name.lastIndexOf(" - ");
    if (i > 0) {
      var tail = name.slice(i + 3).trim();
      if (/^\d[\d\s-]*$/.test(tail)) return { base: name.slice(0, i).trim(), variant: tail };
    }
    return { base: name, variant: null };
  }

  /* == Obohacení popupu ================================================== */

  function enhance(popup) {
    if (popup.getAttribute("data-acp-done")) return;
    var h4 = popup.querySelector(".row h4");
    if (!h4) return;
    popup.setAttribute("data-acp-done", "1");

    var full = (h4.textContent || "").replace(/\s+/g, " ").trim();
    var parts = splitVariant(full);
    var fullId = (lastPick && lastPick.name === full) ? lastPick.id : null;
    var productId = fullId ? fullId.split("-")[0] : null;
    var qty = quantityFor(fullId, productId);

    h4.textContent = parts.base;

    var info = document.createElement("div");
    info.className = "acp-info";
    h4.parentNode.insertBefore(info, h4);
    info.appendChild(h4);

    var meta = document.createElement("div");
    meta.className = "acp-meta";
    meta.textContent = parts.variant
      ? "Velikost " + parts.variant + " · " + qty + " ks"
      : qty + " ks";
    info.appendChild(meta);

    var price = formatPrice(findPrice(full));
    if (price) {
      var priceEl = document.createElement("div");
      priceEl.className = "acp-price";
      priceEl.textContent = price;
      info.appendChild(priceEl);
    }
  }

  function scan() {
    var popups = document.querySelectorAll(".added_to_cart_popup");
    Array.prototype.forEach.call(popups, enhance);
  }

  function init() {
    scan(); // kdyby už byl otevřený

    if ("MutationObserver" in window) {
      var pending = null;
      var mo = new MutationObserver(function (mutations) {
        var relevant = mutations.some(function (mu) {
          return Array.prototype.some.call(mu.addedNodes, function (n) {
            return n.nodeType === 1 && (
              (n.matches && n.matches(".added_to_cart_popup, .fancybox-container")) ||
              (n.querySelector && n.querySelector(".added_to_cart_popup"))
            );
          });
        });
        if (!relevant) return;
        clearTimeout(pending);
        pending = setTimeout(scan, 50);
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
