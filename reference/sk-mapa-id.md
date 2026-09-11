# Slovenská mutace — mapa ID a otevřené body

Slovenský shop: **28711** (`https://www.exitshop.cz/shops/28711/`, cílová doména
`veseleponozky.sk`). Český shop: 28056 (`veseleponozky.cz`).

Zjištěno čtením obou shopů 2026‑09‑02.

## Co se NEMĚNÍ

**Média — cesta `/files/310/` zůstává.** Je to ID **účtu**, ne shopu, a oba
shopy jedou pod stejným účtem. Všech 195 odkazů na obrázky v obsahu i ve
skriptech funguje na SK beze změny a **89 souborů se nemusí znovu nahrávat.**

**Firemní údaje** — provozovatel je stejná česká společnost (Moda Čapek s.r.o.,
IČ 02605104), takže adresa, telefon i e-maily zůstávají české.

**Newsletter** — stejný Ecomail seznam (formulář 4, účet witsocks) i stejný
slevový kód `VESELE15`.

**Heureka** — zůstává český odznáček „Ověřeno zákazníky“.

**CSS** — slovenský shop bere tentýž `dist/custom.css` z jsDelivru. Jazykově
neutrální je celý až na dvě slova, která přebíjí položka
`src/scripts/sk/00-css-sk-override.html`.

## CMS stránky

| stránka | CZ | SK |
|---|---|---|
| O nás | 56952 | **61597** |
| Doprava a platba | 56955 | **61600** |
| Výroba na zakázku | 56958 | **61603** |
| Velkoobchodní spolupráce | 60945 | **61606** |
| Recenze | 60954 | **61609** |
| Výroba | 60948 | **61612** |
| Vrácení zboží | 60957 | **61618** |
| GDPR | 60951 | **61621** |
| Kontakty | 60969 | **61624** |
| Všeobecné obchodní podmínky | 60960 | **61615** |

ℹ️ **Slug v URL nerozhoduje, jen ID.** `/cms/61597-xyz` i `/cms/61597` server sám
přesměruje na `/cms/61597-o-nas` (ověřeno 2026‑09‑08). Přejmenování stránek
v administraci — a tím i změna slugu — tedy naše odkazy v obsahu nerozbije.

ℹ️ Pozor při dohledávání ID: **VOP (61615) nejsou prolinkované v navigaci**, takže
se nenajdou vyčtením odkazů ze stránek. Navigace jich ukazuje 9, ve skutečnosti
je jich 10 — úplný seznam je v administraci pod „Podstránky".

⚠️ Právní stránky (VOP, GDPR, Vrácení zboží) na SK existují jen jako duplikát
s **českým textem**. Překlad je po dohodě mimo rozsah — slovenské spotřebitelské
právo a dozorové orgány jsou jiné, přeložit český text nestačí.

⚠️ Odkaz bez prefixu shopu (`/cms/60954-recenze`) na SK shopu **končí 404** —
odejde mimo shop. Proto se musí přemapovat všechny, ne jen ty viditelné.

## Kategorie

| účel | CZ | SK |
|---|---|---|
| Výprodej až -90 % | 1243142 | **1254445** |
| Dárkové sety | 1243139 | **1254442** |
| Pánské Veselé ponožky | — | **1254433** |
| Dámské Veselé ponožky | — | **1254436** |
| Dětské Veselé ponožky | — | **1254439** |
| Katalog (root) | 1196952 | neexistuje → míříme na 1254445 |

⚠️ **Česká ID pod slovenským prefixem vracejí HTTP 200, ale jsou rozbitá.**
`/shops/28711/c/1243445-multipack` se načte bez `<h1>` a vysype výpis všech 569
produktů — tiše spadne na „všechno zboží“. Rozbitý odkaz se tedy nepozná podle
stavového kódu, jen podle obsahu.

## Otevřené body — bez nich se SK verze nedá nasadit

1. **Koloo hází návštěvníkům chybový `alert()`.** Licence `UNI-FB75BE3A-1714`
   není povolená pro doménu slovenského shopu:
   *„Doména www.exitshop.cz není na seznamu povolených domén pro tuto kampaň.“*
   Vyskočí hned po načtení každé stránky. Buď doplnit doménu do kampaně na
   my.koloo.net, nebo položku Koloo na SK shopu odstranit.

2. **Čtyři barevné kategorie z HP na SK neexistují.** České 1243445 MultiPACK,
   1243460 Zdravotnictví, 1243463 Káva a 1243517 Adventní kalendáře duplikace
   nepřenesla — slovenský strom je má jen jako podkategorie pod Pánské, Dámské
   a Dětské. Dokud nevzniknou, míří mobilní menu na čtyři hlavní kategorie
   (viz `i18n/sk-ids.mjs` → `SIDE_CATEGORIES_SK`). Až je založíš, přepiš ID
   v `i18n/sk-texty.mjs` a spusť `node build-sk.mjs`.
   **Dlaždice kategorií na HP** míří v nastavení SK shopu pořád na česká ID —
   to je nastavení administrace, ne náš kód, oprav ho tam.

3. **Produktové bloky na HP neexistují.** `%recommend_block_3224%` (To nejlepší
   právě v akci) a `%recommend_block_3236%` (Dárkové sety) jsou česká ID.
   Založ je v SK administraci a pošli mi ID — do té doby jsou v obsahu
   placeholdery `{{SK_BLOK_AKCE}}` a `{{SK_BLOK_SETY}}`.

4. **Ceník dopravy v eurech.** V `src/scripts/sk/40-product-detail.js` jsou
   placeholdery `{{SK_DOPRAVCA_1..3}}`, `{{SK_ZADARMO_1..3}}`, `{{SK_CENA_1..3}}`
   a `{{SK_DOPRAVA_ZADARMO_OD}}`. **Zákazník je uvidí na stránce, dokud je
   nevyplníš** — nenasazovat dřív. Stejný seznam je i v obsahové stránce
   Doprava a platba.

5. **Právní stránky** (VOP, GDPR, Vrácení zboží) jsou mimo rozsah — dohodnuto,
   že si je necháš udělat zvlášť. Slovenské spotřebitelské právo a dozorové
   orgány jsou jiné než české, překlad českého textu nestačí.

6. **HTTPS na veseleponozky.sk nefunguje.** Doména už běží (ověřeno 2026‑09‑11:
   `http://www.veseleponozky.sk/` vrací slovenský shop), ale **certifikát
   nepokrývá `www.veseleponozky.sk`** — prohlížeč na `https://` ukáže bezpečnostní
   varování. Dokud to není vyřešené u platformy/registrátora, nepřesměrovávat
   zákazníky na .sk a nedávat .sk adresu do e-mailů ani reklam.

## Co zbývá česky v administraci SK shopu

Tohle náš kód vyřešit nemůže, jsou to data v administraci:

- **Názvy kategorií** — menu ukazuje „Pánské Veselé ponožky“, protože `header.js`
  bere název z navigace (schválně, aby se neudržoval na dvou místech).
  Přejmenovat je musíš v administraci.
- **Parametry produktů** — „Je hlavní produkt / Ano / Motiv / Povolání / Velikost“
  se na detailu vypisují z katalogu.
- **Loga dopravců** v `doprava.html` jsou hashe z **českého** košíku
  (`/files/310/media/shipping/<hash>.png`). Načtou se (310 je ID účtu), ale
  ukazují metody, které ve slovenské pokladně nejsou — přepiš je spolu s cenami.

## Jak se to generuje

Skripty se **nepíšou ručně**, generují se z české verze:

```bash
node build-sk.mjs           # → src/scripts/sk/*.js
node build-sk.mjs --check   # jen kontrola, nic nezapíše
```

Zdroj pravdy je pořád čeština v `src/scripts/*.js`; slovník je
`i18n/sk-texty.mjs` (+ `sk-texty-detail.mjs` a `sk-texty-faq.mjs` pro detail
produktu) a mapa ID `i18n/sk-ids.mjs`. Když se změní čeština, stačí
přegenerovat — generátor ohlásí, která náhrada se přestala trefovat a co zbylo
nepřeložené. Komentáře v kódu zůstávají české schválně, jsou to interní
poznámky.

Obsahové stránky v `src/content/sk/` se naopak píšou ručně — je to souvislá
próza, ne kód. Kontroluje je samostatný nástroj:

```bash
node check-sk.mjs
```

Hlídá tři věci, které se při překladu nejsnáz přehlédnou: zbytky češtiny
(písmena ě/ř/ů, která slovenština nemá — vlastní jména jako Třeboň má
na seznamu výjimek), česká ID CMS stránek a kategorií, a nevyplněné značky
`{{SK_…}}`. Komentáře přeskakuje, ty zůstávají česky schválně.

**Stav k 2026‑09‑07:** 11 souborů, 0 nálezů, 23 nevyplněných značek
(všechny v `doprava.html`). Struktura sedí 1:1 s češtinou u všech souborů —
jediná odchylka je na homepage, kde místo dvou odstavců s neexistujícími
produktovými bloky stojí komentář.
