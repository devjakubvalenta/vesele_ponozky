# src/scripts/ — položky pro administraci „Skripty"

Sekce **Administrace → Skripty** je správce položek (ne jedno pole). Každý soubor
zde = **jedna položka**. Obsah se vkládá **včetně tagů** (`<script>…</script>`,
`<style>…</style>`, `<link>`). Soubor zkopíruj celý do pole položky.

## Mapa souborů → položky

| Soubor | Název položky v admin | Zobrazit na stránkách | Umístit v Head | Stav |
|--------|------------------------|------------------------|----------------|------|
| `00-css-cdn-link.html` | github | Na všech stránkách | **ANO** | ✅ **nasazeno** — položka „github", ověřeno živě (CSS jde z CDN) |
| `10-force-variant-selection.html` | Pokus s nutností vybrat variantu. JS i CSS | Pouze produktový detail | ne (patička) | ✅ **už nasazeno** v admin — tady jen verzovaný zdroj |
| `footer.js` | patička (sock strip + recenze + badge + logo + accordion) | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…/src/scripts/footer.js">` |
| `countdown-bar.js` | Odpočet v liště | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…/src/scripts/countdown-bar.js">`; datum konce akce (TARGET) je v souboru |
| `30-product-cards.js` | Produktové karty (název, datum, Zobrazit vše) | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…/src/scripts/30-product-cards.js">`; mapa „Zobrazit vše" (SHOW_ALL) a prefixy názvů jsou v souboru |

> ⚠️ **Sekce „Skripty" vkládá obsah DOSLOVA** (neobaluje ho). `<link>` a
> `<style>` vkládej **holé** — NIKDY ne uvnitř `<script>…</script>` (browser by
> je ignoroval). Do `<script>` patří jen JavaScript. (Toto nás jednou zdrželo:
> `<link>` byl omylem obalený v `<script>` → CSS se nenačítalo.)

## Už existující položky v administraci (NEPŘEPISOVAT)

- **„Font"** — Na všech stránkách (Space Grotesk). Mimo tento repo.
- **„Pokus s nutností vybrat variantu. JS i CSS"** — Pouze produktový detail.
  Zdroj je `10-force-variant-selection.html`. Když ji upravíš tady, **ručně**
  přenes do admin položky (CSS přes jsDelivr se jí netýká).

Nové položky vždy **přidáváme**, stávající nepřepisujeme.

## Co dělá `30-product-cards.js`

Doplňky k CSS produktových karet (`src/css/25-products.css`) ve všech
výpisech `.products`: (1) rozdělí název na 2 řádky — černý typ produktu
+ modrý motiv (dělí se na první „ - ", jinak podle prefixů v
`NAME_PREFIXES`); (2) obalí datum v „doručíme 15.07." do
`.pc-delivery-date` (zelené); (3) pod HP produktové bloky přidá tlačítko
„Zobrazit vše" podle mapy `SHOW_ALL` (`{id bloku: URL}` — blok bez
záznamu tlačítko nemá). Idempotentní, MutationObserver zpracuje i karty
dorenderované AJAX filtrováním v kategorii.

## Co dělá `10-force-variant-selection.html`

U variantních produktů (`.variant-name`, `#variant-selector`,
`#configurator-variants`) zamkne tlačítko „do košíku", dokud zákazník nevybere
variantu; přidá hlášku „Nejprve vyberte variantu." a zruší zvýraznění
„předvybrané" varianty. Kořen `#app`, košík
`.product-add-to-shopping-basket(-wrapper)`. Při hash variantě (`#variant-123`)
se zámek přeskočí.
