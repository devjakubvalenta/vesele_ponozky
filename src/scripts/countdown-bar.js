/*
  Odpočet v oznamovací liště (#notification-bar).

  Konec akce se NEPÍŠE sem — bere se z administrace
  (Marketing a slevy → „Odpočítávání na e-shopu" → Koncové datum a čas).

  Jak to funguje:
    • Platforma rozbaluje %countdown% / %countdown_mini% JEN v sekcích „Obsah",
      v oznamovací liště NE (tam se vypíše doslova jako text).
    • Rozbalený placeholder = <div class="es-countdown" data-endtime="…"
      data-end-event-text-content="…"> a shared/js/Countdown.js z něj bere čas.
    • Proto do některé obsahové sekce vložíme SKRYTÝ zdrojový blok
      (viz src/content/box-pod-hlavickou.html) a tenhle skript z něj přečte
      data-endtime a vykreslí odpočet ve formátu DD:HH:MM:SS do lišty.

  Vkládá se do: Administrace → Skripty → nová položka
     • Název: „Odpočet v liště"
     • Zobrazit na stránkách: Na všech stránkách
     • Umístit v Head: ne (patička)
     • Obsah položky (JS musí být v <script>):
         <script src="https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@<hash>/src/scripts/countdown-bar.js"></script>

  Styl dodává 20-header.css (#notification-bar .vp-cd) přes CDN.

  ⚠️ Bez zdrojového bloku v adminu se odpočet nezobrazí (lišta zůstane jen
     s textem) — to je záměr: jediný zdroj pravdy je administrace.
*/
(function () {
  "use strict";

  if (window.__vpCountdownBar) return;
  window.__vpCountdownBar = true;

  // Fallback textu po skončení, když ho admin nevyplní.
  var ENDED_FALLBACK = "Akce byla ukončena.";

  function two(n) { return (n < 10 ? "0" : "") + n; }

  /* data-endtime umí přijít v několika tvarech (ISO, "2026/08/28 20:35:00",
     "2026-08-28 20:35:00", unix timestamp). Bereme to tolerantně. */
  function parseEnd(raw) {
    if (raw === null || raw === undefined) return NaN;
    var s = String(raw).trim();
    if (!s) return NaN;
    if (/^\d{9,13}$/.test(s)) {
      var n = parseInt(s, 10);
      return s.length <= 10 ? n * 1000 : n;      // sekundy vs. milisekundy
    }
    var t = Date.parse(s);
    if (!isNaN(t)) return t;
    // "2026-08-28 20:35:00" → Safari/starší Chrome chtějí lomítka
    t = Date.parse(s.replace(/-/g, "/").replace(/T/, " ").replace(/\.\d+$/, ""));
    return t;
  }

  function findSource() {
    // 1) náš označený skrytý držák, 2) platformní blok kdekoli na stránce
    return document.querySelector("#vp-cd-src [data-endtime]") ||
           document.querySelector(".es-countdown[data-endtime]") ||
           document.querySelector("[data-endtime]");
  }

  function tick(cd, target, endedText) {
    var diff = target - Date.now();
    if (diff <= 0) {
      cd.textContent = endedText;
      return false;                              // konec — zastavit interval
    }
    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600);  s -= h * 3600;
    var m = Math.floor(s / 60);    s -= m * 60;
    // formát DD:HH:MM:SS (oddělovač „ - " před odpočtem řeší CSS ::before)
    cd.textContent = two(d) + ":" + two(h) + ":" + two(m) + ":" + two(s);
    return true;
  }

  function mount(bar) {
    var textSpan = bar.querySelector("#notification-bar-text");
    if (!textSpan) return;

    // Odstranit nerozbalené placeholdery (%countdown%, %countdown_mini%) i prázdné <p>
    Array.prototype.forEach.call(textSpan.querySelectorAll("p"), function (p) {
      var t = p.textContent.replace(/\s+/g, "");
      if (t === "%countdown%" || t === "%countdown_mini%" || t === "") p.remove();
    });

    var src = findSource();
    if (!src) {
      // Bez zdroje z administrace odpočet nekreslíme (a uklidíme případný starý).
      var old = textSpan.querySelector(".vp-cd");
      if (old) old.remove();
      if (window.console) {
        console.info("[vp] Odpočet v liště: chybí zdroj z administrace " +
          "(%countdown% ve skrytém #vp-cd-src) — lišta zůstává bez odpočtu.");
      }
      return;
    }

    var target = parseEnd(src.getAttribute("data-endtime"));
    if (isNaN(target)) return;

    var endedText = (src.getAttribute("data-end-event-text-content") || "").trim() ||
                    ENDED_FALLBACK;
    // admin může mít v hlášce HTML — v liště chceme jen text
    if (/[<&]/.test(endedText)) {
      var tmp = document.createElement("div");
      tmp.innerHTML = endedText;
      endedText = (tmp.textContent || "").trim() || ENDED_FALLBACK;
    }

    var cd = textSpan.querySelector(".vp-cd");
    if (!cd) {
      cd = document.createElement("span");
      // POZOR: bez třídy .es-countdown — platformní Countdown.js po doběhnutí
      // dělá $('.es-countdown').remove() a smazal by nám span i s lištou textu.
      cd.className = "vp-cd";
      textSpan.appendChild(cd);
    }

    if (tick(cd, target, endedText) === false) return;
    var iv = setInterval(function () {
      if (!document.body.contains(cd)) { clearInterval(iv); return; }
      if (tick(cd, target, endedText) === false) clearInterval(iv);
    }, 1000);
  }

  function init() {
    var tries = 0;
    (function find() {
      var bar = document.querySelector("#notification-bar");
      if (bar) { mount(bar); return; }
      if (tries++ < 20) setTimeout(find, 250); // lišta se může dorenderovat
    })();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
