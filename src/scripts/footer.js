/* Patička Veselé ponožky — injektovaný obsah + mobilní accordion.
   Vkládá se 1× do Administrace → Skripty jako:
     <script src="https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@main/src/scripts/footer.js"></script>
   (Na všech stránkách; patička/Head je jedno — má DOM-ready guard.)
   Styl dodává src/css/30-footer.css (scope body footer / .vp-foot) přes CDN.

   Footer je statické HTML přímo pod <body> (ne SPA) → injekce přežije.
   Idempotentní (guard přes ID). Obsah recenzí/čísel se mění tady. */
(function () {
  "use strict";

  var MEDIA = "https://www.exitshop.cz/files/310/files/";
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
    // placeholder foto poradkyně (vymění se za reálné)
    advisor: "https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@main/assets/placeholders/advisor.svg"
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
    title: 'NEZMEŠKEJTE ŽÁDNÉ NOVINKY A ZÍSKEJTE <span class="vp-nl__accent">SLEVU 15%</span>!',
    lead: "Přihlaste se k odběru našeho newsletteru a získejte slevu 15 % na váš první nákup veselých ponožek."
  };

  // Obsah recenzí (zatím 3× stejná — uživatel dodá finální)
  var REVIEWS = [
    { text: "ponožky jsou super, pohodlné a designy úplně boží!", name: "Petra K." },
    { text: "ponožky jsou super, pohodlné a designy úplně boží!", name: "Petra K." },
    { text: "ponožky jsou super, pohodlné a designy úplně boží!", name: "Petra K." }
  ];
  var BADGES = [
    { icon: ASSET.customers, num: "10 000+", label: "Spokojených zákazníků" },
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
      '<div class="vp-foot__review-cards">' + REVIEWS.map(reviewCard).join("") + "</div>" +
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
    }

    var container = footer.querySelector(":scope > .container") || footer.querySelector(".container");
    footer.insertBefore(buildTop(), container || footer.firstChild);

    var terms = footer.querySelector("section.eshop-footer");
    if (terms) footer.insertBefore(buildContact(), terms);
    else footer.appendChild(buildContact());

    setupAccordion(footer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
