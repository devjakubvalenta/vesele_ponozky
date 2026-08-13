# CLAUDE.md — Veselé ponožky / WitSocks (eshop na exitshop.cz)

Verzovaný **zdroj pravdy** pro vlastní CSS a skripty eshopu. Cíl: konec
„pastování naslepo" — upravuje se zde, builduje, živě se náhleduje a teprve
ověřená změna se vkládá do administrace.

**Produkce: https://www.veseleponozky.cz/** — ostrý eshop pro zákazníky.
Technická adresa téhož shopu (28056): https://www.exitshop.cz/shops/28056/
(„Zkouška 2"). Je to **jeden shop na dvou doménách**, liší se jen tvar cest:

| | produkce | technická adresa |
|---|---|---|
| kategorie | `/c/1243142-…` | `/shops/28056/c/1243142-…` |
| CMS | `/cms/60954-…` | `/shops/28056/cms/60954-…` |
| média | `/files/310/files/…` | `/files/310/files/…` (stejné) |

> ⚠️ **Nikdy nehardcoduj doménu.** Absolutní URL na `exitshop.cz` odvede
> zákazníka z produkce na technickou adresu. V CSS a v obsahu pro admin piš
> cesty od kořene (`/files/…`, `/cms/…`, `/c/…`); v JS, kde musí odkaz fungovat
> na obou, dopočítej prefix za běhu — viz `SHOP_BASE` v
> [src/scripts/30-product-cards.js](src/scripts/30-product-cards.js).
> ID kategorií, produktů i CMS stránek jsou na obou doménách stejná.

> ⚠️ **Výjimka: `url()` v CSS.** Tam cesta od kořene NEFUNGUJE — `url()` se
> vyhodnocuje vůči **stylopisu**, a ten jede z jsDelivr, takže
> `/files/310/files/x.svg` skončí na `cdn.jsdelivr.net/files/…` = 404 (takhle
> nám jednou zmizely ikony košíku a doručení). Obrázky pro CSS proto leží
> v repu v [assets/media/](assets/media/) a odkazují se **relativně**:
> `url("../assets/media/x.svg")` (relativně k `dist/custom.css`).
> V HTML/JS root-relative cesty fungují dál — tam je základ stránka.

## Omezení platformy exitshop.cz (uzavřený SaaS)

- **Žádný FTP, žádný přístup ke zdrojům šablony, žádné API pro vzhled.** API je
  jen na data (produkty, objednávky, sklad).
- Vlastní vzhled jde ovlivnit **jen vložením CSS**: *Administrace → Nastavení
  designu → „Vaše doplňkové CSS"* (dlaždice **„Vzhled"**; podporuje i LESS).
- Vlastní JS/CSS/HTML přes sekci **„Skripty"** — plný správce položek.
- Šablona = **Bootstrap 4**, font **Space Grotesk**; aktivní šablona **Next**.
- **Hodně obsahu jde NATIVNĚ** (homepage slider, sekce obrázek+text, kategorie
  s obrázky, produktové bloky, logo, bannery, CMS/blog) — viz
  [reference/administrace-moznosti.md](reference/administrace-moznosti.md).
  Pravidlo: *obsah* dělej nativně a **nastyluj** ho CSS; *vzhled a vychytávky*
  nad rámec platformy řeš CSS/JS smyčkou.

### Sekce „Skripty" (jak se chová)

Každá položka má: **název** + **pořadí**, **cílení na stránky** („Na všech
stránkách" / „Pouze produktový detail" / …), přepínač **„Umístit v Head"**
(jinak patička; Head řeší **FOUC** u CDN `<link>`). Na konverzní stránce jsou
zástupné symboly (`%v`, `%n`, `%c`, `%email`…) pro data objednávky.

> ⚠️ **Obsah se vkládá DOSLOVA** (neobaluje se). JavaScript dej do
> `<script>…</script>`, ale **`<link>`/`<style>` vkládej HOLÉ** — `<link>`
> uvnitř `<script>` browser ignoruje (CSS se nenačte). Tahle past nás jednou
> zdržela při zapojení CDN.

**Už existující položky (NEPŘEPISOVAT):** „Font" (Na všech stránkách), „Pokus s
nutností vybrat variantu. JS i CSS" (Pouze produktový detail). Naše položky se
**přidávají**. Mapa položek: [src/scripts/README.md](src/scripts/README.md).

## Struktura repa

```
reference/administrace-moznosti.md  # katalog NATIVNÍCH možností administrace (slider, obsah, kategorie, placeholdery, media URL)
reference/template.css     # ř. 1–29230 původního dumpu = zkompilovaná šablona (jen reference selektorů, NIKDY se nevkládá)
css                        # PŮVODNÍ kombinovaný dump (956 KB). Plně reprodukován reference/ + src/css/. Bezpečnostní snímek — lze smazat.
src/css/*.css              # ZDROJ PRAVDY vlastního CSS, číslované kvůli pořadí (cascade)
  00-misc.css              #   drobné overrides (skrytí třetí úrovně menu)
  10-checkout.css          #   pokladna .container .content, tokeny --cx-*
  20-header.css            #   hlavička, tokeny --hdr-*
  30-footer.css            #   patička body footer
src/scripts/               # 1 soubor = 1 položka v admin „Skripty" (vč. tagů); README = mapa
dist/custom.css            # SESTAVENÝ výstup k vložení/hostování — GENEROVANÝ, NEEDITOVAT
dist/custom.min.css        # volitelná minifikovaná verze
build.mjs                  # concat src/css/* → dist/ (Node, bez závislostí)
```

> Tokeny nejsou v globálním `:root`, ale scopované do selektorů (`--cx-*` v
> `.container .content`, `--hdr-*` v `header`) — tak je psal původní autor.
> Konvence: `--cx-*` = obsah/pokladna, `--hdr-*` = hlavička.

## Build

```bash
npm run build        # → dist/custom.css (čitelný)
npm run build:min    # → navíc dist/custom.min.css
```

Build spojí `src/css/*.css` v **číselném pořadí**, přidá horní hlášku a bannery
`/* ==== 10-checkout.css ==== */`. **Nikdy needituj `dist/`** — uprav `src/css/`
a spusť build.

## Doručení CSS — hybrid

- **Vývoj:** `git push` → jsDelivr aktualizuje
  `https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@main/dist/custom.css`.
  Na webu je vložená položka `<link>` v Head ([src/scripts/00-css-cdn-link.html](src/scripts/00-css-cdn-link.html),
  „Na všech stránkách" + Head), takže se změna projeví sama — bez kopírování.
  **Repo musí být veřejné** (jsDelivr neobsluhuje privátní). jsDelivr cache `@main`
  lze purgnout přes purge URL; pro jistotu jde použít `@<commit-hash>`.
- **Produkce:** až je vše odladěné, finální `dist/custom.css` jednorázově
  „zapéct" do pole *Vzhled → Vaše doplňkové CSS*; CDN položku ponechat/odebrat
  dle potřeby. Marker: commit `deploy: custom.css → admin (RRRR-MM-DD)` →
  git = historie verzí + rollback, kterou administrace nemá.

Git remote: `git@github.com:devjakubvalenta/vesele_ponozky.git`.

## Smyčka pro každou další úpravu (živý náhled)

1. Otevřít live eshop přes **chrome-devtools MCP** (`new_page`/`navigate_page` na shop URL).
2. `take_snapshot` / `evaluate_script` → přečíst **reálný vykreslený DOM** a
   potvrdit selektory **dřív**, než píšu CSS (`reference/template.css` ukazuje, co
   existuje; DOM ukazuje, co se opravdu renderuje).
3. Upravit příslušný `src/css/*.css` → `npm run build`.
4. **Injektnout `dist/custom.css` naživo** (přes `evaluate_script` přidat
   `<style>`) — náhled bez zásahu do administrace.
5. Screenshot desktop + `resize_page` na mobil (~390 px) a tablet (~768 px).
6. Iterovat 3–5, dokud nesedí. Pak nasadit (hybrid výše).

**Bootstrap 4 breakpointy:** `575.98 / 767.98 / 991.98 / 1399.98 px`.

**Reálné selektory:** kořen `#app`; varianty `.variant-name`,
`#variant-selector`, `#configurator-variants`; košík na detailu
`.product-add-to-shopping-basket-wrapper`, `.product-add-to-shopping-basket`.

## Pravidla

- Do administrace se Claude nepřihlašuje — pracuje jen s veřejnou částí; vkládání
  položek dělá uživatel (Claude dodá hotový obsah).
- `dist/` je generované — needitovat. `reference/` je read-only.
- Stávající admin položky („Font", „Pokus s variantou") se nepřepisují.
