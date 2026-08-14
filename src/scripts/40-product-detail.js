/*
  Produktový detail — JS doplňky ke stylu v src/css/24-product-detail.css:
    1. pás recenzí pod obrázkem (reuse komponenty .vp-recenze z 95-recenze.css),
    2. klon slevového pillu „-46 %" do pravého sloupce (zdroj na obrázku je
       Vue v-if — klon se synchronizuje MutationObserverem),
    3. label „Množství" nad stepperem,
    4. datum doručení — u neponožkového zboží „Zboží bude u vás" místo
       nativního „Ponožky budou u vás"; + pojistka zvýraznění data,
    5. plovoucí „Přidat do košíku" na mobilu,
    6. taby → accordion pod galerií v levém sloupci (klasický: jedna otevřená
       naráz, po načtení `TAB_OPEN` = Složení) + statické sekce z `TAB_STATIC`
       (Materiál a péče, Doprava a vrácení, Časté dotazy) — TEXTY SE DOPLŇUJÍ
       TAM, pořadí řídí `TAB_ORDER`, `TAB_HIDE` schová nechtěná nativní ouška,
    7. YouTube preview → tmavá karta s vlastním play tlačítkem (facade;
       skutečný iframe až po kliknutí),
    8. sticky offset pravého sloupce — negativní `top` (CSS proměnná
       --pd-sticky-top), aby se sloupec zastavil SPODNÍ hranou u spodní hrany
       viewportu (viditelný košík + benefity), dokud levý delší sloupec
       doscrolluje; přepočet při změně výšky sloupce i viewportu,
    9. „Zvýhodněné balení" (additional-services) — nativní odkaz na set má
       target="_blank"; sundáme ho, ať klikací karta (styl v CSS) otevírá set
       ve STEJNÉM okně,
   10. „Zákazníci také nakupují" — nativní owl karusel s ochuzenými dlaždicemi
       přestavíme na STEJNÉ karty jako ve výpisu kategorie (vč. tlačítka
       „Přidat do košíku") ve vlastním scroll-snap slideru se šipkami,
   11. cena zůstává jednotková i při zvýšení množství (odpojení nativního
       přepočtu `do_recalculate_price`).

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

  var TITLE = "Přes 130 000 spokojených zákazníků";
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

    /* Karty staticky vedle sebe (dle návrhu): desktop 3, mobil 2 — žádný
       marquee jako v patičce a na HP. Rozložení řeší CSS gridem nad
       .vp-recenze--pd .vp-recenze__set, třetí karta se na mobilu skryje. */
    var set = document.createElement("div");
    set.className = "vp-recenze__set";
    REVIEWS.forEach(function (r) { set.appendChild(reviewCard(r)); });

    wrap.appendChild(head);
    wrap.appendChild(set);
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

  /* == 4) Datum doručení: zvýraznění + text podle druhu zboží ==========
     Platforma píše natvrdo „Ponožky budou u vás: 17.08." i u triček,
     boxerek nebo dárkových setů. U neponožkového zboží text měníme na
     „Zboží bude u vás:". Rozhodujeme podle názvu produktu (H1) — kategorii
     na detailu spolehlivě k dispozici nemáme. Datum (span) zůstává. */

  var SOCK_RE = /ponožk|podkolenk/i;

  function fixDeliveryLabel(root) {
    var dd = root.querySelector("p.delivery-date");
    if (!dd) return;
    var h1 = root.querySelector(".product-right-content h1") || root.querySelector("h1");
    var name = h1 ? (h1.textContent || "") : "";
    if (!name || SOCK_RE.test(name)) return;      // ponožky → nativní text sedí

    var nodes = Array.prototype.slice.call(dd.childNodes);
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.nodeType !== 3) continue;          // jen textové uzly, span s datem neřešíme
      if (node.nodeValue.indexOf("Ponožky budou u vás") === -1) continue;
      node.nodeValue = node.nodeValue.replace("Ponožky budou u vás", "Zboží bude u vás");
      break;
    }
  }

  /* == 4b) Pojistka: zvýraznění data doručení ========================== */

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
  /* == Nevybraná varianta: zatřást výběrem velikosti ====================
     Zámek z admin položky `10-force-variant-selection.html` dává tlačítku
     `.forced-disabled` s `pointer-events: none`. Klik tedy nevyvolá vůbec nic
     — zákazník klikne a nestane se nic, což vypadá jako rozbitý eshop.
     (Hláška „Nejprve vyberte variantu." v DOM je, ale je nad tlačítkem
     a snadno se přehlédne.)

     `pointer-events: none` NEODSTRAŇUJEME: kdyby se tenhle skript nenačetl,
     tlačítko by bylo aktivní a přidalo předvybranou variantu — přesně to,
     čemu zámek brání. Bezpečný směr selhání má přednost.

     Místo toho využijeme, že klik díky `pointer-events: none` propadne na
     rodiče `.product-add-to-shopping-basket-wrapper` (ověřeno živě přes
     elementFromPoint). Posloucháme tedy na wrapperu. */
  function nudgeVariantPicker() {
    var r = app();
    if (!r) return;
    var picker =
      r.querySelector("#variant-table-anchor") ||
      r.querySelector("#configurator-variants") ||
      r.querySelector("#variant-selector");
    if (!picker) return;

    picker.scrollIntoView({ behavior: "smooth", block: "center" });

    // Třídu je nutné sundat, jinak se animace podruhé nespustí.
    picker.classList.remove("pd-shake");
    if (!picker.dataset.vpShake) {
      picker.dataset.vpShake = "1";
      picker.addEventListener("animationend", function () {
        picker.classList.remove("pd-shake");
      });
    }
    void picker.offsetWidth;   // vynutit reflow mezi odebráním a přidáním
    picker.classList.add("pd-shake");

    var note = r.querySelector(".variant-selection-note");
    if (note) {
      note.classList.remove("pd-note-flash");
      void note.offsetWidth;
      note.classList.add("pd-note-flash");
    }
  }

  function watchLockedCta() {
    var r = app();
    if (!r) return;
    var wrap = r.querySelector(".product-add-to-shopping-basket-wrapper");
    if (!wrap || wrap.dataset.vpLockedCta) return;
    wrap.dataset.vpLockedCta = "1";

    wrap.addEventListener("click", function (e) {
      if (!r.classList.contains("variant-selection-required")) return;
      // Klik na tlačítka množství uvnitř wrapperu má vlastní target —
      // nás zajímá jen „propadlý" klik ze zakázaného tlačítka.
      if (e.target !== wrap) return;
      var btn = wrap.querySelector(".product-add-to-shopping-basket");
      if (!btn) return;
      // ...a jen když padl opravdu do plochy tlačítka, ne do paddingu wrapperu
      var b = btn.getBoundingClientRect();
      if (e.clientY < b.top || e.clientY > b.bottom) return;
      nudgeVariantPicker();
    });
  }

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
          nudgeVariantPicker();   // odscrolluje k výběru a zatřese jím
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
     (otevřená vždy jen JEDNA sekce, po načtení `TAB_OPEN`), vloží ho na konec
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
    "Popis": "Složení"
  };

  // Nativní ouška, která do accordionu NEPATŘÍ (obsah zůstane skrytý v tabech).
  var TAB_HIDE = ["Parametry"];

  // Sekce otevřená po načtení stránky; accordion jinak startuje celý zavřený.
  var TAB_OPEN = "Složení";

  // Doprava — stejné metody, ceny a hranice dopravy zdarma, jaké zákazník
  // uvidí v košíku (ověřeno na /cart). PŘI ZMĚNĚ V ADMINISTRACI UPRAVIT I TADY
  // (a taky v src/content/doprava.html, kde je stejný seznam).
  var SHIPPING = [
    { name: "Balíkovna na výdejní místa", note: "Zdarma nad 999 Kč", price: "79 Kč" },
    { name: "Zásilkovna – výdejní místa a boxy", note: "Zdarma nad 999 Kč", price: "69 Kč" },
    { name: "Alzaboxy a výdejní místa PPL", note: "Zdarma nad 999 Kč", price: "79 Kč" },
    { name: "Balíkovna – doručení domů", note: "Zdarma nad 1 499 Kč", price: "119 Kč" },
    { name: "PPL – doručení domů", note: "Zdarma nad 1 499 Kč", price: "129 Kč" }
  ];

  function shippingHtml() {
    var rows = SHIPPING.map(function (s) {
      return (
        '<div class="pd-ship__row">' +
        '<div class="pd-ship__name">' + s.name +
        '<span class="pd-ship__note">' + s.note + "</span></div>" +
        '<div class="pd-ship__price">' + s.price + "</div>" +
        "</div>"
      );
    });
    return '<div class="pd-ship">' + rows.join("") + "</div>";
  }

  // Statické sekce accordionu — stejné u všech produktů.
  // Prázdné `html` = sekce se vykreslí a jde rozkliknout, jen zatím nemá obsah.
  // AŽ DORAZÍ TEXTY, stačí je vepsat sem (HTML: <p>, <ul>, <strong>…)
  // a bumpnout hash skriptu v admin položce „Produktový detail".
  var TAB_STATIC = [
    { label: "Materiál a péče", html: "" },
    { label: "Doprava a vrácení", html: shippingHtml() },
    { label: "Časté dotazy", html: "" }
  ];

  // Pořadí sekcí. Co v seznamu není (třeba nový nativní tab z administrace),
  // se zařadí na konec v původním pořadí — nic se nikdy neztratí.
  var TAB_ORDER = [
    "Složení",
    "Materiál a péče",
    "Doprava a vrácení",
    "Časté dotazy"
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
        if (TAB_HIDE.indexOf(label) !== -1) return;                     // ouško, které do accordionu nechceme
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
        item.className = "pd-accordion__item";
        if (sec.label === TAB_OPEN) item.classList.add("is-open");  // otevřená po načtení
        if (!sec.html.trim()) item.classList.add("is-empty");       // sekce čekající na text

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
      /* Náhledový obrázek přímo z YouTube; modrý přeliv přes něj kreslí CSS
         (.pd-yt-facade::before). hqdefault existuje u každého videa —
         maxresdefault u starších ne a vrátil by šedou placeholder grafiku. */
      facade.style.backgroundImage =
        'url("https://img.youtube.com/vi/' + id + '/hqdefault.jpg")';
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

    /* Cena balení: platforma píše „+ 359 Kč" (plus + nedělitelné mezery).
       Přání: bez plusu. Span obsahuje jen text („?" tooltip je sourozenec),
       takže se dá přepsat textContent. Idempotentní — po odebrání už
       regulárka nematchne. */
    var prices = root.querySelectorAll(".additional-services-price-js");
    for (var j = 0; j < prices.length; j++) {
      var txt = prices[j].textContent;
      var next = txt.replace(/^\s*\+\s*/, "");   // \s v JS pokrývá i nedělitelnou mezeru
      if (next !== txt) prices[j].textContent = next;
    }
  }

  /* == 10) „Zákazníci také nakupují" → karty jako ve výpisu kategorie ====
     Nativně je blok `#products_category.itembox` owl karusel s ochuzenou
     dlaždicí (obrázek + název + cena, bez košíku). Přestavíme ho na STEJNÉ
     karty jako ve výpisu (`.products .product`, styl 25-products.css)
     v našem scroll-snap slideru (styl `.vp-also` v 24-product-detail.css).

     PROČ PŘESTAVBA A NE RESTYL OWLU: šablona má
     `.itembox .itembox-content * { padding: 0 !important }` — kartě uvnitř
     karuselu by to vynulovalo VŠECHNY paddingy (tlačítko, pilulky, obsah).
     Postavit karty mimo `.itembox` je levnější než přebíjet každý padding,
     a navíc odpadá boj s inline šířkami, které owl sype do `.owl-item`.

     CO DLAŽDICE NEMÁ (a karta to proto nemá také): přeškrtnutá původní cena,
     datum doručení a chipy velikostí — platforma je do tohoto bloku
     nerenderuje. Dopočítat starou cenu z procenta slevy nejde (procento je
     zaokrouhlené → hrozí zobrazení nesprávné „původní ceny“), dotáhnout data
     ze serveru by znamenalo 10 requestů na detail produktu.

     TLAČÍTKO je přesně ten prvek, který má karta ve výpisu:
     `.add-to-cart-js-variants` + `data-url`. Delegovaný handler šablony
     (FrontendEshop.js) na klik udělá `location.href = data-url`, tedy proklik
     na detail k výběru velikosti. Ve výpisu kategorie mají tenhle tvar
     všechny karty (sortiment je variantní), takže se chová identicky.

     Blok NENÍ uvnitř #app.product-detail — sedí v section.row-fluid
     .product_footer, proto se hledá přes document. */

  var ALSO_TITLE = "Zákazníci také nakupují";   // fallback, když h2 chybí
  var ALSO_CTA = "Přidat do košíku";
  var alsoState = { section: null };

  function alsoCard(item) {
    var link = item.querySelector("a.product_name") || item.querySelector("a[href]");
    if (!link) return null;
    var href = link.getAttribute("href") || "";
    var name = (link.textContent || "").replace(/\s+/g, " ").trim();
    if (!href || !name) return null;

    var card = document.createElement("a");
    card.href = href;
    /* p-view-mob-two_column = mobilní režim výpisu (šablona: nižší figure;
       25-products.css: menší tlačítko) — slider ukazuje na mobilu taky 2 karty */
    card.className = "product p-view-mob-two_column vp-also__card";

    var border = document.createElement("div");
    border.className = "product-border";

    var fig = document.createElement("figure");
    var src = item.querySelector("img");
    if (src) {
      var img = document.createElement("img");
      img.src = src.getAttribute("src") || "";
      img.alt = name;
      img.loading = "lazy";
      fig.appendChild(img);
    }

    /* Slevový badge je v dlaždici uvnitř .itembox-strips, na kartě patří do
       figure. Inline style = přesně jak ho renderuje výpis (25-products.css ho
       pak přebíjí do pravého horního rohu), ať se karty chovají stejně. */
    var disc = item.querySelector(".itembox-strips .discount-percentage");
    if (disc) {
      var badge = document.createElement("div");
      badge.className = "discount-percentage d-flex align-self-start align-items-center justify-content-center";
      badge.setAttribute("style", "position:absolute;right:10px;bottom:0;");
      badge.textContent = (disc.textContent || "").replace(/\s+/g, " ").trim();
      fig.appendChild(badge);
    }

    var text = document.createElement("div");
    text.className = "product-text-content";

    /* Kontejner štítků: „V KOŠÍKU“ do něj doplní 30-product-cards.js (jeho
       MutationObserver reaguje na přidané .product), admin stripy typu NOVINKA
       přeneseme z dlaždice. Prázdný kontejner CSS skryje. */
    var stripes = document.createElement("div");
    stripes.className = "product-stripes product-stripes-on-list flags";
    var strips = item.querySelectorAll(".itembox-strips > *");
    Array.prototype.forEach.call(strips, function (s) {
      if (s.classList.contains("discount-strip")) return;   // slevu už máme ve figure
      stripes.appendChild(s.cloneNode(true));
    });
    text.appendChild(stripes);

    var content = document.createElement("div");
    content.className = "product-content";
    var h2 = document.createElement("h2");
    h2.textContent = name;             // na 2 řádky rozdělí 30-product-cards.js
    content.appendChild(h2);
    text.appendChild(content);

    var footer = document.createElement("div");
    footer.className = "product-footer";

    var priceBox = document.createElement("div");
    priceBox.className = "product-price flex-grow-1";
    var priceSrc = item.querySelector(".itembox-price");
    if (priceSrc) {
      var our = document.createElement("span");
      our.className = "product-price-our";
      our.appendChild(document.createTextNode((priceSrc.textContent || "").trim() + " "));
      var cur = document.createElement("span");
      cur.className = "product-price-currency";
      var curSrc = item.querySelector(".itembox-currency");
      cur.textContent = curSrc ? (curSrc.textContent || "").trim() : "Kč";
      our.appendChild(cur);
      priceBox.appendChild(our);
    }
    footer.appendChild(priceBox);

    var group = document.createElement("div");
    group.className = "add-to-cart-group";
    var btn = document.createElement("div");
    btn.className = "product-add-to-shopping-basket sprite-after add-to-cart-js-variants btn btn-primary";
    btn.setAttribute("data-url", href);
    var label = document.createElement("span");
    label.className = "shopping-basket-icon show_variant_button";
    label.textContent = ALSO_CTA;
    btn.appendChild(label);
    group.appendChild(btn);
    footer.appendChild(group);

    text.appendChild(footer);
    border.appendChild(fig);
    border.appendChild(text);
    card.appendChild(border);
    return card;
  }

  function alsoArrow(dir, label) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "vp-also__arrow vp-also__arrow--" + dir;
    b.setAttribute("aria-label", label);
    var i = document.createElement("i");
    // ikonový font Bootstrap Icons je v šabloně (owl navText ho používá taky)
    i.className = "bi bi-chevron-" + (dir === "prev" ? "left" : "right");
    i.setAttribute("aria-hidden", "true");
    b.appendChild(i);
    return b;
  }

  function alsoSyncNav(section) {
    var vp = section.querySelector(".vp-also__viewport");
    if (!vp) return;
    var max = vp.scrollWidth - vp.clientWidth;
    section.classList.toggle("is-static", max <= 1);       // vejde se → šipky pryč
    section.querySelector(".vp-also__arrow--prev").disabled = vp.scrollLeft <= 1;
    section.querySelector(".vp-also__arrow--next").disabled = vp.scrollLeft >= max - 1;
  }

  function buildAlsoBought() {
    var box = document.getElementById("products_category");
    if (!box) return;                                       // hotovo / blok není
    var items = box.querySelectorAll(".itembox-item");
    if (!items.length) return;

    var cards = [];
    Array.prototype.forEach.call(items, function (it) {
      var c = alsoCard(it);
      if (c) cards.push(c);
    });
    if (!cards.length) return;                              // radši nechat nativní blok

    var titleEl = box.querySelector("h2");
    var section = document.createElement("section");
    section.className = "vp-also";

    var head = document.createElement("div");
    head.className = "vp-also__head";
    var h = document.createElement("h2");
    h.className = "vp-also__title";
    h.textContent = (titleEl && (titleEl.textContent || "").trim()) || ALSO_TITLE;
    head.appendChild(h);

    var nav = document.createElement("div");
    nav.className = "vp-also__nav";
    var prev = alsoArrow("prev", "Předchozí produkty");
    var next = alsoArrow("next", "Další produkty");
    nav.appendChild(prev);
    nav.appendChild(next);
    head.appendChild(nav);

    var viewport = document.createElement("div");
    viewport.className = "vp-also__viewport products";
    cards.forEach(function (c) { viewport.appendChild(c); });

    section.appendChild(head);
    section.appendChild(viewport);

    /* Owl korektně zrušit (drží si resize handlery na window), teprve pak
       nativní blok pryč. Bez `.itembox` v DOM už ho ani zpožděné
       FrontendShared.refreshOwlCarousels() na `load` nenajde. */
    if (window.jQuery) {
      var owl = box.querySelector(".owl-carousel");
      if (owl) { try { window.jQuery(owl).trigger("destroy.owl.carousel"); } catch (e) {} }
    }
    box.parentNode.insertBefore(section, box);
    box.parentNode.removeChild(box);

    // posun o jednu „stránku“; snap zarovná na nejbližší kartu
    prev.addEventListener("click", function () { viewport.scrollBy({ left: -viewport.clientWidth, behavior: "smooth" }); });
    next.addEventListener("click", function () { viewport.scrollBy({ left: viewport.clientWidth, behavior: "smooth" }); });
    viewport.addEventListener("scroll", function () { alsoSyncNav(section); });
    alsoState.section = section;
    alsoSyncNav(section);
  }

  /* == 11) Cena zůstává jednotková i při změně množství =================
     Platforma při změně množství pošle na server přepočet
       POST /recalculate_price/<pid>/<qty>            (produkt bez variant)
       POST /recalculate_price_variant/<pid>-<vid>/<qty>  (varianta)
     a odpovědí přepíše cenu, takže místo ceny za kus svítí cena za celé
     množství (i přeškrtnutá původní). Přání: cena zůstává jednotková.

     Odpojit handler nestačí — u variant zapisuje cenu přímo Vue z odpovědi
     (ověřeno živě: `$(document).off("do_recalculate_price")` i
     `off("configurator_price_changed")` cenu nezastaví). Proto místo boje
     o zápis měníme DOTAZ: množství v URL přepisujeme na 1, takže server
     vrátí jednotkovou cenu a všechno ostatní (Vue, přeškrtnutá cena,
     text slevy) zůstává konzistentní — žádné přepisování ani problikávání.
     Do košíku jde množství z inputu, to se nemění.

     Patchujeme XHR i fetch (nevíme, čím platforma request pošle) — jednou,
     idempotentně. */

  var QTY_URL_RE = /(\/recalculate_price(?:_variant)?\/[^/?#]+\/)\d+/;

  function freezeQtyInUrl(url) {
    return typeof url === "string" ? url.replace(QTY_URL_RE, "$11") : url;
  }

  function freezeUnitPrice() {
    if (window.__vpUnitPriceFrozen) return;
    window.__vpUnitPriceFrozen = true;

    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
      var args = Array.prototype.slice.call(arguments);
      args[1] = freezeQtyInUrl(args[1]);
      return open.apply(this, args);
    };

    if (typeof window.fetch === "function") {
      var fetch0 = window.fetch;
      window.fetch = function (input, init) {
        if (typeof input === "string") {
          input = freezeQtyInUrl(input);
        } else if (input && typeof input.url === "string" && typeof Request === "function") {
          var frozen = freezeQtyInUrl(input.url);
          if (frozen !== input.url) input = new Request(frozen, input);
        }
        return fetch0.call(this, input, init);
      };
    }
  }

  /* == Orchestrace ===================================================== */

  function runAll() {
    var root = app();
    if (!root) return;
    injectReviews(root);
    syncDiscountPill(root);
    injectQtyLabel(root);
    fixDeliveryLabel(root);
    ensureDeliveryDateSpan(root);
    freezeUnitPrice();
    watchLockedCta();
    ensureStickyCta(root);
    buildTabsAccordion(root);
    enhanceYoutube();
    updateStickyOffset(root);
    fixAdditionalServicesLink(root);
    buildAlsoBought();
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
    // a stav šipek slideru „Zákazníci také nakupují" (bod 10 — mění se
    // počet karet na obrazovku, tedy i jestli je vůbec co posouvat)
    var rz = null;
    window.addEventListener("resize", function () {
      clearTimeout(rz);
      rz = setTimeout(function () {
        var r = app();
        if (r) updateStickyOffset(r);
        if (alsoState.section) alsoSyncNav(alsoState.section);
      }, 120);
    });

    // Blok „Zákazníci také nakupují" je pod hlavním obsahem a owl ho může
    // dorenderovat až po `load` — pojistka, kdyby runAll v prvních 2 s minul.
    window.addEventListener("load", buildAlsoBought);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
