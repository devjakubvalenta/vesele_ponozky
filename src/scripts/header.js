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

  function init() {
    var middleRow = document.querySelector("header .header-middle .menu-gutters");
    if (!middleRow) middleRow = document.querySelector("header .header-middle .row");
    if (!middleRow) return; // není hlavička

    var logo = middleRow.querySelector(".logotype");
    var searchDiv = middleRow.querySelector(".search-div");

    insertHeureka(middleRow, logo);
    insertCareLine(middleRow, searchDiv);
    swapCartIcon();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
