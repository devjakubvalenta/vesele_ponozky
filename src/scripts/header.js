/* Hlavička — Heureka odznak + zákaznická linka s fotkou + vlastní ikona košíku.
   Navíc plošná pojistka: přepis absolutních URL na technickou doménu
   (www.exitshop.cz) na cesty od kořene — viz `localizeUrl` níže.
   Vkládá se 1× do Administrace → Skripty jako:
     <script src="https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@<hash>/src/scripts/header.js"></script>
   (Na všech stránkách; patička/Head je jedno — má DOM-ready guard.)
   Styl dodává src/css/20-header.css (scope header / .vp-hdr-*) přes CDN.

   Idempotentní (guard přes ID). Mimo stránky s hlavičkou se nic nestane.
   DŮLEŽITÉ: telefon i e-mail v zákaznické lince se ČTOU z nativního pole
   „Doplňující informace" (header .company-info a.phone / a.mail) — nejsou
   hardcoded. Kontakt se edituje v administraci, propíše se sem po reloadu.
   Proto pole „Doplňující informace" nechat vyplněné (i když jeho zobrazení
   nahoře v modré liště skrývá CSS). */
(function () {
  "use strict";

  // Cesta k médiím je na obou doménách stejná (produkce veseleponozky.cz
  // i test exitshop.cz) → bez domény, ať se nic neváže na testovací web.
  var MEDIA = "/files/310/files/";
  var ASSET = {
    heureka: MEDIA + "heureka_banner.png",
    cart: MEDIA + "cart.svg",
    advisor: MEDIA + "kontakt.svg"
  };

  // Heureka profil obchodu (odkaz na odznaku). Prázdné = odznak bez odkazu.
  var HEUREKA_URL = "";

  // Barevné kategorie na začátku mobilního menu — SHODNÉ s dlaždicemi na HP
  // (src/css/28-hp-kategorie.css). Výběr „které 4" je uložený jen v HP adminu
  // („Titulek a kategorie na homepage") a mimo HP není dostupný, proto se sem
  // zadává ID kategorie; NÁZEV i ODKAZ si skript vytáhne z navigace (je všude).
  // Pořadí = pořadí barev (c1 červená, c2 žlutá, c3 modrá, c4 zelená) jako na HP.
  // Při změně kategorií na HP srovnat tento seznam (ID z URL /c/<ID>-…).
  // name = záložní název (některé odkazy v navigaci nemají text — obrázkové);
  // skript primárně bere název z navigace, name použije jen když tam text chybí.
  var SIDE_CATEGORIES = [
    { id: "1243154", color: "c1", name: "Káva" },              // červená
    { id: "1243415", color: "c2", name: "Adventní kalendáře" }, // žlutá
    { id: "1243451", color: "c3", name: "Podkolenky" },        // modrá
    { id: "1243496", color: "c4", name: "Zvířátka" }           // zelená
  ];

  function insertHeureka(middleRow, logo) {
    if (document.getElementById("vp-hdr-heureka")) return;
    var tag = HEUREKA_URL ? "a" : "span";
    var el = document.createElement(tag);
    el.className = "vp-hdr-heureka";
    el.id = "vp-hdr-heureka";
    if (HEUREKA_URL) {
      el.href = HEUREKA_URL;
      el.target = "_blank";
      el.rel = "noopener";
    }
    // width/height = intrinsic poměr odznaku (157×48) → prohlížeč rezervuje
    // šířku ještě před načtením PNG (žádný layout shift v řádce loga)
    el.innerHTML =
      '<img src="' + ASSET.heureka +
      '" width="157" height="48" alt="97 % zákazníků doporučuje — Ověřeno zákazníky Heureka" loading="lazy">';
    // DOVNITŘ .logotype (vedle loga v jednom bloku) — drží spolu na desktopu
    // i na mobilu bez kolize s gridem hlavičky; fallback za logo do řady
    if (logo) {
      logo.appendChild(el);
    } else {
      middleRow.insertBefore(el, middleRow.children[1] || null);
    }
  }

  function insertCareLine(middleRow, searchDiv) {
    if (document.getElementById("vp-hdr-care")) return;
    var phoneA = document.querySelector("header .company-info a.phone");
    var mailA = document.querySelector("header .company-info a.mail");
    if (!phoneA && !mailA) return; // není zdroj dat — linku nevytvářet

    // Telefon: text „792 377 714 (9:00-16:00)" → číslo + doba (závorka)
    var phoneText = phoneA ? (phoneA.textContent || "").trim() : "";
    var m = phoneText.match(/^(.*?)\s*(\(.*\))\s*$/);
    var phoneNum = m ? m[1].trim() : phoneText;
    var hours = m ? m[2].trim() : "";
    var phoneHref = phoneA ? phoneA.getAttribute("href") : "";
    var mailText = mailA ? (mailA.textContent || "").trim() : "";
    var mailHref = mailA ? mailA.getAttribute("href") : "";

    var care = document.createElement("div");
    care.className = "vp-hdr-care";
    care.id = "vp-hdr-care";
    var html =
      '<img class="vp-hdr-care__photo" src="' + ASSET.advisor + '" alt="" loading="lazy">' +
      '<div class="vp-hdr-care__info">';
    if (phoneNum) {
      html +=
        '<a class="vp-hdr-care__phone" href="' + (phoneHref || "#") + '">' + phoneNum + "</a>";
    }
    if (hours) {
      html += '<span class="vp-hdr-care__hours">' + hours + "</span>";
    }
    if (mailText) {
      html +=
        '<a class="vp-hdr-care__mail" href="' + (mailHref || "#") + '">' + mailText + "</a>";
    }
    html += "</div>";
    care.innerHTML = html;

    if (searchDiv && searchDiv.parentElement === middleRow) {
      searchDiv.insertAdjacentElement("afterend", care);
    } else {
      middleRow.appendChild(care);
    }
  }

  function swapCartIcon() {
    var cart = document.querySelector("header a.shopping-basket");
    if (!cart || cart.classList.contains("vp-hdr-cart")) return;
    cart.classList.add("vp-hdr-cart");
    // odkaz košíku má jen ikonu → přístupný název (jinak čtečka přečte jen číslo)
    if (!cart.getAttribute("aria-label")) cart.setAttribute("aria-label", "Košík");
    var img = document.createElement("img");
    img.className = "vp-hdr-cart__ic";
    img.src = ASSET.cart;
    img.alt = "";
    img.setAttribute("loading", "lazy");
    // vlož jako první dítě (badge .shopping-basket-items-count zůstává za ním);
    // nativní .bi-handbag skryje CSS
    cart.insertBefore(img, cart.firstChild);
  }

  // Mobilní menu: 4 barevné kategorie nahoru + CMS položky (z modré lišty) dolů.
  // Vše jde do nativního .navbar-nav; CSS je zobrazí jen na mobilu (na desktopu
  // zůstává vodorovné menu + modrá lišta beze změny). Hlavní kategorie nedotčeny.
  function buildSideMenu() {
    var navUl = document.querySelector("#navbarSupportedContent .navbar-nav");
    if (!navUl || navUl.querySelector(".vp-menu-cat")) return; // idempotence

    // 1. barevné kategorie na začátek (název + odkaz z navigace dle ID)
    var frag = document.createDocumentFragment();
    for (var i = 0; i < SIDE_CATEGORIES.length; i++) {
      var cat = SIDE_CATEGORIES[i];
      var links = document.querySelectorAll('header #top-menu a[href*="/c/' + cat.id + '-"]');
      if (!links.length) continue;
      // href z prvního výskytu; název z prvního odkazu, který text má (jinak fallback)
      var href = links[0].getAttribute("href");
      var name = cat.name || "";
      for (var k = 0; k < links.length; k++) {
        var t = (links[k].textContent || "").trim();
        if (t) { name = t; break; }
      }
      var li = document.createElement("li");
      li.className = "nav-item vp-menu-cat vp-menu-cat--" + cat.color;
      var a = document.createElement("a");
      a.className = "nav-link";
      a.href = href;
      a.textContent = name;
      a.insertAdjacentHTML("beforeend", '<span class="vp-menu-cat__arrow" aria-hidden="true">›</span>');
      li.appendChild(a);
      frag.appendChild(li);
    }
    navUl.insertBefore(frag, navUl.firstChild);

    // 2. CMS položky z modré lišty na konec menu (jen kopie — lišta na desktopu zůstává)
    var cmsLinks = document.querySelectorAll("header .main-nav .top-cms-menu a");
    for (var j = 0; j < cmsLinks.length; j++) {
      var cli = document.createElement("li");
      cli.className = "nav-item vp-menu-cms";
      var ca = document.createElement("a");
      ca.className = "nav-link";
      ca.href = cmsLinks[j].getAttribute("href");
      ca.textContent = (cmsLinks[j].textContent || "").trim();
      cli.appendChild(ca);
      navUl.appendChild(cli);
    }
  }

  /* Mobilní menu: klik na kategorii = přechod na kategorii, ne rozbalení
     podkategorií. Šablona dává těmhle odkazům `data-toggle="dropdown"`,
     takže Bootstrap na kliknutí zavolá preventDefault a místo navigace
     rozbalí panel — CSS s tím nic nezmůže.

     Neodstraňujeme atribut (na desktopu má dropdown zůstat funkční), ale
     zachytíme klik v CAPTURE fázi na samotném odkazu: ta proběhne dřív než
     Bootstrapův delegovaný handler na documentu, a `stopPropagation()`
     zajistí, že se k události vůbec nedostane. Nikdo tedy nezavolá
     preventDefault → prohlížeč normálně následuje href.

     Kontrola šířky je až uvnitř handleru (ne při navazování), takže se to
     chová správně i po otočení displeje nebo změně velikosti okna. */
  function keepMobileMenuLinksNavigable() {
    var links = document.querySelectorAll(
      "#navbarSupportedContent .navbar-nav > li > a.dropdown-toggle"
    );
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("data-vp-nav") === "1") continue; // idempotence
      links[i].setAttribute("data-vp-nav", "1");
      links[i].addEventListener("click", function (e) {
        if (window.innerWidth >= 992) return; // desktop: dropdown nechat být
        if (!this.getAttribute("href")) return;
        e.stopPropagation();
      }, true);
    }
  }

  /* == Pojistka: URL s technickou doménou → cesta od kořene =============
     Obsah vkládaný přes WYSIWYG v administraci si nese absolutní odkazy na
     www.exitshop.cz — editor cesty zabsolutizuje doménou, na které se zrovna
     edituje. Na produkci pak USP dlaždice a obrázky odvedou zákazníka na
     technickou adresu shopu („starý eshop"). Přepisujeme je za běhu:
       …exitshop.cz/shops/28056/cms/60954-x → /cms/60954-x  (na testu /shops/28056/cms/…)
       …exitshop.cz/files/310/…             → /files/310/…  (stejná cesta na obou)
     Odkaz na samotný exitshop.cz (kredit platformy v patičce) se NEMĚNÍ.
     Řeší jen symptom — správně je opravit obsah v administraci; zdroje jsou
     v src/content/*.html a vkládají se ve zdrojovém režimu (</>). */

  var TECH_RE = /^https?:\/\/(?:www\.)?exitshop\.cz/i;
  var SHOP_BASE = (location.pathname.match(/^\/shops\/\d+/) || [""])[0];

  function localizeUrl(url) {
    if (!url || !TECH_RE.test(url)) return null;
    var path = url.replace(TECH_RE, "");
    if (path.indexOf("/files/") === 0) return path;      // média: shodná cesta na obou doménách
    var m = path.match(/^\/shops\/\d+(\/.*)?$/);
    if (m) return SHOP_BASE + (m[1] || "/");
    return null;                                          // kredit platformy — nechat být
  }

  function fixTechDomainUrls() {
    var nodes = document.querySelectorAll(
      'a[href*="exitshop.cz"], img[src*="exitshop.cz"]'
    );
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var attr = el.tagName === "IMG" ? "src" : "href";
      var next = localizeUrl(el.getAttribute(attr));
      if (next) el.setAttribute(attr, next);
    }
  }

  /* Obsah dochází i po DOM-ready (Vue na detailu, AJAX filtrace ve výpisu),
     proto ještě sledovat DOM — přepis je levný a spouští se zhuštěně. */
  function watchTechDomainUrls() {
    if (!("MutationObserver" in window)) return;
    var pending = null;
    new MutationObserver(function () {
      if (pending) return;
      pending = setTimeout(function () {
        pending = null;
        fixTechDomainUrls();
      }, 100);
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* == Sticky hlavička: skrýt při scrollu dolů, vrátit při scrollu nahoru ==
     Styl (position: sticky, transform) je v src/css/20-header.css, tady se
     jen přepínají třídy.

     Odsazení shora: odpočtová lišta #notification-bar je `position: fixed`
     (šablonový „make-sticky"), takže by hlavička zajela pod ni. Její výšku
     měříme za běhu do --vp-hdr-top — zákazník lištu může zavřít křížkem a
     text v ní se mění, takže napevno se to napsat nedá.

     Kdy NEskrývat: nad prahem 120 px (ať to nepodskakuje hned na začátku
     stránky) a s otevřeným mobilním menu / vyhledáváním — rozbalený panel je
     uvnitř hlavičky, odjel by ze obrazovky i s ním. */
  var HIDE_AFTER = 120;   // px scrollu, než se začne skrývat
  var DIR_SLOP = 4;       // px, aby se to nepřepínalo na chvění trackpadu

  function stickyHeader() {
    var hdr = document.querySelector("header");
    if (!hdr) return;

    var last = window.pageYOffset;
    var ticking = false;

    function menuOpen() {
      return (
        document.body.classList.contains("mobile-menu-locked") ||
        !!document.querySelector("#navbarSupportedContent.show, #navbarSupportedContent.collapsing")
      );
    }

    /* Výška lišty se počítá jen když opravdu překrývá obsah (fixed). */
    function topOffset() {
      var bar = document.getElementById("notification-bar");
      if (!bar || window.getComputedStyle(bar).position !== "fixed") return 0;
      return Math.round(bar.getBoundingClientRect().height);
    }

    function apply() {
      ticking = false;
      var y = window.pageYOffset;

      document.documentElement.style.setProperty("--vp-hdr-top", topOffset() + "px");
      hdr.classList.toggle("vp-hdr-stuck", y > HIDE_AFTER);

      if (menuOpen() || y <= HIDE_AFTER) {
        hdr.classList.remove("vp-hdr-off");
      } else if (y > last + DIR_SLOP) {
        hdr.classList.add("vp-hdr-off");
      } else if (y < last - DIR_SLOP) {
        hdr.classList.remove("vp-hdr-off");
      }
      last = y;
    }

    function schedule() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(apply);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    apply();
  }

  function init() {
    fixTechDomainUrls();      // běží na všech stránkách, i tam kde není hlavička
    watchTechDomainUrls();
    stickyHeader();

    var middleRow = document.querySelector("header .header-middle .menu-gutters");
    if (!middleRow) middleRow = document.querySelector("header .header-middle .row");
    if (!middleRow) return; // není hlavička

    var logo = middleRow.querySelector(".logotype");
    var searchDiv = middleRow.querySelector(".search-div");

    insertHeureka(middleRow, logo);
    insertCareLine(middleRow, searchDiv);
    swapCartIcon();
    buildSideMenu();
    keepMobileMenuLinksNavigable();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
