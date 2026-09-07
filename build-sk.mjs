/* Generátor slovenské verze skriptů.
   Vstup:  src/scripts/*.js            (zdroj pravdy, čeština)
         + i18n/sk-texty.mjs           (slovník řetězců)
         + i18n/sk-ids.mjs             (mapa ID kategorií a CMS stránek)
   Výstup: src/scripts/sk/*.js         (generované, NEEDITOVAT ručně)

   Proč generátor a ne ruční kopie: kód zůstane bit po bitu stejný jako český,
   mění se jen texty a ID. Když se změní čeština, slovenština se přegeneruje
   a je hned vidět, co zbylo nepřeložené — ruční kopie by se rozešly.

   Spuštění:  node build-sk.mjs
              node build-sk.mjs --check   (jen kontrola, nic nezapisuje)
*/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TEXTY, SDILENE, POVOLENE } from "./i18n/sk-texty.mjs";
import { CMS, KATEGORIE } from "./i18n/sk-ids.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, "src/scripts");
const OUT = path.join(SRC, "sk");
const CHECK = process.argv.includes("--check");

/* Písmena, která má čeština a slovenština ne — spolehlivý detektor zbytků.
   (ř, ě, ů se ve slovenštině nevyskytují vůbec.) */
const CESKE = /[ěřůĚŘŮ]/;

/* Skener řetězcových literálů: sleduje stav kódu, takže uvozovky v komentářích
   ani lomítka v regulárkách ho nerozhodí. Komentáře schválně přeskakuje —
   ty zůstávají česky, jsou to interní poznámky pro nás. */
function retezce(src) {
  const out = [];
  let i = 0;
  let prev = "";
  while (i < src.length) {
    const c = src[i];
    const d = src[i + 1];
    if (c === "/" && d === "/") { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (c === "/" && d === "*") { i += 2; while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++; i += 2; continue; }
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      let j = i + 1, buf = "";
      while (j < src.length) {
        if (src[j] === "\\") { buf += src[j + 1]; j += 2; continue; }
        if (src[j] === q) break;
        buf += src[j]; j++;
      }
      out.push({ text: buf, index: i });
      i = j + 1; prev = q; continue;
    }
    if (c === "/" && /[=(,:[!&|?{};+\-*%]|^$/.test(prev)) {
      let j = i + 1, cls = false;
      while (j < src.length) {
        if (src[j] === "\\") { j += 2; continue; }
        if (src[j] === "[") cls = true;
        else if (src[j] === "]") cls = false;
        else if (src[j] === "/" && !cls) break;
        else if (src[j] === "\n") break;
        j++;
      }
      i = j + 1; prev = "/"; continue;
    }
    if (!/\s/.test(c)) prev = c;
    i++;
  }
  return out;
}

function radek(src, index) {
  return src.slice(0, index).split("\n").length;
}

/* Rozdělí zdroj na úseky kódu a komentářů. Náhrady textů se pouštějí jen na
   kód — komentáře jsou interní poznámky a mají zůstat česky. Bez toho by
   obecná náhrada („Zobrazit vše“) rozsekala i větu v komentáři na nesmysl
   („Zobraziť všetkochny“). */
function useky(src) {
  const out = [];
  let i = 0;
  let start = 0;
  let prev = "";
  const pushKod = (do_) => { if (do_ > start) out.push({ komentar: false, text: src.slice(start, do_) }); };
  while (i < src.length) {
    const c = src[i];
    const d = src[i + 1];
    if (c === "/" && d === "/") {
      pushKod(i);
      const j = src.indexOf("\n", i);
      const konec = j === -1 ? src.length : j;
      out.push({ komentar: true, text: src.slice(i, konec) });
      i = konec; start = i; continue;
    }
    if (c === "/" && d === "*") {
      pushKod(i);
      let j = src.indexOf("*/", i + 2);
      const konec = j === -1 ? src.length : j + 2;
      out.push({ komentar: true, text: src.slice(i, konec) });
      i = konec; start = i; continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const q = c;
      let j = i + 1;
      while (j < src.length) {
        if (src[j] === "\\") { j += 2; continue; }
        if (src[j] === q) break;
        j++;
      }
      i = j + 1; prev = q; continue;
    }
    if (c === "/" && /[=(,:[!&|?{};+\-*%]|^$/.test(prev)) {
      let j = i + 1, cls = false;
      while (j < src.length) {
        if (src[j] === "\\") { j += 2; continue; }
        if (src[j] === "[") cls = true;
        else if (src[j] === "]") cls = false;
        else if (src[j] === "/" && !cls) break;
        else if (src[j] === "\n") break;
        j++;
      }
      i = j + 1; prev = "/"; continue;
    }
    if (!/\s/.test(c)) prev = c;
    i++;
  }
  pushKod(src.length);
  return out;
}

/* Náhrady ID: cesty /cms/<id>- a /c/<id>- kdekoli ve zdroji (i v komentářích,
   ať dokumentace v SK souboru nemate). */
function prepisId(src) {
  let out = src;
  for (const [cz, sk] of Object.entries(CMS)) {
    out = out.split("/cms/" + cz + "-").join("/cms/" + sk + "-");
  }
  for (const [cz, sk] of Object.entries(KATEGORIE)) {
    out = out.split("/c/" + cz + "-").join("/c/" + sk + "-");
  }
  return out;
}

const HLAVICKA = (jmeno) =>
  `/* ⚠️ GENEROVANÝ SOUBOR — NEEDITOVAT.\n` +
  `   Vzniká z src/scripts/${jmeno} + i18n/sk-texty.mjs příkazem: node build-sk.mjs\n` +
  `   Úpravy patří do českého originálu nebo do slovníku, pak přegenerovat. */\n`;

let chyby = 0;
let zbytky = 0;
const prehled = [];

if (!CHECK && !fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

for (const [jmeno, nahrady] of Object.entries(TEXTY)) {
  const cesta = path.join(SRC, jmeno);
  if (!fs.existsSync(cesta)) {
    console.error(`✗ ${jmeno}: zdroj neexistuje`);
    chyby++;
    continue;
  }
  let src = fs.readFileSync(cesta, "utf8");
  const puvodni = src;

  /* Nejdřív náhrady konkrétního souboru, teprve pak sdílené — jinak by obecná
     náhrada ukousla kus té specifické („Zobrazit vše“ uvnitř „Zobrazit všechny“). */
  const casti = useky(src);
  for (const [cz, sk] of [...nahrady, ...SDILENE]) {
    let trefeno = 0;
    for (const c of casti) {
      if (c.komentar) continue;
      const pocet = c.text.split(cz).length - 1;
      if (!pocet) continue;
      c.text = c.text.split(cz).join(sk);
      trefeno += pocet;
    }
    // Sdílené náhrady se nemusí trefit v každém souboru — hlásí se jen ty vlastní.
    if (!trefeno && nahrady.some((p) => p[0] === cz)) {
      console.error(`✗ ${jmeno}: náhrada se nikde nenašla → ${JSON.stringify(cz.slice(0, 60))}`);
      chyby++;
    }
  }
  src = casti.map((c) => c.text).join("");

  src = prepisId(src);

  const zbyle = retezce(src).filter(
    (r) => CESKE.test(r.text) && !POVOLENE.some((p) => r.text.includes(p))
  );
  if (zbyle.length) {
    zbytky += zbyle.length;
    console.error(`\n✗ ${jmeno}: ${zbyle.length} nepřeložených řetězců:`);
    for (const r of zbyle.slice(0, 12)) {
      console.error(`   ř.${radek(src, r.index)}  ${JSON.stringify(r.text.slice(0, 80))}`);
    }
    if (zbyle.length > 12) console.error(`   … a dalších ${zbyle.length - 12}`);
  }

  if (!CHECK) fs.writeFileSync(path.join(OUT, jmeno), HLAVICKA(jmeno) + src, "utf8");
  prehled.push({
    soubor: jmeno,
    zmeneno: puvodni !== src,
    nepreloženo: zbyle.length
  });
}

console.log("");
for (const p of prehled) {
  const stav = p.nepreloženo ? `✗ ${p.nepreloženo} zbývá` : "✓ hotovo";
  console.log(`  ${p.soubor.padEnd(26)} ${stav}`);
}
console.log(
  `\n${CHECK ? "Kontrola" : "Vygenerováno"}: ${prehled.length} souborů → src/scripts/sk/` +
  (chyby || zbytky ? `   (chyb: ${chyby}, nepřeložených řetězců: ${zbytky})` : "")
);
process.exit(chyby || zbytky ? 1 : 0);
