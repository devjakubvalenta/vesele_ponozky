/* Kontrola slovenských obsahových stránek (src/content/sk/*.html).

   Skripty si kontroluje build-sk.mjs sám; tenhle nástroj je na OBSAH, který se
   píše ručně. Hledá tři věci, které se při překladu nejsnáz přehlédnou:

     1. zbytky češtiny — písmena ě, ř, ů, která slovenština nemá,
     2. česká ID CMS stránek a kategorií (na SK shopu vedou na 404, u kategorií
        se dokonce tiše načte výpis všeho zboží — chyba se nepozná podle
        stavového kódu),
     3. nevyplněné značky {{SK_…}}, které by zákazník viděl doslova.

   Komentáře <!-- --> se přeskakují schválně: jsou to interní poznámky pro nás
   a zůstávají české.

   Spuštění:  node check-sk.mjs
*/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CMS, KATEGORIE } from "./i18n/sk-ids.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(ROOT, "src/content/sk");

/* Vlastní jména, která se nepřekládají a „česká" písmena v nich jsou správně. */
const VLASTNI_JMENA = [
  "Třeboň", "Třeboni", "Třeboně", "Třeboňsk",
  "Boženy Němcové", "Němcové",
  "Českých Budějovicích", "Budějovic",
  "Čapek", "ČAPEK",
  "Alžběta",
  "Gočárova třída",   // sídlo Comgate v Hradci Králové — česká adresa, nepřekládá se
  "Ověřeno zákazníky",   // název českého certifikátu Heureky
  "veseleponozky.cz",
];

const CESKE_PISMENO = /[ěřůĚŘŮ]/;

/* Vyhodí obsah HTML komentářů a vrátí řádky s původním číslováním.
   Komentář se musí najít kdekoli, i uprostřed odsazeného řádku — proto se
   nejdřív celý zdroj přepíše znak po znaku (obsah komentáře se nahradí
   mezerami, konce řádků zůstanou) a teprve pak se dělí na řádky. */
function bezKomentaru(src) {
  let ocisteny = "";
  let i = 0;
  while (i < src.length) {
    const start = src.indexOf("<!--", i);
    if (start === -1) {
      ocisteny += src.slice(i);
      break;
    }
    ocisteny += src.slice(i, start);
    const konec = src.indexOf("-->", start);
    const usek = src.slice(start, konec === -1 ? src.length : konec + 3);
    // zachovat konce řádků, aby čísla řádků dál seděla
    ocisteny += usek.replace(/[^\n]/g, " ");
    i = konec === -1 ? src.length : konec + 3;
  }
  return ocisteny
    .split("\n")
    .map((text, idx) => ({ radek: idx + 1, text }))
    .filter((r) => r.text.trim());
}

/* Odstraní z řádku vlastní jména a procentně kódované názvy souborů,
   aby nedělaly falešné poplachy. */
function ocisti(text) {
  let t = text.replace(/%[0-9A-F]{2}/gi, "");
  for (const j of VLASTNI_JMENA) t = t.split(j).join("");
  return t;
}

const CZ_IDS = [...Object.keys(CMS), ...Object.keys(KATEGORIE), "3224", "3236"];

let chyb = 0;
let znacek = 0;
const souhrn = [];

for (const jmeno of fs.readdirSync(DIR).filter((f) => f.endsWith(".html")).sort()) {
  const src = fs.readFileSync(path.join(DIR, jmeno), "utf8");
  const radky = bezKomentaru(src);
  const nalezy = [];

  for (const { radek, text } of radky) {
    const cisty = ocisti(text);
    if (CESKE_PISMENO.test(cisty)) {
      const slova = (cisty.match(/\S*[ěřůĚŘŮ]\S*/g) || []).join(", ");
      nalezy.push({ typ: "čeština", radek, detail: slova.slice(0, 90) });
    }
    for (const id of CZ_IDS) {
      if (new RegExp(`/(?:cms|c)/${id}-`).test(text) || text.includes(`recommend_block_${id}`)) {
        nalezy.push({ typ: "české ID", radek, detail: id });
      }
    }
  }

  /* Značky se počítají i v komentářích — v komentáři jsou v pořádku (je to
     poznámka), v markupu je uvidí zákazník. */
  const vMarkupu = radky.filter((r) => /\{\{SK_/.test(r.text));
  const pocetZnacek = vMarkupu.reduce((n, r) => n + (r.text.match(/\{\{SK_\w+\}\}/g) || []).length, 0);
  znacek += pocetZnacek;

  chyb += nalezy.length;
  souhrn.push({ jmeno, nalezy, pocetZnacek });
}

for (const s of souhrn) {
  const stav = s.nalezy.length ? `✗ ${s.nalezy.length} nálezů` : "✓";
  const zn = s.pocetZnacek ? `  ⚠ ${s.pocetZnacek}× {{SK_…}}` : "";
  console.log(`  ${s.jmeno.padEnd(24)} ${stav}${zn}`);
  for (const n of s.nalezy.slice(0, 8)) {
    console.log(`      ř.${String(n.radek).padStart(4)}  ${n.typ}: ${n.detail}`);
  }
  if (s.nalezy.length > 8) console.log(`      … a dalších ${s.nalezy.length - 8}`);
}

console.log(
  `\n${souhrn.length} souborů, ${chyb} nálezů, ${znacek} nevyplněných značek {{SK_…}}.` +
  (znacek ? "\n⚠ Stránky se značkami NENASAZOVAT, dokud nejsou vyplněné." : "")
);
process.exit(chyb ? 1 : 0);
