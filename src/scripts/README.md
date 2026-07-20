# src/scripts/ — položky pro administraci „Skripty"

Sekce **Administrace → Skripty** je správce položek (ne jedno pole). Každý soubor
zde = **jedna položka**. Obsah se vkládá **včetně tagů** (`<script>…</script>`,
`<style>…</style>`, `<link>`). Soubor zkopíruj celý do pole položky.

## Mapa souborů → položky

| Soubor | Název položky v admin | Zobrazit na stránkách | Umístit v Head | Stav |
|--------|------------------------|------------------------|----------------|------|
| `00-css-cdn-link.html` | github | Na všech stránkách | **ANO** | ✅ **nasazeno** — položka „github", ověřeno živě (CSS jde z CDN) |
| `10-force-variant-selection.html` | Pokus s nutností vybrat variantu. JS i CSS | Pouze produktový detail | ne (patička) | ✅ **už nasazeno** v admin — tady jen verzovaný zdroj |
| `footer.js` | patička (sock strip + recenze + badge + logo + accordion + newsletter) | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…/src/scripts/footer.js">`; newsletter = **Ecomail embed widget** (formulář ID 4, účet witsocks) mountovaný do brandového bloku, styl `src/css/32-newsletter.css`. **Nevkládej Ecomail embed zvlášť** — footer.js si widget načte sám (jinak by běžel 2×). Ecomail vynucuje reCAPTCHA, proto NE syrový POST — viz paměť `ecomail-robotcheck` |
| `countdown-bar.js` | Odpočet v liště | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…/src/scripts/countdown-bar.js">`; datum konce akce (TARGET) je v souboru |
| `30-product-cards.js` | Produktové karty (název, datum, Zobrazit vše) | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…/src/scripts/30-product-cards.js">`; mapa „Zobrazit vše" (SHOW_ALL) a prefixy názvů jsou v souboru |
| `hp-categories.js` | Kategorie na HP (přesun + barevné dlaždice) | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…@<hash>/src/scripts/hp-categories.js">` — **pin hashem** jako u CSS linku, bump jen při změně souboru; styl `src/css/28-hp-kategorie.css` |
| `header.js` | Hlavička (Heureka + zákaznická linka + cart ikona) | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…@<hash>/src/scripts/header.js">` — **pin hashem**; styl `src/css/20-header.css`. Telefon/e-mail v lince se čtou z pole „Doplňující informace" (nemazat ho) |
| `40-product-detail.js` | Produktový detail (recenze, slevový pill, množství) | **Pouze produktový detail** | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…@<hash>/src/scripts/40-product-detail.js">` — **pin hashem**; styl `src/css/24-product-detail.css`; benefity do admin pole „Produktový detail" = `src/content/product-detail-benefits.html` |
| `35-listing-sort.js` | Řazení ve výpisech (klikací odkazy) | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…@<hash>/src/scripts/35-listing-sort.js">` — **pin hashem**; styl `src/css/26-listing-sort.css` |
| `36-filter.js` | Filtr — výchozí sbalený na mobilu | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…@<hash>/src/scripts/36-filter.js">` — **pin hashem**; styl `src/css/27-filter.css` |

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

## Co dělá `35-listing-sort.js`

Nativní roletku řazení ve výpisech (`select.sorting` v toolbaru nad
gridem — kategorie, hlavní výpis, hledání) přestaví na **klikací odkazy
zarovnané vpravo**; počet položek („Zobrazeno 1–3 z 3") se přesune vlevo.
Odkazy vznikají z `<option>` (text = popisek, `href` = `option.value`,
což je cílová URL), takže klik je obyčejná navigace a funguje i bez JS na
kliknutí. Aktivní volba (`<option selected>`) dostane `.is-active`
(modrá + podtržení) a `aria-current`. Styl dodává `src/css/26-listing-sort.css`
(scope `.vp-sort-row`); JS jen přidá třídy a postaví `<nav.vp-sort>`.
Idempotentní; mimo výpisy (chybí `select.sorting`) neudělá nic;
MutationObserver zpracuje i toolbar překreslený AJAX filtrováním v kategorii.

## Co dělá `36-filter.js`

Řídí **výchozí stav filtru** ve výpisu kategorie podle šířky displeje:
na **mobilu (<768 px)** filtr sbalí (platforma ho jinak renderuje otevřený
přes inline `style="display:flex"`, který CSS nepřebije), takže se otevírá
až tlačítkem „Filtr"; na **desktopu (≥768 px)** nedělá nic — vždy otevřený
sidebar a skryté tlačítko řeší CSS (`src/css/27-filter.css`). Nativní
toggle (`.filter-button`) funguje dál. Tlačítko přejmenuje na „Filtr".
Po prvním kliknutí uživatele na toggle se přestane vynucovat sbalení
(`userToggled`). Idempotentní; mimo výpis kategorie (chybí
`.category-filters-collapsible`) neudělá nic.

## Co dělá `header.js`

Do hlavičky přidá tři věci a jednu skryje: (1) **Heureka odznak**
„97 % zákazníků doporučuje" (`heureka_banner.png`) dovnitř `.logotype` vedle
loga; (2) **zákaznickou linku** `.vp-hdr-care` (fotka `kontakt.svg` + telefon
+ otevírací doba + e-mail) za vyhledávání — **data čte z nativního pole
„Doplňující informace"** (`.company-info a.phone` / `a.mail`), takže se mění
v adminu bez kódu; (3) **vlastní ikonu košíku** (`cart.svg` místo Bootstrap
`bi-handbag`). CSS (`20-header.css`) zároveň skryje duplicitní kontakt nahoře
v modré liště — **pole „Doplňující informace" ale nechat vyplněné** (je zdroj
dat pro linku). Zákaznická linka je jen na desktopu (≥992 px). Idempotentní.

## Co dělá `hp-categories.js`

Nativní HP sekci „Titulek a kategorie" (`.category-circle-section`, renderuje
se mezi bento kompozicí a `#homepage_text`) přesune DOVNITŘ `#homepage_text`
hned za sekci recenzí `.vp-recenze--hp` (fallback za benefits pás) a zapne
její restyle na barevné dlaždice
(`src/css/28-hp-kategorie.css`, scope `.vp-cats`): každé dlaždici přidá
`vp-cat-c1..c4` (červená → žlutá → modrá → zelená), u víceslovných názvů
obalí slova 2+ do `.vp-cat-accent` (akcentní barva dle dlaždice). Kategorie
se dál plně spravují v adminu (multiselect + pořadí v manageru Kategorie).
Idempotentní; bez skriptu zůstává sekce v nativní pozici i vzhledu. Mobilní
swipe dodává CSS scroll-snap v `28-hp-kategorie.css` — šablonová třída
`only-mobile-slider` je na tomto shopu mrtvý hook (Swiper se nenačítá,
`window.Swiper` je `undefined`, ověřeno i s mobilním UA).

## Co dělá `40-product-detail.js`

Doplňky k CSS redesignu detailu (`src/css/24-product-detail.css`, scope
`#app.product-detail`): (1) pod hlavní obrázek vloží pás recenzí
`.vp-recenze--pd` („Přes 500 tisíc prodaných párů" + 3 karty — reuse
komponenty z `95-recenze.css`); (2) klonuje slevový pill „-46 %" do
pravého sloupce (`.pd-discount-pill`) a synchronizuje ho MutationObserverem
se zdrojem na obrázku (Vue v-if — mizí/mění se při přepnutí varianty);
(3) vloží label „Množství" (`.pd-qty-label`) nad stepper; (4) pojistka na
zvýraznění data doručení. Nic nepřesouvá (Vue-safe, pořadí řeší CSS flex
order) a respektuje zámek z `10-force-variant-selection.html`
(`variant-selection-required` → bílé chipy + ztlumené CTA). Idempotentní.

## Co dělá `10-force-variant-selection.html`

U variantních produktů (`.variant-name`, `#variant-selector`,
`#configurator-variants`) zamkne tlačítko „do košíku", dokud zákazník nevybere
variantu; přidá hlášku „Nejprve vyberte variantu." a zruší zvýraznění
„předvybrané" varianty. Kořen `#app`, košík
`.product-add-to-shopping-basket(-wrapper)`. Při hash variantě (`#variant-123`)
se zámek přeskočí.
