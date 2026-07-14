/* Kategorie na HP — přesun nativní sekce pod benefits pás + příprava na
   barevné dlaždice. Vkládá se 1× do Administrace → Skripty jako:
     <script src="https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@<hash>/src/scripts/hp-categories.js"></script>
   (Na všech stránkách, NEumisťovat v Head — mimo HP se díky guardu nic nestane.
   Pin hashem jako u CSS linku; bump jen při změně tohoto souboru.)
   Styl dodává src/css/28-hp-kategorie.css (scope .vp-cats) přes CDN.

   Co dělá:
   1. Přesune div.container-fluid se section.category-circle-section z pozice
      mezi bento kompozicí a #homepage_text DOVNITŘ #homepage_text hned za
      sekci recenzí (.vp-recenze--hp); fallback za ul.benefits, kdyby recenze
      v poli Úvodní stránky nebyly.
   2. Každé dlaždici přidá třídu vp-cat-c1..c4 podle pořadí (barvy červená →
      žlutá → modrá → zelená, opakují se).
   3. Víceslovné názvy kategorií: slova 2+ obalí do <span class="vp-cat-accent">
      (první slovo bílé, zbytek v akcentní barvě dle dlaždice — viz CSS).
   4. Přidá třídu vp-cats na sekci (+ vp-cats-wrap na obal) → teprve ta
      aktivuje CSS restyle; pak dispatchne resize (pojistka pro případné
      budoucí platformní listenery).
   Pozn.: šablonová třída .only-mobile-slider je na tomto shopu mrtvý hook —
   Swiper se nenačítá (ověřeno i s mobilním UA); mobilní swipe dodává CSS
   scroll-snap v 28-hp-kategorie.css. Bez tohoto skriptu zůstává sekce
   v nativní pozici i vzhledu. */
(function () {
  "use strict";

  function init() {
    var section = document.querySelector("section.category-circle-section");
    var anchor =
      document.querySelector("#homepage_text .vp-recenze--hp") ||
      document.querySelector("#homepage_text ul.benefits");
    if (!section || !anchor) return; // mimo HP / sekce není
    if (section.classList.contains("vp-cats")) return; // už zpracováno

    // 1. přesun celého obalu (container-fluid) za recenze (příp. benefits)
    var wrap = section.parentElement;
    var moved = section;
    if (wrap && wrap.classList.contains("container-fluid")) {
      wrap.classList.add("vp-cats-wrap");
      moved = wrap;
    }
    anchor.insertAdjacentElement("afterend", moved);

    // 2. barva dle pořadí + 3. akcent slov 2+ (obojí idempotentní)
    var items = section.querySelectorAll(".category-circle-item");
    for (var i = 0; i < items.length; i++) {
      items[i].classList.add("vp-cat-c" + ((i % 4) + 1));

      var el = items[i].querySelector(".category-circle-item-text");
      if (!el || el.querySelector(".vp-cat-accent")) continue;
      var words = (el.textContent || "").trim().split(/\s+/);
      if (words.length < 2) continue;
      el.textContent = "";
      el.appendChild(document.createTextNode(words[0] + " "));
      var accent = document.createElement("span");
      accent.className = "vp-cat-accent";
      accent.textContent = words.slice(1).join(" ");
      el.appendChild(accent);
    }

    // 4. zapnout restyle a nechat Swiper přepočítat rozměry slidů
    section.classList.add("vp-cats");
    try {
      window.dispatchEvent(new Event("resize"));
    } catch (e) {
      /* staré prohlížeče bez Event konstruktoru — resize je jen optimalizace */
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
