// build.mjs — sestaví src/css/*.css do dist/custom.css
//
// Čte všechny src/css/*.css v ČÍSELNÉM pořadí (00-, 10-, 20- …), spojí je,
// přidá horní hlášku + per-soubor bannery a zapíše do dist/custom.css.
//
//   node build.mjs            → dist/custom.css   (čitelný, default)
//   node build.mjs -- --min   → navíc dist/custom.min.css (konzervativně minifikovaný)
//   npm run build / npm run build:min
//
// dist/ je GENEROVANÝ obsah — needitovat ručně.

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(ROOT, 'src', 'css');
const DIST_DIR = join(ROOT, 'dist');

const wantMin = process.argv.includes('--min');

const TOP_BANNER = [
  '/*',
  ' * ============================================================',
  ' *  GENEROVÁNO build.mjs — NEEDITOVAT TENTO SOUBOR RUČNĚ.',
  ' *  Zdroj pravdy: src/css/*.css  (uprav tam a spusť `npm run build`).',
  ' *',
  ' *  Vlož do: Administrace → Nastavení designu → „Vaše doplňkové CSS".',
  ' *  (Pro vývoj lze místo vložení hostovat přes jsDelivr a načítat',
  ' *   jako <link> ve „Skripty" — viz CLAUDE.md.)',
  ' * ============================================================',
  ' */',
  '',
].join('\n');

function sectionBanner(name) {
  return `/* ==== ${name} ==== */\n`;
}

// Konzervativní minifikace: odstraní /* … */ komentáře, zhutní whitespace.
// Záměrně jednoduchá a bezpečná (žádné rizikové přepisy hodnot/selektorů).
function minify(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')   // komentáře
    .replace(/\s+/g, ' ')                // zhutnit bílé znaky
    .replace(/\s*([{}:;,>~+])\s*/g, '$1') // okolo separátorů
    .replace(/;}/g, '}')                  // zbytečné středníky před }
    .trim();
}

async function main() {
  const entries = (await readdir(SRC_DIR))
    .filter((f) => f.endsWith('.css'))
    .sort(); // číselné prefixy → správné pořadí

  if (entries.length === 0) {
    console.error('build.mjs: v src/css/ nejsou žádné .css soubory.');
    process.exit(1);
  }

  const parts = [TOP_BANNER];
  for (const file of entries) {
    const css = await readFile(join(SRC_DIR, file), 'utf8');
    parts.push(sectionBanner(file));
    parts.push(css.trimEnd());
    parts.push(''); // prázdný řádek mezi sekcemi
  }

  const output = parts.join('\n') + '\n';

  await mkdir(DIST_DIR, { recursive: true });
  await writeFile(join(DIST_DIR, 'custom.css'), output, 'utf8');

  const lines = output.split('\n').length;
  console.log(`✓ dist/custom.css  (${entries.length} sekcí, ${lines} řádků, ${output.length} B)`);
  console.log(`  pořadí: ${entries.join(' → ')}`);

  if (wantMin) {
    const min = TOP_BANNER + minify(parts.slice(1).join('\n')) + '\n';
    await writeFile(join(DIST_DIR, 'custom.min.css'), min, 'utf8');
    console.log(`✓ dist/custom.min.css  (${min.length} B)`);
  }
}

main().catch((err) => {
  console.error('build.mjs selhal:', err);
  process.exit(1);
});
