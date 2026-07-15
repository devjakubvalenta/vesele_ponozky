/*
  Produktový detail — JS doplňky ke stylu v src/css/24-product-detail.css:
    1. pás recenzí pod obrázkem (reuse komponenty .vp-recenze z 95-recenze.css),
    2. klon slevového pillu „-46 %" do pravého sloupce (zdroj na obrázku je
       Vue v-if — klon se synchronizuje MutationObserverem),
    3. label „Množství" nad stepperem,
    4. pojistka: zvýraznění data doručení, kdyby chyběl nativní span.

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
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pd-sticky-cta__btn";
      btn.textContent = "Přidat do košíku";
      bar.appendChild(btn);
      document.body.appendChild(bar);
      // klik → přeposlat na aktuální originální CTA (čerstvý dotaz kvůli re-renderu)
      btn.addEventListener("click", function () {
        var r = app();
        var orig = r && r.querySelector(".product-add-to-shopping-basket .btn");
        if (orig) orig.click();
      });
      stickyState.bar = bar;
    }

    // zrcadlit zámek varianty (#app.variant-selection-required)
    stickyState.bar.classList.toggle(
      "is-locked",
      root.classList.contains("variant-selection-required")
    );

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

  /* == Orchestrace ===================================================== */

  function runAll() {
    var root = app();
    if (!root) return;
    injectReviews(root);
    syncDiscountPill(root);
    injectQtyLabel(root);
    ensureDeliveryDateSpan(root);
    ensureStickyCta(root);
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
