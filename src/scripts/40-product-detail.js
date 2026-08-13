/*
  Produktový detail — JS doplňky ke stylu v src/css/24-product-detail.css:
    1. pás recenzí pod obrázkem (reuse komponenty .vp-recenze z 95-recenze.css),
    2. klon slevového pillu „-46 %" do pravého sloupce (zdroj na obrázku je
       Vue v-if — klon se synchronizuje MutationObserverem),
    3. label „Množství" nad stepperem,
    4. pojistka: zvýraznění data doručení, kdyby chyběl nativní span,
    5. plovoucí „Přidat do košíku" na mobilu,
    6. taby (Popis/Parametry/…) → accordion pod galerií v levém sloupci
       (klasický: jedna otevřená naráz, defaultně všechny zavřené; nové
       ouško = automaticky další položka) + statické sekce z `TAB_STATIC`
       (Materiál a péče, Doprava a vrácení, Časté dotazy, Hodnocení) —
       TEXTY SE DOPLŇUJÍ TAM, pořadí řídí `TAB_ORDER`,
    7. YouTube preview → tmavá karta s vlastním play tlačítkem (facade;
       skutečný iframe až po kliknutí),
    8. sticky offset pravého sloupce — negativní `top` (CSS proměnná
       --pd-sticky-top), aby se sloupec zastavil SPODNÍ hranou u spodní hrany
       viewportu (viditelný košík + benefity), dokud levý delší sloupec
       doscrolluje; přepočet při změně výšky sloupce i viewportu,
    9. „Zvýhodněné balení" (additional-services) — nativní odkaz na set má
       target="_blank"; sundáme ho, ať klikací karta (styl v CSS) otevírá set
       ve STEJNÉM okně.

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

  // Cesta k médiím je na obou doménách stejná (produkce veseleponozky.cz
  // i test exitshop.cz) → bez domény, ať se nic neváže na testovací web.
  var FILES = "/files/310/files/";
  /* Hvězdy na detailu jsou MODRÉ (žluté zůstávají v patičce a na HP).
     Originál Hvězdičky.svg má jedinou plnou barvu #FBBC02; přebarvit ho přes
     CSS nejde — je to <img>, takže si vlastní žluté pixely vykreslí přes
     jakékoli pozadí a maska by tvar jen oříznula. Proto modrá kopie
     jako asset v repu. */
  var STARS = "https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@main/assets/hvezdicky-modre.svg";
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

    /* Karty jako nekonečný marquee pás — stejná struktura jako patička
       (footer.js) a HP (src/content/homepage.html): track = 2 identické
       sady, animace posune o translateX(-50%), tedy přesně o šířku jedné
       sady → spoj je bezešvý. Druhá sada je jen vizuální duplikát, proto
       aria-hidden. Animaci a fallback (ruční scroll) řeší CSS. */
    var marquee = document.createElement("div");
    marquee.className = "vp-recenze__marquee";
    var track = document.createElement("div");
    track.className = "vp-recenze__track";

    for (var s = 0; s < 2; s++) {
      var set = document.createElement("div");
      set.className = "vp-recenze__set";
      if (s === 1) set.setAttribute("aria-hidden", "true");
      REVIEWS.forEach(function (r) { set.appendChild(reviewCard(r)); });
      track.appendChild(set);
    }
    marquee.appendChild(track);

    wrap.appendChild(head);
    wrap.appendChild(marquee);
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
     (otevřená vždy jen JEDNA sekce, defaultně VŠECHNY zavřené), vloží ho na konec
     levého sloupce (pod galerii) a originální taby skryje. Iterujeme přes
     ouška → nové ouško = automaticky další rozklikávací položka. Obsah panelu
     KLONUJEME (taby nemají data-v = needitují se s variantou), originál držíme
     skrytý (kdyby ho Vue re-render vrátil).

     Kromě nativních tabů se přidávají STATICKÉ sekce (TAB_STATIC) — texty, které
     jsou u všech produktů stejné a platforma pro ně žádný tab nemá. */

  // Přejmenování nativních oušek. Klíč = co posílá platforma, hodnota = co má
  // stát v accordionu. (Nativní název se dá změnit i v administraci; tady je to
  // jen proto, aby se text nemusel hlídat na dvou místech.)
  var TAB_RENAME = {
    "Popis": "Popis a složení"
  };

  // Statické sekce accordionu — stejné u všech produktů.
  // `html` je zatím prázdné = sekce se vykreslí a jde rozkliknout, jen nemá
  // obsah. AŽ DORAZÍ TEXTY, stačí je vepsat sem (HTML: <p>, <ul>, <strong>…)
  // a bumpnout hash skriptu v admin položce „Produktový detail".
  var TAB_STATIC = [
    { label: "Materiál a péče", html: "" },
    { label: "Doprava a vrácení", html: "" },
    { label: "Časté dotazy", html: "" },
    { label: "Hodnocení", html: "" }
  ];

  // Pořadí sekcí. Co v seznamu není (třeba nový nativní tab z administrace),
  // se zařadí na konec v původním pořadí — nic se nikdy neztratí.
  var TAB_ORDER = [
    "Popis a složení",
    "Materiál a péče",
    "Doprava a vrácení",
    "Časté dotazy",
    "Hodnocení",
    "Parametry"
  ];

  function buildTabsAccordion(root) {
    var nav = root.querySelector(".product-right-content > .nav-tabs");
    var tc = root.querySelector(".product-right-content > .tab-content");
    var fig = root.querySelector(":scope > figure");
    if (!nav || !tc || !fig) return;

    var acc = root.querySelector(".pd-accordion");
    if (!acc) {
      var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
      if (!links.length) return;

      // 1) posbírat sekce: nativní taby (prázdný panel přeskočit) + statické
      var sections = [];
      links.forEach(function (link) {
        var sel = link.getAttribute("href") || link.getAttribute("data-target");
        var pane = sel && sel.charAt(0) === "#" ? tc.querySelector(sel) : null;
        var label = (link.textContent || "").trim();
        if (!pane || !label || !(pane.innerHTML || "").trim()) return;  // prázdný nativní panel přeskočit
        sections.push({ label: TAB_RENAME[label] || label, html: pane.innerHTML });
      });
      TAB_STATIC.forEach(function (t) {
        // statická sekce se vykreslí i prázdná (čeká na text), ale ne dvakrát,
        // kdyby stejně pojmenovaný tab přibyl i v administraci
        if (sections.some(function (s) { return s.label === t.label; })) return;
        sections.push({ label: t.label, html: t.html || "" });
      });
      if (!sections.length) return;

      // 2) seřadit podle TAB_ORDER; neznámé popisky na konec (stabilně)
      sections.forEach(function (s, i) {
        var rank = TAB_ORDER.indexOf(s.label);
        s._sort = (rank === -1 ? TAB_ORDER.length : rank) * 1000 + i;
      });
      sections.sort(function (a, b) { return a._sort - b._sort; });

      acc = document.createElement("div");
      acc.className = "pd-accordion";

      sections.forEach(function (sec) {
        var item = document.createElement("div");
        item.className = "pd-accordion__item";          // defaultně VŠECHNY zavřené
        if (!sec.html.trim()) item.classList.add("is-empty");   // sekce čekající na text

        var head = document.createElement("button");
        head.type = "button";
        head.className = "pd-accordion__head";
        var lab = document.createElement("span");
        lab.className = "pd-accordion__label";
        lab.textContent = sec.label;
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
        content.innerHTML = sec.html;                   // klon obsahu panelu / statický text
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

      fig.appendChild(acc);            // konec levého sloupce; pozici řeší CSS order
    }

    nav.style.display = "none";        // originály držet skryté
    tc.style.display = "none";
  }

  /* == 7) YouTube preview → tmavá karta s vlastním play tlačítkem =======
     Nativní <iframe> (cross-origin, nejde stylovat zevnitř) nahradíme „facade"
     — tmavá navy karta + modro-žluté tlačítko. Skutečný iframe (se správným
     ID + autoplay) se načte až po kliknutí (i výkonový přínos). Bonus: opraví
     i rozbité embed URL z adminu (embed/https://…/watch?v=ID). Idempotentní. */

  function enhanceYoutube() {
    /* video je v .content > .row.yt-video, MIMO #app.product-detail → hledáme
       v celém dokumentu (skript běží jen na produktovém detailu) */
    var wraps = document.querySelectorAll(".yt-video .embed-responsive");
    Array.prototype.forEach.call(wraps, function (wrap) {
      if (wrap.querySelector(".pd-yt-facade")) return;      // už hotovo
      var iframe = wrap.querySelector('iframe[src*="youtu"]');
      if (!iframe) return;
      var src = iframe.getAttribute("src") || "";
      var m = src.match(/[?&]v=([A-Za-z0-9_-]{11})/)
           || src.match(/embed\/([A-Za-z0-9_-]{11})(?:[?&/]|$)/)
           || src.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
      if (!m) return;
      var id = m[1];

      var facade = document.createElement("button");
      facade.type = "button";
      facade.className = "pd-yt-facade";
      facade.setAttribute("aria-label", "Přehrát video");
      var play = document.createElement("span");
      play.className = "pd-yt-play";
      facade.appendChild(play);

      facade.addEventListener("click", function () {
        var real = document.createElement("iframe");
        real.className = "embed-responsive-item";
        real.setAttribute("src", "https://www.youtube.com/embed/" + id + "?autoplay=1&rel=0");
        real.setAttribute("allow", "autoplay; encrypted-media; fullscreen; picture-in-picture");
        real.setAttribute("allowfullscreen", "");
        real.setAttribute("frameborder", "0");
        wrap.innerHTML = "";
        wrap.appendChild(real);
      });

      iframe.style.display = "none";
      wrap.appendChild(facade);
    });
  }

  /* == 8) Sticky offset pravého sloupce (zastavení spodní hranou) =======
     Pravý sloupec je position:sticky (CSS, jen ≥768px). Aby se ZASTAVIL SPODNÍ
     hranou u spodní hrany viewportu (viditelný košík + benefity), dokud delší
     levý sloupec doscrolluje, počítáme NEGATIVNÍ `top`:
         top = viewport − výška sloupce − mezera
     (sticky `bottom` drží jen při scrollu NAHORU, proto negativní `top`).
     Když je sloupec nižší, cap na HEADER_OFFSET → klasický sticky pod hlavičkou.
     Přepočet při změně výšky sloupce (ResizeObserver: varianta/obrázky/písmo)
     i viewportu (resize listener v init). Zápis do CSS proměnné je změna atributu
     style → NEspustí MutationObserver (ten sleduje jen childList/characterData),
     ani ResizeObserver (top nemění velikost boxu) → žádná smyčka. */

  var HEADER_OFFSET = 108;   // výška lepivé hlavičky (režim nízkého sloupce)
  var STICKY_GAP = 16;       // mezera pod spodní hranou sloupce
  var offsetState = { ro: null, observed: null };

  function updateStickyOffset(root) {
    var right = root.querySelector(".product-right-content");
    if (!right) return;

    // (re)napojit ResizeObserver na aktuální sloupec (výška se mění s variantou)
    if ("ResizeObserver" in window && right !== offsetState.observed) {
      if (offsetState.ro) offsetState.ro.disconnect();
      offsetState.ro = new ResizeObserver(function () {
        var r = app();
        if (r) updateStickyOffset(r);
      });
      offsetState.ro.observe(right);
      offsetState.observed = right;
    }

    var h = right.offsetHeight;   // 0 na mobilu (display:contents) → přeskočit
    if (!h) return;
    var top = Math.min(HEADER_OFFSET, window.innerHeight - h - STICKY_GAP);
    var val = top + "px";
    if (right.style.getPropertyValue("--pd-sticky-top") !== val) {
      right.style.setProperty("--pd-sticky-top", val);
    }
  }

  /* == 9) „Zvýhodněné balení" — odkaz na set ve STEJNÉM okně ============
     Nativní odkaz na produkt setu (.additional_services_products a.fw-bold) má
     target="_blank" → CSS z něj udělal klikací kartu (stretched-link), ale klik
     otevíral novou kartu. Přání: stejné okno → sundat target. Idempotentní
     (po odebrání už selektor [target] nematchne); běží v runAll (přežije Vue
     re-render, který by target mohl vrátit). */

  function fixAdditionalServicesLink(root) {
    var links = root.querySelectorAll(".additional_services_products a.fw-bold[target]");
    for (var i = 0; i < links.length; i++) links[i].removeAttribute("target");
  }

  /* == 10) Karusel „Zákazníci také nakupují" — počet karet podle šířky ===
     Owl dostane od platformy `items` JEN při inicializaci a `responsive` mapu
     má prázdnou, takže po změně šířky počet karet nepřepočítá. Když se stránka
     načte široká a pak se zúží (otočení displeje, změna velikosti okna),
     zůstane 5 karet i ve sloupci širokém 351 px → z karet jsou 70px nudličky
     s uříznutým názvem. Dáme owlu vlastní žebřík a po resize zavoláme
     `refresh.owl.carousel`, který přepočítá `settings` i šířky.

     Do 576 px jsou 2 karty (zadání), výš zůstává platformní rozdělení
     (576–991 = 3, od 992 = 5), takže se na desktopu nic nemění.
     Blok NENÍ uvnitř #app.product-detail — sedí v section.row-fluid
     .product_footer, proto se hledá přes document. */

  var OWL_ITEMS = [
    { min: 992, items: 5 },
    { min: 576, items: 3 },
    { min: 0, items: 2 }
  ];

  function owlItemsFor(w) {
    for (var i = 0; i < OWL_ITEMS.length; i++) {
      if (w >= OWL_ITEMS[i].min) return OWL_ITEMS[i].items;
    }
    return 2;
  }

  function tuneProductCarousel() {
    var jq = window.jQuery;
    if (!jq) return;
    var el = document.querySelector(".owl-carousel-section-products_category");
    if (!el) return;
    var inst = jq(el).data("owl.carousel");
    if (!inst || !inst.options) return;              // owl ještě nenaběhl
    var want = owlItemsFor(window.innerWidth);
    if (inst.options.items === want && inst.settings.items === want) return;
    inst.options.items = want;
    jq(el).trigger("refresh.owl.carousel");
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
    enhanceYoutube();
    updateStickyOffset(root);
    fixAdditionalServicesLink(root);
    tuneProductCarousel();
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

    // změna viewportu → přepočítat sticky offset pravého sloupce (bod 8)
    // a počet karet v karuselu „Zákazníci také nakupují" (bod 10)
    var rz = null;
    window.addEventListener("resize", function () {
      clearTimeout(rz);
      rz = setTimeout(function () {
        var r = app();
        if (r) updateStickyOffset(r);
        tuneProductCarousel();
      }, 120);
    });

    // Owl se inicializuje až po `load` (skripty šablony jsou na konci stránky),
    // takže runAll ho během prvních 2 s ještě nemusí zastihnout.
    window.addEventListener("load", tuneProductCarousel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
