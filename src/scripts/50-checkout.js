/* Veselé ponožky — pokladna: řádky dopravy a platby
 * Položka v admin „Skripty": Pokladna (dopravy a platby) — Na všech stránkách, patička.
 * Styl dodává src/css/10-checkout.css (.vp-lbl*).
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

  function run(root) {
    var boxes = (root || document).querySelectorAll('.shipping-tab .label-shipping-text');
    for (var i = 0; i < boxes.length; i++) {
      build(boxes[i]);
      markFree(boxes[i]);
    }
  }

  function init() {
    if (!document.querySelector('.shipping_part, .payment-select')) return;
    run(document);

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
