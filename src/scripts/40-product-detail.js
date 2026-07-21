/*
  Produktový detail — JS doplňky ke stylu v src/css/24-product-detail.css:
    1. pás recenzí pod obrázkem (reuse komponenty .vp-recenze z 95-recenze.css),
    2. klon slevového pillu „-46 %" do pravého sloupce (zdroj na obrázku je
       Vue v-if — klon se synchronizuje MutationObserverem),
    3. label „Množství" nad stepperem,
    4. pojistka: zvýraznění data doručení, kdyby chyběl nativní span,
    5. plovoucí „Přidat do košíku" na mobilu,
    6. taby (Popis/Parametry/…) → accordion pod galerií v levém sloupci
       (klasický, jedna otevřená; nové ouško = automaticky další položka).

  Vkládá se do: Administrace → Skripty → nová položka
     • Název: „Produktový detail (recenze, slevový pill, množství)"
     • Zobrazit na stránkách: Pouze produktový detail
     • Umístit v Head: ne (patička)
     • Obsah položky (PIN HASHEM — bump při změně souboru):
         <script src="https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@<hash>/src/scripts/40-product-detail.js"></script>

  Vue-safety: NIC nepřesouváme, jen appendujeme statické uzly na stabilní
  místa (konec figure, přímé dítě .product-right-content, košík wrapper —
  stejný vzor jako nasazená force-variant hláška). Pozici řeší CSS order.
  Vše idempotentní; MutationObserver obnoví stav po případném Vue patchi.
*/
(function () {
  "use strict";

  if (window.__vpProductDetail) return;
  window.__vpProductDetail = true;

  var FILES = "https://www.exitshop.cz/files/310/files/";
  var STARS = FILES + "Hv%C4%9Bzdi%C4%8Dky.svg";
  var AVATAR = FILES + "emoji_recenze.svg";

  var TITLE = "Přes 500 tisíc prodaných párů";
  var REVIEWS = [
    { name: "Ondra",            quote: "„Vše v naprostém pořádku. Rychlost. Kvalita. Doporučuji." },
    { name: "Blanka",           quote: "„Rychlé dodání, skvělá komunikace, ochota a vstřícnost." },
    { name: "Eliška Vostracká", quote: "„Nakupuji pravidelně, kvalitní materiál, rychlost dodání, spokojenost." }
  ];

  function app() { return document.querySelector("#app.product-detail"); }

  /* == 1) Pás recenzí do levého sloupce ================================ */

  function reviewCard(r) {
    var card = document.createElement("div");
    card.className = "vp-recenze__card";
    var stars = document.createElement("img");
    stars.className = "vp-recenze__stars";
    stars.src = STARS;
    stars.alt = "Hodnocení 5 z 5 hvězd";
    stars.loading = "lazy";
    var quote = document.createElement("p");
    quote.className = "vp-recenze__quote";
    quote.textContent = r.quote + "“";
    var reviewer = document.createElement("div");
    reviewer.className = "vp-recenze__reviewer";
    var avatar = document.createElement("img");
    avatar.className = "vp-recenze__avatar";
    avatar.src = AVATAR;
    avatar.alt = "";
    avatar.loading = "lazy";
    var meta = document.createElement("div");
    meta.className = "vp-recenze__reviewer-meta";
    var name = document.createElement("span");
    name.className = "vp-recenze__reviewer-name";
    name.textContent = r.name;
    var verified = document.createElement("span");
    verified.className = "vp-recenze__verified";
    var check = document.createElement("span");
    check.className = "vp-recenze__check";
    check.textContent = "✓";
    verified.appendChild(check);
    verified.appendChild(document.createTextNode(" Ověřený zákazník"));
    meta.appendChild(name);
    meta.appendChild(verified);
    reviewer.appendChild(avatar);
    reviewer.appendChild(meta);
    card.appendChild(stars);
    card.appendChild(quote);
    card.appendChild(reviewer);
    return card;
  }

  function injectReviews(root) {
    if (document.getElementById("pd-reviews")) return;
    var fig = root.querySelector(":scope > figure");
    if (!fig) return;

    var wrap = document.createElement("div");
    wrap.id = "pd-reviews";
    wrap.className = "vp-recenze vp-recenze--pd";

    var head = document.createElement("div");
    head.className = "vp-recenze__pd-head";
    var stars = document.createElement("img");
    stars.className = "vp-recenze__pd-stars";
    stars.src = STARS;
    stars.alt = "Hodnocení 5 z 5 hvězd";
    var h = document.createElement("h2");
    h.className = "vp-recenze__pd-title";
    h.textContent = TITLE;
    head.appendChild(stars);
    head.appendChild(h);

    var cards = document.createElement("div");
    cards.className = "vp-recenze__cards";
    REVIEWS.forEach(function (r) { cards.appendChild(reviewCard(r)); });

    wrap.appendChild(head);
    wrap.appendChild(cards);
    fig.appendChild(wrap);   // pozici (mezi obrázkem a mozaikou) řeší CSS order
  }

  /* == 2) Klon slevového pillu do pravého sloupce ====================== */

  function syncDiscountPill(root) {
    var right = root.querySelector(".product-right-content");
    if (!right) return;
    var pill = right.querySelector(":scope > .pd-discount-pill");
    if (!pill) {
      pill = document.createElement("div");
      pill.className = "pd-discount-pill";
      pill.hidden = true;
      right.appendChild(pill);   // pozici řeší CSS order
    }
    var source = root.querySelector("figure .fancybox .discount-percentage");
    if (source) {
      var text = source.textContent.replace(/\s+/g, " ").trim();  // „- 46 %"
      if (pill.textContent !== text) pill.textContent = text;
      pill.hidden = false;
    } else {
      pill.hidden = true;
    }
  }

  /* == 3) Label „Množství" ============================================= */

  function injectQtyLabel(root) {
    var wrapper = root.querySelector(".product-add-to-shopping-basket-wrapper");
    if (!wrapper || wrapper.querySelector(".pd-qty-label")) return;
    var qty = wrapper.querySelector(".product-add-to-shopping-basket-quantity");
    if (!qty) return;
    var label = document.createElement("div");
    label.className = "pd-qty-label";
    label.textContent = "Množství";
    wrapper.insertBefore(label, qty);
  }

  /* == 4) Pojistka: zvýraznění data doručení =========================== */

  function ensureDeliveryDateSpan(root) {
    var dd = root.querySelector("p.delivery-date");
    if (!dd || dd.querySelector(".order-delivery-date")) return;
    var nodes = Array.prototype.slice.call(dd.childNodes);
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.nodeType !== 3) continue;
      var m = node.nodeValue.match(/(\d{1,2}\.\s?\d{1,2}\.(?:\s?\d{2,4})?)/);
      if (!m) continue;
      var span = document.createElement("span");
      span.className = "order-delivery-date";
      span.textContent = m[1];
      var after = node.splitText(m.index);
      after.nodeValue = after.nodeValue.slice(m[1].length);
      dd.insertBefore(span, after);
      break;
    }
  }

  /* == 5) Plovoucí „Přidat do košíku" na mobilu ======================== */
  /* Fixní spodní lišta jen s CTA. Žije v <body> (mimo #app, ať ji nesmaže Vue
     re-render). IntersectionObserver ji ukáže, když originální CTA vyscrolluje
     NAD viewport (odscrollováno dolů za tlačítko). Klik se přeposílá na originál
     — capture-listener boxu (force-variant) tím pádem zámek řeší sám. Vzhled
     řídí CSS `.pd-sticky-cta` (jen mobil ≤767.98px). */
  var stickyState = { bar: null, observer: null, observed: null };

  function ensureStickyCta(root) {
    if (!stickyState.bar) {
      var bar = document.createElement("div");
      bar.id = "pd-sticky-cta";
      bar.className = "pd-sticky-cta";
      bar.innerHTML =
        '<img class="pd-sticky-cta__thumb" alt="" loading="lazy">' +
        '<div class="pd-sticky-cta__price"></div>' +
        '<button type="button" class="pd-sticky-cta__btn">Přidat do košíku</button>';
      document.body.appendChild(bar);
      // klik: bez vybrané varianty tlačítko zůstává zelené, ale místo
      // (zablokovaného) přidání pošle uživatele na výběr varianty (jako Northman);
      // s vybranou variantou přeposílá na originální CTA (čerstvý dotaz kvůli re-renderu)
      bar.querySelector(".pd-sticky-cta__btn").addEventListener("click", function () {
        var r = app();
        if (!r) return;
        if (r.classList.contains("variant-selection-required")) {
          var picker =
            r.querySelector("#configurator-variants") ||
            r.querySelector("#variant-selector") ||
            r.querySelector(".variant-name");
          if (picker) picker.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        var orig = r.querySelector(".product-add-to-shopping-basket .btn");
        if (orig) orig.click();
      });
      stickyState.bar = bar;
    }

    // synchronizovat miniaturu produktu a cenu z detailu (mění se s variantou)
    var pimg = root.querySelector("figure img.product_detail") || root.querySelector("figure img");
    var thumb = stickyState.bar.querySelector(".pd-sticky-cta__thumb");
    if (pimg && pimg.getAttribute("src") && thumb.getAttribute("src") !== pimg.getAttribute("src")) {
      thumb.setAttribute("src", pimg.getAttribute("src"));
    }
    var priceSrc = root.querySelector(".wrapper-product-price");
    var priceBox = stickyState.bar.querySelector(".pd-sticky-cta__price");
    if (priceSrc && priceBox.__src !== priceSrc.innerHTML) {
      priceBox.innerHTML = priceSrc.innerHTML;   // klon cenového bloku (přeškrtnutá + aktuální)
      priceBox.__src = priceSrc.innerHTML;
    }

    // (re)napojit observer na aktuální CTA box (Vue mohl element vyměnit)
    if (!("IntersectionObserver" in window)) return;
    var target = root.querySelector(".product-add-to-shopping-basket");
    if (!target || target === stickyState.observed) return;
    if (stickyState.observer) stickyState.observer.disconnect();
    stickyState.observer = new IntersectionObserver(function (entries) {
      var e = entries[0];
      // ukázat lištu jen když je originál odscrollovaný NAHORU z view
      var pastAbove = !e.isIntersecting && e.boundingClientRect.top < 0;
      stickyState.bar.classList.toggle("is-visible", pastAbove);
    }, { threshold: 0 });
    stickyState.observer.observe(target);
    stickyState.observed = target;
  }

  /* == 6) Taby (Popis/Parametry/…) → accordion pod galerií ============= */
  /* Z oušek .nav-tabs + panelů .tab-content postaví klasický accordion
     (otevřená vždy jen JEDNA sekce, „Popis" po načtení), vloží ho na konec
     levého sloupce (pod galerii) a originální taby skryje. Iterujeme přes
     ouška → nové ouško = automaticky další rozklikávací položka. Obsah panelu
     KLONUJEME (taby nemají data-v = needitují se s variantou), originál držíme
     skrytý (kdyby ho Vue re-render vrátil). */

  function buildTabsAccordion(root) {
    var nav = root.querySelector(".product-right-content > .nav-tabs");
    var tc = root.querySelector(".product-right-content > .tab-content");
    var fig = root.querySelector(":scope > figure");
    if (!nav || !tc || !fig) return;

    var acc = root.querySelector(".pd-accordion");
    if (!acc) {
      var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
      if (!links.length) return;

      acc = document.createElement("div");
      acc.className = "pd-accordion";

      links.forEach(function (link, i) {
        var sel = link.getAttribute("href") || link.getAttribute("data-target");
        var pane = sel && sel.charAt(0) === "#" ? tc.querySelector(sel) : null;
        var label = (link.textContent || "").trim();
        if (!pane || !label || !(pane.innerHTML || "").trim()) return;  // prázdný panel přeskočit

        var item = document.createElement("div");
        item.className = "pd-accordion__item";
        if (i === 0) item.classList.add("is-open");     // „Popis" otevřený

        var head = document.createElement("button");
        head.type = "button";
        head.className = "pd-accordion__head";
        var lab = document.createElement("span");
        lab.className = "pd-accordion__label";
        lab.textContent = label;
        var ic = document.createElement("span");
        ic.className = "pd-accordion__icon";
        ic.setAttribute("aria-hidden", "true");
        head.appendChild(lab);
        head.appendChild(ic);

        var body = document.createElement("div");
        body.className = "pd-accordion__body";
        var inner = document.createElement("div");
        inner.className = "pd-accordion__inner";
        var content = document.createElement("div");
        content.className = "pd-accordion__content";
        content.innerHTML = pane.innerHTML;             // klon obsahu panelu
        inner.appendChild(content);
        body.appendChild(inner);

        head.addEventListener("click", function () {
          var willOpen = !item.classList.contains("is-open");
          var items = acc.querySelectorAll(".pd-accordion__item");
          for (var k = 0; k < items.length; k++) items[k].classList.remove("is-open");
          if (willOpen) item.classList.add("is-open");  // jen jedna otevřená
        });

        item.appendChild(head);
        item.appendChild(body);
        acc.appendChild(item);
      });

      if (!acc.children.length) return;
      fig.appendChild(acc);            // konec levého sloupce; pozici řeší CSS order
    }

    nav.style.display = "none";        // originály držet skryté
    tc.style.display = "none";
  }

  /* == Orchestrace ===================================================== */

  function runAll() {
    var root = app();
    if (!root) return;
    injectReviews(root);
    syncDiscountPill(root);
    injectQtyLabel(root);
    ensureDeliveryDateSpan(root);
    ensureStickyCta(root);
    buildTabsAccordion(root);
  }

  function init() {
    if (!app()) return;   // mimo produktový detail nedělat nic
    runAll();

    // pár opakování pro dorenderování (Vue hydratace)
    var tries = 0;
    var iv = setInterval(function () {
      runAll();
      if (++tries >= 8) clearInterval(iv);
    }, 250);

    // Vue patch (přepnutí varianty) může měnit badge/ceny — debounced re-sync;
    // vlastní zásahy nový běh nespustí (guardy + textContent porovnání)
    if ("MutationObserver" in window) {
      var pending = null;
      var mo = new MutationObserver(function () {
        clearTimeout(pending);
        pending = setTimeout(runAll, 120);
      });
      mo.observe(app(), { childList: true, subtree: true, characterData: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
