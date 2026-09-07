# src/content/ — verzovaný HTML obsah CMS stránek

CMS nemá git, takže HTML obsahových stránek držíme **zde jako zdroj pravdy** a
**nasazujeme ručně** do administrace (vkládá uživatel). Styl dodává `src/css/*`
přes CDN (scope dle obalové třídy).

## Mapa souborů → CMS stránky

| Soubor | CMS stránka v admin | URL | Scope CSS | Stav |
|--------|---------------------|-----|-----------|------|
| `onas.html` | CMS a blog → **O nás** | `cms/56952-o-nas` | `.vp-onas` (`src/css/40-onas.css`) | ⏳ vkládá uživatel (zdrojový `</>` režim) |
| `gdpr.html` | CMS a blog → **GDPR** | `cms/60951-gdpr` | `.vp-legal` (`src/css/80-legal.css`) | ⏳ vkládá uživatel (zdrojový `</>` režim) |
| `vop.html` | CMS a blog → **Všeobecné obchodní podmínky** | `cms/60960-vseobecne-obchodni-podminky` | `.vp-legal` (`src/css/80-legal.css`) | ⏳ vkládá uživatel (zdrojový `</>` režim) |
| `vraceni.html` | CMS a blog → **Vrácení zboží** | `cms/60957-vraceni-zbozi` | `.vp-vraceni` (`src/css/90-vraceni.css`) | ⏳ vkládá uživatel (zdrojový `</>` režim); formuláře přes `%vratka%`/`%reklamace%` |
| `recenze.html` | CMS a blog → **Recenze** | `cms/60954-recenze` | `.vp-recenze` (`src/css/95-recenze.css`) | ⏳ vkládá uživatel (zdrojový `</>` režim) |
| `doprava.html` | CMS a blog → **Doprava a platba** | `cms/56955-doprava-a-platba` | `.vp-doprava` (`src/css/85-doprava.css`) | ⏳ vkládá uživatel (zdrojový `</>` režim). Seznam dopravy/plateb **musí sedět s košíkem** (ověřuje se na `/cart`); ikony metod se berou přímo z `/files/310/media/shipping\|payment/…`, tedy tytéž, co vidí zákazník v pokladně. Blok o platební bráně potřebuje nahrát do médií `assets/pay/{comgate,visa,mastercard}.svg` |
| `dekovacka.html` | Obsah → **Děkovačka / potvrzovací stránka** | `/thankyou` (jen po odeslání objednávky) | `.vp-dekovacka` (`src/css/12-dekovacka.css`) | ⏳ vkládá uživatel (zdrojový `</>` režim); placeholdery `%o` `%k` `%e` `%u` — `%x` (datum) NEOVĚŘENÝ, viz komentář v souboru. CSS stylizuje i nativní tabulku zboží a adres (scope `section.thankyou`) |
| `product-detail.html` | Obsah → **Produktový detail** | detail každého produktu | `.pd-benefits` (`24-product-detail.css`) + `.pd-size-src` (`24-size-chart.css`) | ⏳ vkládá uživatel (zdrojový `</>` režim); pás benefitů + **skrytý zdroj tabulky velikostí** (jedna `.pd-size-item` = jedna záložka v okně; sedmá záložka se přidá tady, ne v kódu). ⚠️ Karta „Zvýhodněné balení“ tady NENÍ — jede z nativních **Doplňkových služeb**, viz sekce níže |
| `countdown-source.html` | Obsah → **Patička, sekce 4** a/nebo **Úvodní stránka** | všechny stránky (blok je skrytý) | `#vp-cd-src` (`src/css/20-header.css`) | ⏳ vkládá uživatel (zdrojový `</>` režim); skrytý `%countdown%` = jediný zdroj konce akce pro odpočet v liště (`src/scripts/countdown-bar.js`). Do „Box pod hlavičkou“ NE — ten slot placeholder nerozbaluje |
| `homepage.html` | Nastavení designu → **Úvodní stránka** | `/shops/28056/` (HP) | `.content .benefits` (`26-benefits.css`) + `.vp-recenze--hp` (`27-hp-recenze.css`, základ z `95-recenze.css`) + `.vp-hpvyr` (`29-hp-vyroba.css`, placka z `70-trebon.css`) | ⏳ vkládá uživatel (zdrojový `</>` režim); benefits pás + recenze + `%recommend_block_*%` + sekce Výroba v Třeboni |

> `gdpr.html` i `vop.html` sdílejí jeden stylopis `src/css/80-legal.css` (scope `.vp-legal`) —
> jsou to vizuálně stejné textové/právní stránky, liší se jen obsahem.

## Karta „Zvýhodněné balení" na detailu produktu

Není v žádném obsahovém poli — je to **nativní blok „Doplňkové služby"**
(`additional services`), který si šablona vykresluje sama do pravého sloupce pod
tlačítko do košíku. Naše strana je jen vzhled: `24-product-detail.css` (sekce
„Zvýhodněné balení") a dvě drobnosti v `40-product-detail.js` (odkaz ve stejném
okně místo nové karty, cena bez úvodního plusu).

**Nastavuje se u KAŽDÉHO produktu zvlášť** v administraci — doplňková služba se
napáruje na produkt setu. Ověřeno 2026-09-01 na `ZDR11`: služba `data-service-id
21609` = „Dárkový set Zdravotnictví nízké 3 páry v dárkové krabičce (Z11Z12ZK)",
cena 399 Kč. Bez napárované služby šablona blok vůbec nevyrenderuje (element
`.additional-services-wrapper` v DOM chybí, není jen prázdný).

⚠️ Blok se skládá **až v prohlížeči** (Vue), takže ve staženém serverovém HTML
není — kontrolovat se musí ve vykresleném DOM:
`document.querySelector('.additional-services-wrapper')`.

⚠️ Nezaměňovat se starším blokem **„Příslušenství"** (`%primary_accessories%`),
přes který se karta dělala dřív (tehdy pod názvem „Výhodné balení"). Dnes se
nepoužívá — napárované příslušenství se na detailu neprojeví.

## Slovenská mutace (shop 28711)

Slovenské verze stránek jsou v podsložce **`sk/`**. Vkládají se do administrace
**slovenského** shopu 28711 (`https://www.exitshop.cz/shops/28711/`, doména
veseleponozky.sk) — jinak stejným způsobem, ve zdrojovém `</>` režimu.

Proti češtině se liší jen **text a ID**:

- CMS ID a ID kategorií podle mapy v [reference/sk-mapa-id.md](../../reference/sk-mapa-id.md)
  (odkaz s českým ID na SK shopu končí 404, u kategorií se dokonce tiše načte
  výpis všeho zboží),
- částky v korunách a jména českých dopravců jsou nahrazené značkami `{{SK_…}}`,
  které **se musí vyplnit před nasazením**,
- `%recommend_block_3224/3236%` jsou značky `{{SK_BLOK_AKCE}}` / `{{SK_BLOK_SETY}}`,
  protože slovenské produktové bloky zatím neexistují.

Co zůstává **shodné**: cesty k médiím (`/files/310/…` je ID účtu, ne shopu — oba
shopy sdílejí knihovnu), firemní údaje (týž provozovatel), CSS z CDN a Ecomail
newsletter.

Právní stránky (`vop.html`, `gdpr.html`, `vraceni.html`) slovenskou verzi
**záměrně nemají** — slovenské spotřebitelské právo a dozorové orgány jsou jiné,
překlad českého textu by nestačil.

Slovenské **skripty** se na rozdíl od obsahu negenerují ručně — viz
[src/scripts/sk/README.md](../scripts/sk/README.md).

## Jak nasadit

1. V administraci **CMS a blog → O nás** přepni editor do **zdrojového režimu** (`</>`).
2. Vlož celý obsah souboru, ulož, tvrdý reload stránky.
3. Při změně textu uprav i soubor tady (konzistence repo ↔ admin).

> Obrázky: nahraj v administraci (media), nahraď `PLACEHOLDER-*` URL skutečnými
> (`/files/7203/media/files/<jmeno>`).

> **URL bez domény.** Eshop běží na produkční doméně **www.veseleponozky.cz**
> (technická adresa téhož shopu je `www.exitshop.cz/shops/28056/`). Odkazy i
> obrázky proto piš vždy od kořene — `/cms/60954-recenze`, `/c/1243142-…`,
> `/files/310/files/…` — nikdy s doménou. Absolutní URL na `exitshop.cz`
> odvedou zákazníka z produkce na technickou adresu. Cesta `/files/…` je na
> obou stejná; `/cms/` a `/c/` mají na technické adrese navíc prefix
> `/shops/28056`, takže tam tyhle odkazy nefungují — obsah náhleduj na
> produkční doméně.
