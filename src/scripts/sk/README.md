# src/scripts/sk/ — položky do admin „Skripty" slovenského shopu (28711)

⚠️ **Soubory `*.js` v této složce jsou GENEROVANÉ — needituj je.**
Vznikají z české verze příkazem `node build-sk.mjs`. Úprava patří do českého
originálu v `src/scripts/` nebo do slovníku v `i18n/`, pak přegenerovat.
Ručně psané jsou jen `00-css-sk-override.html` a
`10-force-variant-selection.html` (build-sk.mjs umí pouze `*.js`).

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
| `10-force-variant-selection.html` | Pokus s nutností vybrat variantu. JS i CSS | **Pouze produktový detail** | ne |

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

## ✅ Placeholdery jsou vyplněné

Ceník dopravy v `40-product-detail.js` (`{{SK_DOPRAVCA_1..3}}`, `{{SK_ZADARMO_1..3}}`,
`{{SK_CENA_1..3}}`) i `{{SK_DOPRAVA_ZADARMO_OD}}` ve FAQ už mají v `i18n/` reálné
hodnoty. Kontrola: `node check-sk.mjs` → 13 souborů, 0 nálezů, 0 nevyplněných
značek (ověřeno 2026‑09‑16).

> ⚠️ Kdyby se značka `{{SK_…}}` někdy vrátila do pole **„Produktový detail"**,
> shodí render CELÉ stránky — je uvnitř Vue, takže `{{ COKOLI }}` je pro ni
> interpolace a neznámý název skončí `ReferenceError`em. V HTML komentáři jsou
> složené závorky neškodné; tak jsou dnes v obsahu poznámky o blocích na HP.

**Koloo** zákazníky neobtěžuje — na `.sk` běží slovensky a bez chyby. Chybový
`alert()` o nepovolené doméně vyskakuje jen na technické adrese `exitshop.cz`.

## ⚠️ Co musí doplnit administrace slovenského shopu

Tohle **kód dodat nemůže** — je to obsah a nastavení na straně serveru.
Plný seznam s důkazy je v [reference/sk-mapa-id.md](../../reference/sk-mapa-id.md);
tady jsou body, které se dotýkají chování našich skriptů:

1. **Celá platformní vrstva renderuje česky** i při `<html lang="sk">`.
   Důkaz, že nejde o obsah: 404 stránka hlásí „Je nám líto, ale požadovaná
   stránka nebyla nalezena." Odtud je „Přidat do košíku", „Zákazníci také
   nakupují", cookie lišta, breadcrumb „Domů" i většina popisků v košíku.
   Řešit **nastavením jazyka shopu**, ne patchováním řetězců v JS — náš kód umí
   oba jazyky schválně, jako pojistku.

2. **Produktové bloky vůbec neexistují.** Český shop má tři („Upsell košík"
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

3. **Doprava zdarma je v korunách.** Metoda se jmenuje „Zásilkovna - výdejní
   místa a boxy - **ZDARMA NAD 999 Kč**" — na eurovém shopu, kde má být
   **zadarmo od 39,99 €** (jeden plochý limit na obě metody, potvrzeno
   2026-09-17). Skript slovo „ZDARMA" přeloží, ale číslo a měnu jen přebírá
   z názvu, takže zákazník tu nesrovnalost vidí, dokud se název neopraví
   v administraci.

   ⚠️ **Obsahová strana už 39,99 € hlásí** — USP bloky na HP i detailu,
   ceník a FAQ v produktovém detailu i stránka Doprava a platba. Dokud se
   neopraví název metody, slíbí web 39,99 € a pokladna 999 Kč.

4. **Platba kartou v pokladně chybí.** Nabízí se jen `bank_transfer`,
   `clone_4171` (Google Pay), `clone_4174` (Apple Pay) a `cash_on_delivery`.
   `00-css-sk-override.html` přitom stylizuje `label[for="comgate"]` — až kartu
   založíš, override začne platit sám, nic se nemusí měnit.

5. **Oznamovací lišta a nadpisy v patičce.** „VESELÉ PONOŽKY SE SLEVOU AŽ 90%"
   bere `countdown-bar.js` z `#notification-bar-text` (obsah lišty z admina),
   „KATEGORIE / INFORMACE / SÍDLO FIRMY / ADRESA SKLADU" jsou nativní
   `.footer-column` — `footer.js` jim jen přidává třídu kvůli akordeonu.

6. **Logo a e-mail ukazují na `.cz`.** Logo SVG vykresluje „Veselé ponožky.cz"
   (`alt` už je správně) a v hlavičce visí `ponozky@veseleponozky.cz`, přestože
   SK schránka `ponozky@veseleponozky.sk` existuje.
