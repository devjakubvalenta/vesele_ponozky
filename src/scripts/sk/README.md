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
- **měna a formát čísla** — `CURRENCY`, `DECIMALS` a `DECIMAL_SEP` v popupu
  košíku i v pokladně. Eura mají halíře, koruny ne: bez `DECIMALS = 2` svítilo
  na slovenském mobilu v přeškrtnuté ceně „10 Kč“ místo „9.99 €“,
- **regulárky na platformní texty** — `40-product-detail.js` pozná i slovenské
  „podkolienky“ a nativní tab „Parametre“,
- **ID** — CMS stránky a kategorie podle mapy,
- **komentáře zůstávají české** — jsou to interní poznámky, ne obsah webu.

Naopak se **nepřekládají regulárky na texty z administrace**. Slovenský shop je
duplikát českého, takže tam dodnes visí české formulace („ZDARMA NAD 999 Kč“
u Zásilkovny, „Souhlasím se zasíláním…“ u newsletteru). Kód proto umí OBA
jazyky na obou shopech — `FREE_RE`, `FREE_PRICE_RE` a `PICKUP_RE` v pokladně
a předpona „Ne“ u souhlasů, která se lepí před slovo skutečně nalezené
v popisku. Jednojazyčná varianta by tiše nedělala nic.

> ⚠️ **Generátor sám čistotu nezaručí.** Detektor zbytků hledá písmena ě/ř/ů,
> a `Kč`, `Velikost` ani `ZDARMA` žádné nemají — přesně tudy tyhle chyby
> prošly. Druhé síto je `PODEZRELE` v `i18n/sk-texty.mjs`; když přidáš text,
> který má česky i slovensky stejná písmena, rozšiř ho.

## ⚠️ Před nasazením vyplnit

V `40-product-detail.js` jsou v ceníku dopravy placeholdery
`{{SK_DOPRAVCA_1..3}}`, `{{SK_ZADARMO_1..3}}`, `{{SK_CENA_1..3}}` a v FAQ
`{{SK_DOPRAVA_ZADARMO_OD}}`. **Zákazník je uvidí na stránce**, dokud je
nevyplníš v `i18n/sk-texty-detail.mjs` / `sk-texty-faq.mjs` a nepřegeneruješ.

Taky vyřeš **Koloo** — na slovenském shopu hází chybový `alert()` každému
návštěvníkovi, protože licence není povolená pro tu doménu.

## ⚠️ Co musí doplnit administrace slovenského shopu

Tohle **kód dodat nemůže** — je to obsah a nastavení na straně serveru:

1. **Produktové bloky vůbec neexistují.** Český shop má tři („Upsell košík"
   `3177`, „Novinky" `3224`, „Dárkové sety" `3236`), slovenský ani jeden
   (ověřeno: v HTML 28711 není jediný `recommend-block-*`). Důsledky:
   - v popupu „přidáno do košíku" chybí **Doporučené produkty**, a protože je
     platforma nemá co vykreslit, pošle rovnou **jednodušší popup i bez
     progress baru** — viz `45-cart-popup.js`,
   - na homepage chybí produktové řady, které na CZ jedou přes
     `%recommend_block_3224%` / `%recommend_block_3236%`.

   Řešení: *Administrace → Produktové bloky* → založit ekvivalenty a jejich
   nová ID doplnit do obsahu SK homepage. Pak se popup přepne na bohatou
   variantu sám, CSS i JS na ni už jsou připravené.

2. **Přeložit texty dopravy a plateb.** U Zásilkovny je pořád český název
   „Zásilkovna - výdejní místa a boxy - **ZDARMA NAD 999 Kč**“ — a to je
   navíc věcně špatně, limit dopravy zdarma na SK je **40 €**. Skript číslo
   i měnu jen přebírá z názvu, nepřepisuje je, takže zákazník tu nesrovnalost
   uvidí, dokud se název neopraví v administraci.

3. **Přeložit popisky souhlasů, formuláře a hlavičku košíku** („Souhlasím se
   zasíláním…“, „Jméno a příjmení“, „Mobilní telefon“, „Dodací adresa“,
   „Objednat“…) a **vyměnit logo** — v hlavičce je pořád `veseleponozky.cz`.
