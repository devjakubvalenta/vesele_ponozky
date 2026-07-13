/*
  Odpočet v oznamovací liště (#notification-bar).
  Platforma rozbaluje %countdown% / %countdown_mini% JEN v sekci „Obsah", NE v liště
  (tam se vypíše doslova jako text). Proto si odpočet do lišty vykreslíme sami.

  Vkládá se do: Administrace → Skripty → nová položka
     • Název: „Odpočet v liště"
     • Zobrazit na stránkách: Na všech stránkách
     • Umístit v Head: ne (patička)
     • Obsah položky (JS musí být v <script>):
         <script src="https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@main/src/scripts/countdown-bar.js"></script>

  Styl dodává 20-header.css (#notification-bar .es-countdown / .vp-cd__box) přes CDN.

  ⚠️ Datum konce akce je zde natvrdo (TARGET). Když v adminu změníte konec akce,
     upravte TARGET i tady a `git push` (nebo si to řekneme a upravím).
*/
(function () {
  "use strict";

  // Konec akce — admin: 14.08.2026 15:00 (Praha, letní čas = +02:00)
  var TARGET = new Date("2026-08-14T15:00:00+02:00").getTime();
  var LABEL = "Zbývá už jen";
  var ENDED = "Akce byla ukončena.";

  function two(n) { return (n < 10 ? "0" : "") + n; }

  function box(value, unit) {
    return '<span class="vp-cd__box"><b>' + value + "</b><i>" + unit + "</i></span>";
  }

  function tick(cd) {
    var diff = TARGET - Date.now();
    if (diff <= 0) {
      cd.innerHTML = "<strong>" + ENDED + "</strong>";
      return false; // konec — zastavit interval
    }
    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600);  s -= h * 3600;
    var m = Math.floor(s / 60);    s -= m * 60;
    cd.innerHTML =
      "<strong>" + LABEL + "</strong>" +
      box(d, d === 1 ? "den" : (d >= 2 && d <= 4 ? "dny" : "dní")) +
      box(two(h), "h") +
      box(two(m), "min") +
      box(two(s), "s");
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

    var cd = textSpan.querySelector(".es-countdown.vp-cd");
    if (!cd) {
      cd = document.createElement("span");
      cd.className = "es-countdown vp-cd";
      textSpan.appendChild(cd);
    }

    if (tick(cd) === false) return;
    var iv = setInterval(function () {
      if (!document.body.contains(cd)) { clearInterval(iv); return; }
      if (tick(cd) === false) clearInterval(iv);
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
