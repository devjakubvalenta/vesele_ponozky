/* Veselé ponožky — pokladna
 * Položka v admin „Skripty": Pokladna (dopravy a platby) — Na všech stránkách, patička.
 * Styl dodává src/css/10-checkout.css (.vp-lbl*, .vp-optout, .vp-save*).
 *
 * Skript dělá šest věcí; každá má svůj komentář níž:
 *   1. řádky dopravy a platby (název vlevo, cena vpravo)          — labels
 *   2. skupina „výdejní místa a boxy" jako první                  — orderShippingGroups
 *   3. souhlasy novinky/dotazník překlopené na „Nesouhlasím"      — optOutConsents
 *   4. zapamatování doplňkových služeb (Dýško) přes refresh       — services
 *   5. sleva u položky i na mobilu (úspora + procenta)            — cartSavings
 *   6. položky košíku seřazené od nejlevnější (cena za kus)       — sortCartByPrice
 *
 * ---------------------------------------------------------------------------
 * 1) ŘÁDKY DOPRAVY A PLATBY
 *
 * Co to řeší:
 * Název metody je v šabloně HOLÝ TEXTOVÝ UZEL uvnitř .label-shipping-text
 * („Balíkovna - doručení domů - ZDARMA NAD 1499 Kč - " a hned za ním
 * <span class="price_span">119</span> <span class="price_span_currency">Kč</span>).
 * Z textového uzlu je ve flexu anonymní flex item — nejde mu nastavit
 * min-width: 0, takže dlouhý název zabral celý řádek a cenu vytlačil pod sebe
 * (na mobilu 2–3 řádky a „rozhozená" dlaždice).
 *
 * Skript text obalí do <span class="vp-lbl">, vyzobne z něj poznámku
 * „- ZDARMA NAD 1499 Kč -" do samostatného řádku .vp-lbl-free („Zdarma nad
 * 1499 Kč", modře) a ořízne osiřelé pomlčky na konci („Na dobírku - ").
 * Cena tak zůstane na svém řádku vpravo a název se láme pod ni.
 *
 * Idempotentní (data-vp-lbl), MutationObserver pokrývá překreslení seznamu
 * dopravy/plateb po změně košíku i změnu ceny na „ZDARMA“ (třída .vp-free).
 */
(function () {
  'use strict';

  if (window.__vpCheckoutLabels) return;
  window.__vpCheckoutLabels = true;

  /* „- ZDARMA NAD 1499 Kč -“ kdekoli v názvu (admin to píše do názvu metody) */
  var FREE_RE = /\s*[-–—]?\s*zdarma\s+nad\s+([0-9][0-9\s.,]*)\s*k[čc]\s*/i;

  function tidy(s) {
    return s.replace(/\s+/g, ' ').replace(/^[\s\-–—]+/, '').replace(/[\s\-–—]+$/, '').trim();
  }

  /* Textové uzly PŘED prvním elementem (za ním už jsou jen ceny a info ikonka) */
  function leadingTextNodes(box) {
    var out = [];
    for (var i = 0; i < box.childNodes.length; i++) {
      var n = box.childNodes[i];
      if (n.nodeType === 1) break;
      if (n.nodeType === 3) out.push(n);
    }
    return out;
  }

  function build(box) {
    if (box.dataset.vpLbl) return;

    var nodes = leadingTextNodes(box);
    var raw = nodes.map(function (n) { return n.nodeValue; }).join('');
    if (!tidy(raw)) return;

    var free = '';
    var m = raw.match(FREE_RE);
    if (m) {
      free = 'Zdarma nad ' + m[1].trim() + ' Kč';
      raw = raw.replace(FREE_RE, ' ');
    }

    var wrap = document.createElement('span');
    wrap.className = 'vp-lbl';

    var title = document.createElement('span');
    title.className = 'vp-lbl-title';
    title.textContent = tidy(raw);
    wrap.appendChild(title);

    if (free) {
      var note = document.createElement('span');
      note.className = 'vp-lbl-free';
      note.textContent = free;
      wrap.appendChild(note);
    }

    box.insertBefore(wrap, nodes[0]);
    nodes.forEach(function (n) { n.parentNode.removeChild(n); });
    box.dataset.vpLbl = '1';
  }

  /* Když platforma přepne cenu na „ZDARMA“ (překročený limit), obarvit zeleně
     jako u plateb — hodnota se mění za běhu, proto se to přepočítává. */
  function markFree(box) {
    var price = box.querySelector('.price_span');
    var isFree = !!price && price.textContent.trim().toUpperCase() === 'ZDARMA';
    box.classList.toggle('vp-free', isFree);
  }

  /* =========================================================================
     2) POŘADÍ SKUPIN DOPRAVY — výdejní místa a boxy nahoru

     Šablona renderuje obě skupiny do JEDNOHO sloupce jako ploché sourozence:
       .shippings_divided > .col-md-6 > h4 „Doprava na adresu" + ul
                                      + h4 „Doprava na výdejní místo a do boxu" + ul
     Nadpis a jeho seznam nejsou nijak obalené, takže se na to nedá pustit CSS
     `order` (musely by se párovat dva sourozenci) — přesouváme uzly.

     Přesouvá se jen jednou (data-vp-order na sloupci); MutationObserver by
     jinak po každém překreslení seznamu dopravy pořadí přepočítával. */
  var PICKUP_RE = /výdejn|box/i;

  function orderShippingGroups() {
    var col = document.querySelector('.shippings_divided > .col-md-6:not(.payment-select)');
    if (!col || col.dataset.vpOrder) return;

    var heads = col.querySelectorAll(':scope > h4');
    if (heads.length < 2) return;

    for (var i = 0; i < heads.length; i++) {
      if (!PICKUP_RE.test(heads[i].textContent || '')) continue;
      var list = heads[i].nextElementSibling;
      if (!list || list.tagName !== 'UL') break;
      if (col.firstElementChild !== heads[i]) {
        col.insertBefore(heads[i], col.firstElementChild);
        col.insertBefore(list, heads[i].nextSibling);
      }
      break;
    }
    col.dataset.vpOrder = '1';
  }

  /* =========================================================================
     3) SOUHLASY — „Nesouhlasím", nezaškrtnuté, e-mailing dál funguje

     Šablona renderuje tři `.terms_checkboxes_div` (obchodní podmínky +
     novinky + dotazník spokojenosti). Volitelné dva jsou nativně PŘEDzaškrtnuté
     a znamenají „souhlasím".

     Zadání: zákazník má vidět prázdné políčko s textem „Nesouhlasím…", ale
     obchod má souhlas dál dostávat. Logika se tedy obrací:
       viditelný (proxy) checkbox NEzaškrtnutý  →  reálný checkbox zaškrtnutý
       viditelný zaškrtnutý („nesouhlasím")     →  reálný odškrtnutý
     Reálný input zůstává ve formuláři (jen vizuálně schovaný v CSS), aby se
     odeslal; `for` na popisku se přepne na proxy, jinak by klik na text
     přepínal schovaný input.

     Když se skript nenačte, zůstane nativní stav („Souhlasím", zaškrtnuto) —
     tedy bezpečný směr selhání, žádný souhlas navíc.

     Obchodní podmínky (checkbox_op, required) se NEMĚNÍ. */
  var OPT_OUT = ['checkbox_newsletter', 'checkbox_heureka'];

  function optOutConsent(real) {
    var row = real.closest('.terms_checkboxes_div');
    if (!row || row.dataset.vpOptout) return;
    row.dataset.vpOptout = '1';

    var label = row.querySelector('label[for="' + real.id + '"]');
    if (!label) return;

    /* „Souhlasím se zasíláním…" / „Souhlasím se zasláním…" → „Nesouhlasím…"
       Popisek je čistě textový, odkaz na podmínky je až za ním jako <a>. */
    label.textContent = label.textContent.replace(/^\s*Souhlas/, 'Nesouhlas');

    var proxy = document.createElement('input');
    proxy.type = 'checkbox';
    proxy.className = 'form-check-input vp-optout';
    proxy.id = 'vp-optout-' + real.id;
    proxy.checked = !real.checked;
    label.setAttribute('for', proxy.id);

    real.classList.add('vp-optout-real');
    real.setAttribute('aria-hidden', 'true');
    real.tabIndex = -1;

    proxy.addEventListener('change', function () {
      real.checked = !proxy.checked;
      real.dispatchEvent(new Event('change', { bubbles: true }));
    });

    row.insertBefore(proxy, real);
  }

  function optOutConsents() {
    for (var i = 0; i < OPT_OUT.length; i++) {
      var real = document.getElementById(OPT_OUT[i]);
      if (real) optOutConsent(real);
    }
  }

  /* =========================================================================
     4) DOPLŇKOVÉ SLUŽBY (Dýško) — zapamatovat volbu přes refresh

     Platforma volbu doplňkové služby nedrží: po F5 se panel vykreslí
     odškrtnutý a částka z rekapitulace zmizí (ověřeno: 196 → 157 Kč).

     Stav si držíme v sessionStorage — ne v localStorage: tichý návrat placené
     položky po dnech je horší než to, že se zapomene po zavření karty.

     Obnovuje se KLIKEM, ne `checked = true`. Platforma na klik pošle přepočet;
     samotné nastavení vlastnosti by nechalo zaškrtnuté políčko u nezaplacené
     služby, což je horší než dnešní stav. Klikáme jen jednou za načtení
     stránky (restored), ať se to nepere se zákazníkem ani s observerem. */
  var SERVICES_KEY = 'vp-services';
  var restored = false;

  function readServices() {
    try { return JSON.parse(sessionStorage.getItem(SERVICES_KEY)) || {}; }
    catch (e) { return {}; }
  }

  function writeServices(map) {
    try { sessionStorage.setItem(SERVICES_KEY, JSON.stringify(map)); } catch (e) {}
  }

  function watchServices() {
    document.addEventListener('change', function (e) {
      var el = e.target;
      if (!el || !el.classList || !el.classList.contains('additional_service')) return;
      var map = readServices();
      map[el.id] = el.checked;
      writeServices(map);
    });
  }

  function restoreServices() {
    if (restored) return;
    var inputs = document.querySelectorAll('input.additional_service');
    if (!inputs.length) return;
    restored = true;

    var map = readServices();
    for (var i = 0; i < inputs.length; i++) {
      if (map[inputs[i].id] === true && !inputs[i].checked) inputs[i].click();
    }
  }

  /* =========================================================================
     5) SLEVA U POLOŽKY I NA MOBILU

     Sloupec „Cena/Pár" má od šablony `d-none d-lg-block`, takže pod 992 px
     zmizí — a s ním přeškrtnutá cena i pilulka „-80 %". Zákazník na mobilu
     o slevě vůbec nevěděl.

     Nedá se prostě odkrýt: je to cena ZA PÁR, kdežto viditelná částka vedle je
     CELKEM za řádek. Při množství 1 by se zdvojily, při množství 3 by si
     odporovaly. Dopočítáme proto přeškrtnutou cenu za celý řádek z dat, která
     šablona dává na input množství (data-old-price × ks), a vedle ni dáme
     nativní pilulku se slevou.

     Zapisuje se jen při skutečné změně textu — observer nad .main-order-form
     by jinak reagoval na vlastní zápis a točil se dokola. */
  function fmtPrice(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč';
  }

  function cartSaving(row) {
    var qty = row.querySelector('input.cart_quantity');
    var total = row.querySelector('.total-item-price');
    if (!qty || !total) return;

    var old = parseFloat(qty.getAttribute('data-old-price'));
    var count = parseInt(qty.value, 10);
    var pill = row.querySelector('.prices-col .discount-percentage');

    var box = total.querySelector(':scope > .vp-save');
    if (!(old > 0) || !(count > 0) || !pill) {     // bez slevy není co ukazovat
      if (box) box.remove();
      return;
    }

    if (!box) {
      box = document.createElement('div');
      box.className = 'vp-save';
      box.innerHTML = '<span class="vp-save-old"></span><span class="vp-save-pct"></span>';
      total.insertBefore(box, total.firstChild);
    }

    var oldText = fmtPrice(old * count);
    var pctText = (pill.textContent || '').trim();
    var oldEl = box.firstChild, pctEl = box.lastChild;
    if (oldEl.textContent !== oldText) oldEl.textContent = oldText;
    if (pctEl.textContent !== pctText) pctEl.textContent = pctText;
  }

  function cartSavings(root) {
    var rows = (root || document).querySelectorAll('.main-order-form .cart-product');
    for (var i = 0; i < rows.length; i++) cartSaving(rows[i]);
  }

  /* =========================================================================
     6) ŘAZENÍ POLOŽEK V KOŠÍKU OD NEJLEVNĚJŠÍ

     Šablona řadí položky podle pořadí vložení. Řadíme podle CENY ZA KUS
     (`data-price` na inputu množství), ne podle částky za řádek — jinak by
     levný produkt v deseti kusech spadl na konec a pořadí by se přeskládalo
     při každé změně množství.

     Řádky jsou ploší sourozenci ve .main-order-form, prokládané oddělovači
     .separator — proto se každý řádek přesouvá i se svým oddělovačem, jinak
     by čáry zůstaly na původních místech.

     ⚠️ Idempotence tu není kosmetika: observer v init() sleduje childList nad
     .main-order-form, takže každý insertBefore by ho spustil znovu. Když už
     pořadí sedí, funkce se musí vrátit BEZ zápisu do DOM — jinak nekonečná
     smyčka. Guard přes data-* (jako u orderShippingGroups) se nehodí: po
     smazání položky nebo změně ceny se pořadí musí přepočítat. */
  function sortCartByPrice() {
    var form = document.querySelector('.main-order-form');
    if (!form) return;

    var rows = form.querySelectorAll(':scope > .cart-product');
    if (rows.length < 2) return;

    var items = [];
    for (var i = 0; i < rows.length; i++) {
      var qty = rows[i].querySelector('input.cart_quantity');
      var price = qty ? parseFloat(qty.getAttribute('data-price')) : NaN;
      // Oddělovač patřící k řádku (bývá hned za ním) se veze s sebou.
      var sep = rows[i].nextElementSibling;
      if (!sep || sep.className.indexOf('separator') === -1) sep = null;
      items.push({
        row: rows[i],
        sep: sep,
        // bez ceny na konec; index drží stabilitu při shodných cenách
        key: isFinite(price) ? price : Infinity,
        index: i
      });
    }

    var sorted = items.slice().sort(function (a, b) {
      return (a.key - b.key) || (a.index - b.index);
    });

    // Už seřazeno? Nesahat na DOM.
    var same = true;
    for (var s = 0; s < sorted.length; s++) {
      if (sorted[s].index !== s) { same = false; break; }
    }
    if (same) return;

    /* Kotva musí být uzel, který se NEPŘESOUVÁ — jinak by se pořadí zvrtlo
       (kotva = první řádek by po prvním insertBefore zůstala vpředu a zbytek
       by se skládal před ni). Bereme první uzel ZA celým blokem položek,
       typicky `.row.total-price`. Když tam nic není, radši nesaháme. */
    var last = items[items.length - 1];
    var anchor = (last.sep || last.row).nextSibling;
    if (!anchor) return;

    for (var k = 0; k < sorted.length; k++) {
      form.insertBefore(sorted[k].row, anchor);
      if (sorted[k].sep) form.insertBefore(sorted[k].sep, anchor);
    }
  }

  function run(root) {
    var boxes = (root || document).querySelectorAll('.shipping-tab .label-shipping-text');
    for (var i = 0; i < boxes.length; i++) {
      build(boxes[i]);
      markFree(boxes[i]);
    }
    orderShippingGroups();
    optOutConsents();
    sortCartByPrice();
    cartSavings(root);
  }

  function init() {
    if (!document.querySelector('.shipping_part, .payment-select')) return;
    watchServices();
    run(document);
    restoreServices();

    /* Sledovat jen formulář pokladny — ne celé body: `characterData` na body by
       chytalo i tikání odpočtu v liště (1× za sekundu zbytečný průchod). */
    var pending = false;
    var mo = new MutationObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; run(document); });
    });
    mo.observe(document.querySelector('.main-order-form') || document.body,
      { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
