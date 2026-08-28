/*
  Odpočet v oznamovací liště (#notification-bar).

  Konec akce se NEPÍŠE sem — bere se z administrace
  (Marketing a slevy → „Odpočítávání na e-shopu" → Koncové datum a čas).

  Jak se k tomu datu dostaneme:
    • Platforma rozbaluje %countdown% jen v NĚKTERÝCH sekcích „Obsah“ —
      v oznamovací liště NE a ověřeně ani v „Boxu pod hlavičkou“ (tam se
      vypíše doslova jako text).
    • Kde se rozbalí, vznikne <div class="es-countdown" data-endtime="…"
      data-end-event-text-content="…"> (z toho čte i platformní Countdown.js).
    • Skript proto hledá v tomhle pořadí:
        1) skrytý blok na aktuální stránce (#vp-cd-src, viz
           src/content/countdown-source.html) — ideál, nic se nestahuje;
        2) hodnotu z sessionStorage (platnost 15 min);
        3) jako záchranu stáhne homepage a přečte blok z ní — proto stačí,
           když je %countdown% jen v „Obsah → Úvodní stránka“.

  Vkládá se do: Administrace → Skripty → nová položka
     • Název: „Odpočet v liště"
     • Zobrazit na stránkách: Na všech stránkách
     • Umístit v Head: ne (patička)
     • Obsah položky (JS musí být v <script>):
         <script src="https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@<hash>/src/scripts/countdown-bar.js"></script>

  Styl dodává 20-header.css (#notification-bar .vp-cd) přes CDN.

  ⚠️ Když blok není nikde, odpočet se nekreslí (lišta zůstane jen s textem) —
     to je záměr: jediný zdroj pravdy o konci akce je administrace.
*/
(function () {
  "use strict";

  if (window.__vpCountdownBar) return;
  window.__vpCountdownBar = true;

  // Fallback textu po skončení, když ho admin nevyplní.
  var ENDED_FALLBACK = "Akce byla ukončena.";
  var CACHE_KEY = "vp-cd";
  var CACHE_TTL = 15 * 60 * 1000;

  // Produkce běží na /, technická adresa na /shops/28056/ — prefix za běhu.
  var SHOP_BASE = (location.pathname.match(/^\/shops\/\d+/) || [""])[0];
  var HOME = SHOP_BASE + "/";

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

  // Hláška z adminu může nést HTML i entity — v liště chceme prostý text.
  function plainText(raw) {
    var s = (raw || "").trim();
    if (!s) return ENDED_FALLBACK;
    if (/[<&]/.test(s)) {
      var tmp = document.createElement("div");
      tmp.innerHTML = s;
      s = (tmp.textContent || "").trim();
    }
    return s || ENDED_FALLBACK;
  }

  function localSource() {
    return document.querySelector("#vp-cd-src [data-endtime]") ||
           document.querySelector(".es-countdown[data-endtime]") ||
           document.querySelector("[data-endtime]");
  }

  function cacheRead() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      return (o && o.x > Date.now()) ? o : null;
    } catch (e) { return null; }
  }

  function cacheWrite(end, ended) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        e: end || 0, t: ended || "", x: Date.now() + CACHE_TTL
      }));
    } catch (e) { /* private mode — jen se nekešuje */ }
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

  function render(textSpan, target, endedText) {
    if (!target || isNaN(target)) return;
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

  // Záchrana: stáhnout homepage a vytáhnout hodnoty regexem (bez DOMParseru,
  // ať se nezakládá druhý dokument kvůli dvěma atributům).
  function fromHomepage(done) {
    if (location.pathname === HOME) { done(null); return; }  // tam už jsme hledali
    fetch(HOME, { credentials: "same-origin" })
      .then(function (r) { return r.ok ? r.text() : ""; })
      .then(function (html) {
        var m = /data-endtime\s*=\s*["']([^"']+)["']/i.exec(html);
        if (!m) { done(null); return; }
        var t = /data-end-event-text-content\s*=\s*["']([^"']*)["']/i.exec(html);
        done({ end: parseEnd(m[1]), ended: plainText(t && t[1]) });
      })
      .catch(function () { done(null); });
  }

  function mount(bar) {
    var textSpan = bar.querySelector("#notification-bar-text");
    if (!textSpan) return;

    // Odstranit nerozbalené placeholdery (%countdown%, %countdown_mini%) i prázdné <p>
    Array.prototype.forEach.call(textSpan.querySelectorAll("p"), function (p) {
      var t = p.textContent.replace(/\s+/g, "");
      if (t === "%countdown%" || t === "%countdown_mini%" || t === "") p.remove();
    });

    // 1) blok přímo na stránce
    var el = localSource();
    if (el) {
      var end = parseEnd(el.getAttribute("data-endtime"));
      var ended = plainText(el.getAttribute("data-end-event-text-content"));
      cacheWrite(end, ended);
      render(textSpan, end, ended);
      return;
    }

    // 2) keš z předchozí stránky (včetně negativní — ať se nestahuje na každé)
    var c = cacheRead();
    if (c) {
      if (c.e) render(textSpan, c.e, c.t || ENDED_FALLBACK);
      return;
    }

    // 3) homepage
    fromHomepage(function (data) {
      if (!data || !data.end || isNaN(data.end)) {
        cacheWrite(0, "");
        if (window.console) {
          console.info("[vp] Odpočet v liště: konec akce se nepodařilo načíst " +
            "z administrace — %countdown% není ani na této stránce, ani na homepage.");
        }
        return;
      }
      cacheWrite(data.end, data.ended);
      render(textSpan, data.end, data.ended);
    });
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
