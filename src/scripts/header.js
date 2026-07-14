/* Hlavička — Heureka odznak + zákaznická linka s fotkou + vlastní ikona košíku.
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

  var MEDIA = "https://www.exitshop.cz/files/310/files/";
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

  function init() {
    var middleRow = document.querySelector("header .header-middle .menu-gutters");
    if (!middleRow) middleRow = document.querySelector("header .header-middle .row");
    if (!middleRow) return; // není hlavička

    var logo = middleRow.querySelector(".logotype");
    var searchDiv = middleRow.querySelector(".search-div");

    insertHeureka(middleRow, logo);
    insertCareLine(middleRow, searchDiv);
    swapCartIcon();
    buildSideMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
