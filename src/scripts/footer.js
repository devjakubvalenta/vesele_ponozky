/* Patička Veselé ponožky — injektovaný obsah + mobilní accordion.
   Vkládá se 1× do Administrace → Skripty jako:
     <script src="https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@<hash>/src/scripts/footer.js"></script>
   PIN HASHEM jako ostatní položky — @main drží jsDelivr v cache i několik dní
   a purge @main tady spolehlivě nezabírá (viz CLAUDE.md / paměť projektu),
   takže se změna v patičce nemusí dlouho projevit.
   (Na všech stránkách; patička/Head je jedno — má DOM-ready guard.)
   Styl dodává src/css/30-footer.css (scope body footer / .vp-foot) přes CDN.

   Footer je statické HTML přímo pod <body> (ne SPA) → injekce přežije.
   Idempotentní (guard přes ID). Obsah recenzí/čísel se mění tady. */
(function () {
  "use strict";

  // Cesta k médiím je na obou doménách stejná (produkce veseleponozky.cz
  // i test exitshop.cz) → bez domény, ať se nic neváže na testovací web.
  var MEDIA = "/files/310/files/";
  var ASSET = {
    sockDesktop: MEDIA + "Pati%C4%8Dka_desktop.svg",
    sockMobile: MEDIA + "Pati%C4%8Dka_mobil.svg",
    logo: MEDIA + "vesel%C3%A9pono%C5%BEky_logo.svg",
    customers: MEDIA + "customers.svg",
    rating: MEDIA + "rating.svg",
    trust: MEDIA + "trust_badge.svg",
    stars: MEDIA + "Hv%C4%9Bzdi%C4%8Dky.svg",
    emoji: MEDIA + "emoji_recenze.svg",
    mascot: MEDIA + "maskot.svg",
    // fotka u kontaktu — SHODNÁ s zákaznickou linkou v hlavičce (header.js);
    // kulatý avatar 455×455, při změně vyměnit na obou místech
    advisor: MEDIA + "ikonka___call_centrum_kruh.svg"
  };

  // Platební loga v patičce. Comgate má v obchodních podmínkách POVINNOST
  // umístit do patičky e-shopu loga Visa a Mastercard; logo Comgate s odkazem
  // na platební bránu je doporučené (help.comgate.cz/docs/loga-a-udaje-na-webu).
  // Loga jsou INLINE SVG z oficiální sady Comgate (verzovaná kopie leží
  // v assets/pay/*.svg) — díky tomu pruh funguje bez nahrávání do médií a
  // nezávisí na dalším souboru na CDN. viewBox je oříznutý na obsah, aby loga
  // neplavala v prázdném okraji originálu. Styl: src/css/30-footer.css.
  var PAY_URL = "https://www.comgate.eu/cs/platebni-brana";
  var PAY_LOGO = {
    comgate:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 259 60" aria-hidden="true" focusable="false">' +
      '<path fill="#fff" d="M1 1h55v55H1Z"/>' +
      '<path fill="#ff1616" d="M0 0h60v60H0Zm21.576 22.5c1.183 0 3.252.195 4.828.584l.788-4.772c-1.773-.585-4.138-.877-5.714-.877-7.39 0-10.246 2.63-10.246 8.961v6.331c0 6.234 2.758 8.961 10.246 8.961 1.872 0 4.138-.292 5.714-.876l-.788-4.773a20.45 20.45 0 0 1-4.828.584c-3.448 0-4.433-.974-4.433-3.896V26.3c0-2.825 1.084-3.799 4.433-3.799zm24.828-.974c.788-.195 1.773-.487 2.562-.682v-2.922h-7.291c-1.28-.292-2.66-.487-4.04-.487-6.798 0-9.36 2.922-9.458 7.792v2.143c0 2.825.986 4.968 3.153 6.234-1.182.78-2.463 2.045-2.463 3.993 0 2.922 1.28 4.091 4.63 4.48 3.055.293 4.04.488 6.799.78 1.773.195 2.266.487 2.266 1.85 0 1.56-.986 1.851-5.715 1.851-2.66 0-5.32-.39-7.98-.974l-.69 4.384c2.66.779 6.306 1.168 9.064 1.168 8.867 0 10.64-1.948 10.64-6.915 0-3.312-1.181-5.163-5.024-5.65-2.758-.292-4.138-.487-6.798-.681-.887-.098-1.28-.39-1.28-.974 0-.682.59-1.364 1.379-1.851.492 0 .886.097 1.379.097 6.6 0 9.557-2.824 9.557-7.597v-2.143c.098-1.558-.197-2.922-.69-3.896Zm-4.73 3.896c0-2.24-1.083-3.214-4.039-3.214-2.857 0-3.94 1.071-3.94 3.214v1.753c0 2.338 1.182 3.117 3.94 3.117 2.76 0 4.04-.876 4.04-3.117zm81.632 8.515V27.38c0-5.264-2.488-10.23-11.349-10.23-8.86 0-11.25 4.867-11.25 10.23v6.556c0 5.264 2.39 10.23 11.25 10.23 8.96-.1 11.35-4.966 11.35-10.23zm-6.47-6.754v6.952c0 2.88-1.394 4.47-4.78 4.47-3.384 0-4.778-1.49-4.778-4.47v-6.952c0-2.88 1.394-4.47 4.779-4.47s4.778 1.49 4.778 4.47zm33.45 16.09V25.395c1.991-1.192 5.077-2.185 6.77-2.185 1.493 0 2.09.695 2.09 2.086v18.076h6.471V24.6c0-4.568-1.493-7.647-5.774-7.647-3.086 0-7.367 1.191-10.453 2.78-.797-1.787-2.39-2.78-4.878-2.78-2.987 0-7.069 1.092-10.354 2.681l-.597-2.185h-4.978v25.824h6.47V25.395c2.39-1.192 5.178-2.185 6.77-2.185 1.494 0 2.091.695 2.091 2.086v18.076h6.372zm30.663-7.25c7.168 0 10.354-3.179 10.354-8.443v-2.483c0-1.49-.3-2.88-.896-4.072.896-.298 1.99-.497 2.887-.795v-3.277h-8.064c-1.394-.398-2.887-.497-4.38-.497-7.567 0-10.354 3.278-10.454 8.641v2.483c0 3.178 1.195 5.562 3.484 6.953-1.294.894-2.787 2.284-2.787 4.37 0 3.278 1.493 4.47 5.077 4.966 3.286.397 4.58.497 7.467.894 1.99.199 2.489.497 2.489 2.086 0 1.688-1.095 2.086-6.173 2.086-2.986 0-5.873-.398-8.76-1.093l-.797 4.867c2.887.894 7.068 1.291 10.055 1.291 9.756 0 11.648-2.185 11.648-7.648 0-3.675-1.294-5.76-5.476-6.257-3.086-.298-4.679-.497-7.466-.795-1.095-.1-1.493-.397-1.493-1.092 0-.795.696-1.49 1.493-2.086.697-.1 1.294-.1 1.792-.1zm4.38-10.727v1.986c0 2.483-1.294 3.476-4.38 3.476s-4.38-.993-4.38-3.476v-1.986c0-2.483 1.194-3.576 4.38-3.576s4.38 1.192 4.38 3.576zm30.862.894c0-6.456-2.489-9.337-10.553-9.337-2.887 0-6.371.497-8.86 1.192l.797 4.966c2.29-.496 4.778-.794 7.167-.794 4.082 0 4.978.993 4.978 3.873v2.682h-6.272c-5.276 0-7.566 1.986-7.566 7.25 0 4.47 2.09 7.648 6.77 7.648 2.787 0 5.376-.794 7.765-2.284l.498 1.788h5.376zm-6.47 11.124c-1.494.894-3.187 1.291-4.879 1.291-2.09 0-2.588-.795-2.588-2.582 0-1.987.497-2.583 2.688-2.583h4.778zm25.386.496c-.996.298-2.09.497-3.186.497-1.692 0-2.39-.894-2.39-2.284V22.515h6.273l.398-5.165h-6.67V10l-6.471.894v6.456h-3.783v5.165h3.783v14.401c0 4.57 2.488 6.854 7.168 6.854 1.592 0 4.28-.398 5.674-.993zm9.557-4.072v-1.291H259v-5.562c0-5.562-1.792-10.429-10.155-10.429-8.263 0-10.652 4.569-10.652 10.032v6.853c0 6.158 2.788 9.932 10.951 9.932 3.086 0 6.67-.496 9.557-1.688l-.995-4.867a27.153 27.153 0 0 1-7.965 1.192c-3.982.198-5.077-1.093-5.077-4.172zm0-7.846c0-2.483 1.095-4.172 4.28-4.172 3.187 0 3.983 1.689 3.983 4.172v1.29h-8.263zM91.15 43.77c2.09 0 4.68-.398 6.372-.993l-.797-5.265c-1.792.497-3.584.696-5.376.696-3.783 0-4.778-1.093-4.778-4.271v-7.151c0-3.179 1.095-4.271 4.778-4.271 1.294 0 3.584.198 5.376.695l.797-5.264c-1.892-.596-4.48-.993-6.372-.993-8.163 0-11.15 2.98-11.15 9.932v7.052c0 6.952 2.987 9.833 11.15 9.833z"/>' +
      "</svg>",
    visa:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="732 728 1921 621" aria-hidden="true" focusable="false">' +
      '<path fill="#1434cb" d="m1461.26 739.84-251.37 599.74h-164l-123.7-478.62c-7.51-29.48-14.04-40.28-36.88-52.7-37.29-20.23-98.87-39.21-153.05-50.99l3.68-17.43h263.99c33.65 0 63.9 22.4 71.54 61.15l65.33 347.04 161.46-408.2h163zm642.58 403.93c.66-158.29-218.88-167.01-217.37-237.72.47-21.52 20.96-44.4 65.81-50.24 22.23-2.91 83.48-5.13 152.95 26.84l27.25-127.18c-37.33-13.55-85.36-26.59-145.12-26.59-153.35 0-261.27 81.52-262.18 198.25-.99 86.34 77.03 134.52 135.81 163.21 60.47 29.38 80.76 48.26 80.53 74.54-.43 40.23-48.23 57.99-92.9 58.69-77.98 1.2-123.23-21.1-159.3-37.87l-28.12 131.39c36.25 16.63 103.16 31.14 172.53 31.87 162.99 0 269.61-80.51 270.11-205.19m404.94 195.81h143.49l-125.25-599.74h-132.44c-29.78 0-54.9 17.34-66.02 44l-232.81 555.74h162.91L2291 1250h199.05l18.73 89.58zm-173.11-212.5 81.66-225.18 47 225.18h-128.66zm-652.74-387.24-128.29 599.74H1399.5l128.34-599.74h155.09z"/>' +
      "</svg>",
    mastercard:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="17.9 18 117.5 72" aria-hidden="true" focusable="false">' +
      '<path fill="#ff5f00" d="M60.4117 25.6968h31.5v56.6064h-31.5z"/>' +
      '<path fill="#eb001b" d="M62.412 54a35.9375 35.9375 0 0 1 13.75-28.3032 36 36 0 1 0 0 56.6064A35.938 35.938 0 0 1 62.412 54Z"/>' +
      '<path fill="#f79e1b" d="M134.407 54a35.99867 35.99867 0 0 1-58.2452 28.3032 36.00518 36.00518 0 0 0 0-56.6064A35.99867 35.99867 0 0 1 134.407 54Zm-3.4346 22.3077v-1.1589h.4673v-.2361h-1.1901v.2361h.4675v1.1589Zm2.3105 0v-1.3973h-.3648l-.41959.9611-.41971-.9611h-.365v1.3973h.2576v-1.054l.3935.9087h.2671l.39351-.911v1.0563Z"/>' +
      "</svg>"
  };

  // Newsletter — oficiální Ecomail embed widget (formulář ID 4, účet witsocks).
  // Widget (ecm-widget) vykreslí formulář do mount divu #f-<formId> a sám řeší
  // reCAPTCHA + odeslání inline (žádný odskok). Tím obchází robotcheck stránku,
  // na kterou naráží syrový POST na public subscribe URL (viz paměť projektu).
  // Náš brandový obal (modrý blok, maskot, titulek) formulář jen orámuje;
  // vzhled polí widgetu dolaďuje src/css/32-newsletter.css.
  var NEWSLETTER = {
    formId: "4-f67e22c6c3dacfc9b77b6b40399abc16",
    account: "witsocks",
    widgetSrc: "https://d70shl7vidtft.cloudfront.net/widget.js",
    // Zalomení je záměrné (3 řádky, třetí celý žlutě) — `<br>` v titulku platí
    // všude, `<br class="vp-nl__br">` v odstavci jen na desktopu (na mobilu ho
    // CSS vypne, ať text neláme na krátké pahýly). Viz 32-newsletter.css.
    title: 'NEZMEŠKEJTE<br>ŽÁDNÉ NOVINKY<br><span class="vp-nl__accent">A ZÍSKEJTE SLEVU 15%!</span>',
    // mezera PŘED <br> je schválně: když se `<br>` na mobilu vypne, drží slova
    // od sebe; na desktopu se na konci řádku stejně sbalí
    lead: "Přihlaste se k odběru našeho newsletteru a získejte <br class=\"vp-nl__br\">slevu 15 % na váš první nákup veselých ponožek.",
    // Ecomail posílá na tlačítku text z konfigurace formuláře („PŘIHLÁSIT SE
    // K ODBĚRU"). Do vsazené pilulky je moc dlouhý → přepisujeme ho na kratší
    // (verzálky dodá CSS). Změnit jde i v Ecomailu, tady je to proto, aby se
    // vzhled bloku nerozpadl, kdyby se na to v Ecomailu zapomnělo.
    submitLabel: "Přihlásit se",

    // Slevový kód, který se ukáže na děkovacím kroku po přihlášení.
    // ⚠️ Musí existovat SOUČASNĚ na třech místech, jinak to zákazníkovi nesedí:
    //   1. tady (zobrazení na webu hned po odeslání),
    //   2. v administraci eshopu jako slevový kupón (aby šel uplatnit v košíku),
    //   3. v Ecomailu ve welcome automatizaci (aby přišel i e-mailem).
    // Změna je jednořádková — hodnota se nikde jinde v kódu neopakuje.
    code: "VESELE15",
    codeLead: "Váš slevový kód na 15 %:",
    copyLabel: "Zkopírovat",
    copiedLabel: "Zkopírováno ✓"
  };

  // Obsah recenzí — SHODNÝ se sekcí na HP (src/content/homepage.html).
  // Jedou v nekonečném pásu, takže jich může být klidně víc než 3.
  var REVIEWS = [
    { text: "Vše v naprostém pořádku. Rychlost. Kvalita. Doporučuji.", name: "Ondra" },
    { text: "Rychlé dodání, skvělá komunikace, ochota a vstřícnost.", name: "Blanka" },
    { text: "Kvalitní pěkné ponožky.", name: "Lenka" },
    { text: "Nakupuji pravidelně, kvalitní materiál, rychlost dodání, spokojenost.", name: "Eliška Vostracká" },
    { text: "Rychlost, profesionalita, kvalita.", name: "Roman" },
    { text: "Rychle doručeno. Doma fakt radost, když jsme ponožky rozbalili :)", name: "Šárka" },
    { text: "Velký výběr, rychlé dodání, skvělá komunikace.", name: "Marcela" },
    { text: "Objednala jsem poprvé a velice jsem spokojená, děkuji.", name: "Ilona" },
    { text: "Kvalitní a krásné s úžasnými motivy.", name: "Alžběta Dixová" },
    { text: "Ponožky z tohoto obchodu jsou opravdu velmi kvalitní, pružné a dobře „sedí\". Dodání zboží bylo velmi rychlé, za 2 dny od objednávky.", name: "Lenka" }
  ];
  var BADGES = [
    { icon: ASSET.customers, num: "130 000+", label: "Spokojených zákazníků" },
    { icon: ASSET.rating, stars: true, label: "Průměrné hodnocení" },
    { icon: ASSET.trust, num: "97 %", label: "Doporučuje naše ponožky" }
  ];
  // Mobilní kontaktní blok
  var CONTACT = {
    phone: "+420 792 377 714",
    phoneHref: "+420792377714",
    hours: "(Po–Pá 9:00–16:00 hod.)",
    mail: "ponozky@veseleponozky.cz"
  };

  var CHECK =
    '<svg class="vp-foot__check" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">' +
    '<circle cx="8" cy="8" r="8" fill="#16a34a"/>' +
    '<path d="M4.5 8.2l2.2 2.2 4.8-4.8" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";

  function reviewCard(r) {
    return (
      '<div class="vp-foot__review-card">' +
      '<img class="vp-foot__stars" src="' + ASSET.stars + '" alt="Hodnocení 5 z 5" loading="lazy">' +
      '<p class="vp-foot__quote">„' + r.text + '"</p>' +
      '<div class="vp-foot__reviewer">' +
      '<img class="vp-foot__avatar" src="' + ASSET.emoji + '" alt="" loading="lazy">' +
      '<div class="vp-foot__reviewer-meta">' +
      '<span class="vp-foot__reviewer-name">' + r.name + "</span>" +
      '<span class="vp-foot__verified">' + CHECK + " Ověřený zákazník</span>" +
      "</div></div></div>"
    );
  }

  /* Nekonečný pás jako na HP: DVĚ identické sady karet vedle sebe. Animace
     posune track o -50 %, což je přesně šířka jedné sady, takže se pás v
     okamžiku „přetočení" opticky nezmění. Druhá sada je jen vizuální kopie →
     aria-hidden, ať ji čtečky nepředčítají dvakrát. Styl: 30-footer.css. */
  function reviewMarquee() {
    var set = REVIEWS.map(reviewCard).join("");
    return (
      '<div class="vp-foot__marquee"><div class="vp-foot__track">' +
      '<div class="vp-foot__set">' + set + "</div>" +
      '<div class="vp-foot__set" aria-hidden="true">' + set + "</div>" +
      "</div></div>"
    );
  }

  function badge(b) {
    var top = b.stars
      ? '<img class="vp-foot__badge-stars" src="' + ASSET.stars +
        '" alt="Hodnocení 4,9 z 5" loading="lazy">'
      : '<span class="vp-foot__badge-num">' + b.num + "</span>";
    return (
      '<div class="vp-foot__badge">' +
      '<img class="vp-foot__badge-icon" src="' + b.icon + '" alt="" loading="lazy">' +
      '<div class="vp-foot__badge-text">' +
      top +
      '<span class="vp-foot__badge-label">' + b.label + "</span>" +
      "</div></div>"
    );
  }

  function buildTop() {
    var wrap = document.createElement("div");
    wrap.className = "vp-foot";
    wrap.id = "vp-foot-top";
    wrap.innerHTML =
      '<div class="vp-foot__sockstrip" aria-hidden="true"></div>' +
      '<div class="vp-foot__inner">' +
      '<section class="vp-foot__reviews">' +
      '<h2 class="vp-foot__reviews-title">CO ŘÍKAJÍ NAŠI <span class="vp-foot__hl">ZÁKAZNÍCI</span>?</h2>' +
      '<p class="vp-foot__reviews-sub">Vaše spokojenost je pro nás na prvním místě.</p>' +
      reviewMarquee() +
      "</section>" +
      '<section class="vp-foot__badges">' + BADGES.map(badge).join("") + "</section>" +
      '<div class="vp-foot__logo"><img src="' + ASSET.logo + '" alt="Veseléponožky.cz" loading="lazy"></div>' +
      "</div>";
    return wrap;
  }

  function buildContact() {
    var c = document.createElement("div");
    c.className = "vp-foot__contact";
    c.id = "vp-foot-contact";
    c.innerHTML =
      '<img class="vp-foot__contact-photo" src="' + ASSET.advisor + '" alt="" loading="lazy">' +
      '<div class="vp-foot__contact-info">' +
      '<a class="vp-foot__contact-phone" href="tel:' + CONTACT.phoneHref + '">' + CONTACT.phone + "</a>" +
      '<span class="vp-foot__contact-hours">' + CONTACT.hours + "</span>" +
      '<a class="vp-foot__contact-mail" href="mailto:' + CONTACT.mail + '">' + CONTACT.mail + "</a>" +
      "</div>";
    return c;
  }

  // Atribuce webfontu Proxima Soft Cond (onlinewebfonts.com, CC BY 4.0) —
  // licence vyžaduje uvedení zdroje; vkládá se do právního pásu dole.
  function buildAttribution() {
    var d = document.createElement("div");
    d.className = "vp-foot__attribution";
    d.id = "vp-foot-attribution";
    d.innerHTML =
      'Icons made from <a href="https://www.onlinewebfonts.com/icon">svg icons</a>is licensed by CC BY 4.0';
    return d;
  }

  // Pruh s platebními logy do právního pásu patičky (nad větou o obchodních
  // podmínkách). Comgate logo odkazuje na platební bránu — poskytovatele
  // online plateb; Visa a Mastercard jsou tam povinně, bez odkazu.
  function buildPayments() {
    var d = document.createElement("div");
    d.className = "vp-foot__pay";
    d.id = "vp-foot-pay";
    d.innerHTML =
      '<span class="vp-foot__pay-label">Zabezpečené platby zajišťuje</span>' +
      '<div class="vp-foot__pay-logos">' +
      '<a class="vp-foot__pay-logo vp-foot__pay-logo--cg" href="' + PAY_URL +
      '" target="_blank" rel="noopener noreferrer" aria-label="Platební brána Comgate">' +
      PAY_LOGO.comgate + "</a>" +
      '<span class="vp-foot__pay-logo vp-foot__pay-logo--visa" role="img" aria-label="Visa">' +
      PAY_LOGO.visa + "</span>" +
      '<span class="vp-foot__pay-logo vp-foot__pay-logo--mc" role="img" aria-label="Mastercard">' +
      PAY_LOGO.mastercard + "</span>" +
      "</div>";
    return d;
  }

  // Accordion: zabalí h2 + následující sourozence (do dalšího h2) do panelu
  function setupAccordion(footer) {
    var cols = footer.querySelectorAll(".footer-column");
    cols.forEach(function (col) {
      if (col.dataset.vpAcc) return;
      col.dataset.vpAcc = "1";
      var kids = Array.prototype.slice.call(col.children);
      var groups = [];
      var cur = null;
      kids.forEach(function (el) {
        if (el.tagName === "H2") {
          cur = { head: el, panel: [] };
          groups.push(cur);
        } else if (cur) {
          cur.panel.push(el);
        }
      });
      groups.forEach(function (g) {
        var panel = document.createElement("div");
        panel.className = "vp-foot__panel";
        g.head.parentNode.insertBefore(panel, g.head.nextSibling);
        g.panel.forEach(function (el) { panel.appendChild(el); });
        g.head.classList.add("vp-foot__acc-head");
        g.head.setAttribute("role", "button");
        g.head.setAttribute("tabindex", "0");
        g.head.setAttribute("aria-expanded", "false");
        function toggle() {
          var open = g.head.classList.toggle("is-open");
          g.head.setAttribute("aria-expanded", open ? "true" : "false");
        }
        g.head.addEventListener("click", toggle);
        g.head.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
        });
      });
    });
  }

  function buildNewsletter() {
    var wrap = document.createElement("div");
    wrap.className = "vp-nl";
    wrap.id = "vp-nl";
    wrap.innerHTML =
      '<div class="vp-nl__inner">' +
      '<div class="vp-nl__text">' +
      '<h2 class="vp-nl__title">' + NEWSLETTER.title + "</h2>" +
      '<p class="vp-nl__lead">' + NEWSLETTER.lead + "</p>" +
      // Mount pro Ecomail widget — vykreslí sem formulář (email + captcha + odeslání)
      '<div class="vp-nl__form" id="f-' + NEWSLETTER.formId + '"></div>' +
      "</div>" +
      '<div class="vp-nl__media">' +
      '<img class="vp-nl__mascot" src="' + ASSET.mascot + '" alt="Maskot Veselé ponožky" loading="lazy">' +
      "</div>" +
      "</div>";
    return wrap;
  }

  // Zkrácení popisku odesílacího tlačítka. Widget se vykresluje asynchronně
  // (a při přechodu na děkovací krok překresluje), proto MutationObserver.
  // Cílíme jen na krok se zápisem — tlačítko „zpátky do e-shopu" na kroku po
  // odeslání (.ec-v-form-step-send) necháváme být.
  function relabelSubmit(mount) {
    var btns = mount.querySelectorAll(
      ".ec-v-form-step:not(.ec-v-form-step-send) .ec-v-form-submit button"
    );
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].dataset.vpLabel) continue;
      btns[i].dataset.vpLabel = "1";
      btns[i].textContent = NEWSLETTER.submitLabel;
    }
  }

  /* Zkopírování kódu do schránky. `navigator.clipboard` je moderní cesta, ale
     funguje jen v secure contextu a starší Safari/Android ho nemají — proto
     fallback přes skrytý <textarea> + execCommand("copy"). Vrací Promise, ať
     se dá na obě větve navěsit stejná reakce. */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      // mimo obrazovku, ale NE display:none — z neviditelného pole se nekopíruje
      ta.style.cssText = "position:fixed;top:-1000px;left:-1000px;opacity:0";
      ta.setAttribute("readonly", "readonly");
      document.body.appendChild(ta);
      try {
        ta.select();
        ta.setSelectionRange(0, ta.value.length); // iOS bez tohohle nevybere nic
        if (document.execCommand("copy")) resolve(); else reject();
      } catch (err) {
        reject(err);
      }
      document.body.removeChild(ta);
    });
  }

  /* Slevový kód na děkovacím kroku.
     Ecomail vykreslí OBA kroky do DOM rovnou a po odeslání jen přehodí třídu
     `ec-v-form-step-visible` z formuláře na `.ec-v-form-step-send` (ověřeno
     živě). Nečekáme tedy na žádnou událost widgetu — stačí sledovat, kdy je
     děkovací krok viditelný. Díky tomu jde stav i otestovat bez odeslání:
     přehodit tu třídu v DevTools.

     Kód sázíme za `.ec-v-form-text` („Děkujeme!"), tedy nad tlačítko „zpátky
     do e-shopu". Idempotence přes id #vp-nl-code. */
  function injectCode(mount) {
    if (!NEWSLETTER.code) return;
    var step = mount.querySelector(".ec-v-form-step-send.ec-v-form-step-visible");
    if (!step) return;                       // ještě jsme neodeslali
    if (step.querySelector("#vp-nl-code")) return;

    var box = document.createElement("div");
    box.className = "vp-nl__code";
    box.id = "vp-nl-code";
    box.innerHTML =
      '<p class="vp-nl__code-lead">' + NEWSLETTER.codeLead + "</p>" +
      '<div class="vp-nl__code-row">' +
      '<code class="vp-nl__code-val">' + NEWSLETTER.code + "</code>" +
      '<button type="button" class="vp-nl__code-copy">' + NEWSLETTER.copyLabel + "</button>" +
      "</div>";

    var btn = box.querySelector(".vp-nl__code-copy");
    btn.addEventListener("click", function () {
      copyToClipboard(NEWSLETTER.code).then(function () {
        btn.textContent = NEWSLETTER.copiedLabel;
        btn.classList.add("is-copied");
        setTimeout(function () {
          btn.textContent = NEWSLETTER.copyLabel;
          btn.classList.remove("is-copied");
        }, 2000);
      })["catch"](function () {
        // Kopírování neprošlo (starý prohlížeč, odepřené oprávnění) — kód je
        // vidět, zákazník ho opíše. Označíme text, ať se dá aspoň vybrat.
        var val = box.querySelector(".vp-nl__code-val");
        if (!val || !window.getSelection || !document.createRange) return;
        var range = document.createRange();
        range.selectNodeContents(val);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      });
    });

    var text = step.querySelector(".ec-v-form-text");
    if (text && text.parentNode) text.parentNode.insertBefore(box, text.nextSibling);
    else step.insertBefore(box, step.firstChild);
  }

  function watchSubmitLabel(mount) {
    relabelSubmit(mount);
    injectCode(mount);
    if (!("MutationObserver" in window)) return;
    var pending = null;
    new MutationObserver(function () {
      clearTimeout(pending);
      pending = setTimeout(function () {
        relabelSubmit(mount);
        injectCode(mount);
      }, 60);
    }).observe(mount, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  }

  // Načte oficiální Ecomail widget (jen jednou). Loader je 1:1 podle embed kódu
  // z Ecomailu; widget si najde mount div #f-<formId> a vykreslí do něj formulář.
  function loadEcomailWidget() {
    if (window.ecmwidget || document.getElementById(NEWSLETTER.formId)) return;
    var w = window, d = document, o = "ecmwidget";
    w["ecm-widget"] = o;
    w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments); };
    var js = d.createElement("script");
    var fjs = d.getElementsByTagName("script")[0];
    js.id = NEWSLETTER.formId;
    js.dataset.a = NEWSLETTER.account;
    js.src = NEWSLETTER.widgetSrc;
    js.async = 1;
    fjs.parentNode.insertBefore(js, fjs);
  }

  function init() {
    var footer = document.querySelector("body > footer") || document.querySelector("footer");
    if (!footer || document.getElementById("vp-foot-top")) return;

    if (!document.getElementById("vp-nl")) {
      var nl = buildNewsletter();
      footer.insertBefore(nl, footer.firstChild);
      loadEcomailWidget(); // mount div už je v DOM → widget se má kam vykreslit
      var mount = document.getElementById("f-" + NEWSLETTER.formId);
      if (mount) watchSubmitLabel(mount);
    }

    var container = footer.querySelector(":scope > .container") || footer.querySelector(".container");
    footer.insertBefore(buildTop(), container || footer.firstChild);

    var terms = footer.querySelector("section.eshop-footer");
    if (terms) footer.insertBefore(buildContact(), terms);
    else footer.appendChild(buildContact());

    var legal = (terms && terms.querySelector(".container")) || terms || footer;

    if (!document.getElementById("vp-foot-pay")) {
      legal.insertBefore(buildPayments(), legal.firstChild);
    }

    if (!document.getElementById("vp-foot-attribution")) {
      legal.appendChild(buildAttribution());
    }

    setupAccordion(footer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
