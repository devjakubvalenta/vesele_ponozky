# src/scripts/sk/ — položky do admin „Skripty" slovenského shopu (28711)

⚠️ **Soubory `*.js` v této složce jsou GENEROVANÉ — needituj je.**
Vznikají z české verze příkazem `node build-sk.mjs`. Úprava patří do českého
originálu v `src/scripts/` nebo do slovníku v `i18n/`, pak přegenerovat.
Ručně psaný je jen `00-css-sk-override.html`.

Slovenský shop **sdílí s českým**: `dist/custom.css` z jsDelivru, všechna média
(`/files/310/…` je ID účtu, ne shopu) a Ecomail newsletter. Liší se jen texty
a ID kategorií a CMS stránek — mapa je v
[reference/sk-mapa-id.md](../../reference/sk-mapa-id.md).

## Mapa souborů → položky

| soubor | název položky | zobrazit na | v Head |
|---|---|---|---|
| *(sdílený `<link>` na CDN)* | github | Na všech stránkách | **ANO** |
| `00-css-sk-override.html` | CSS – slovenské texty | Na všech stránkách | **ANO** (za „github") |
| `footer.js` | patička | Na všech stránkách | ne |
| `countdown-bar.js` | Odpočet v liště | Na všech stránkách | ne |
| `30-product-cards.js` | Produktové karty | Na všech stránkách | ne |
| `hp-categories.js` | Kategorie na HP | Na všech stránkách | ne |
| `header.js` | Hlavička | Na všech stránkách | ne |
| `35-listing-sort.js` | Řazení ve výpisech | Na všech stránkách | ne |
| `36-filter.js` | Filtr + podkategorie | Na všech stránkách | ne |
| `45-cart-popup.js` | Popup přidáno do košíku | Na všech stránkách | ne |
| `50-checkout.js` | Pokladna | Na všech stránkách | ne |
| `40-product-detail.js` | Produktový detail | **Pouze produktový detail** | ne |

`hp-categories.js` **nemá slovenskou verzi** — neobsahuje jediný text ani ID,
takže se bere přímo z české složky (`src/scripts/hp-categories.js`).

Pořadí položek zachovej stejné jako na českém shopu.

## Jak vložit

Stejně jako na CZ: obsah souboru obalený do `<script>…</script>`, nebo po
finalizaci odkaz na CDN s pinnutým hashem:

```html
<script src="https://cdn.jsdelivr.net/gh/devjakubvalenta/vesele_ponozky@<hash>/src/scripts/sk/footer.js"></script>
```

## Co se změnilo proti češtině

- **texty** — všechny viditelné řetězce (recenze, newsletter, FAQ, materiál
  a péče, popisky tlačítek, hlášky odpočtu),
- **měna** — popup košíku píše `€` místo `Kč`,
- **regulárky na platformní texty** — `50-checkout.js` hledá „zadarmo nad … €“
  místo „zdarma nad … Kč“ a opt-out u newsletteru reaguje na „Súhlasím“;
  `40-product-detail.js` pozná i slovenské „podkolienky“ a nativní tab
  „Parametre“,
- **ID** — CMS stránky a kategorie podle mapy,
- **komentáře zůstávají české** — jsou to interní poznámky, ne obsah webu.

## ⚠️ Před nasazením vyplnit

V `40-product-detail.js` jsou v ceníku dopravy placeholdery
`{{SK_DOPRAVCA_1..3}}`, `{{SK_ZADARMO_1..3}}`, `{{SK_CENA_1..3}}` a v FAQ
`{{SK_DOPRAVA_ZADARMO_OD}}`. **Zákazník je uvidí na stránce**, dokud je
nevyplníš v `i18n/sk-texty-detail.mjs` / `sk-texty-faq.mjs` a nepřegeneruješ.

Taky vyřeš **Koloo** — na slovenském shopu hází chybový `alert()` každému
návštěvníkovi, protože licence není povolená pro tu doménu.
