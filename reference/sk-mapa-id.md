# Slovenská mutace — mapa ID a otevřené body

Slovenský shop: **28711** (`https://www.exitshop.cz/shops/28711/`, cílová doména
`veseleponozky.sk`). Český shop: 28056 (`veseleponozky.cz`).

Zjištěno čtením obou shopů 2026‑09‑02, **stav otevřených bodů přeověřen
živě 2026‑09‑16** na produkční doméně `www.veseleponozky.sk`.

## Co se NEMĚNÍ

**Média — cesta `/files/310/` zůstává.** Je to ID **účtu**, ne shopu, a oba
shopy jedou pod stejným účtem. Všech 195 odkazů na obrázky v obsahu i ve
skriptech funguje na SK beze změny a **89 souborů se nemusí znovu nahrávat.**

**Firemní údaje** — provozovatel je stejná česká společnost (Moda Čapek s.r.o.,
IČ 02605104), takže adresa i telefon zůstávají české.

> ⚠️ **Výjimka: zákaznický e-mail.** SK shop má vlastní schránku
> `ponozky@veseleponozky.sk` (potvrzeno 2026‑09‑16). `src/content/sk/kontakt.html`
> ji už používá, ale **hlavička SK shopu pořád ukazuje `ponozky@veseleponozky.cz`** —
> to je nastavení administrace. B2B kontakt (`david@modacapek.cz`) zůstává český.

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

Stav ověřen živě **2026‑09‑16** na produkční doméně `www.veseleponozky.sk`
(ne jen na technické adrese — ta se v některých bodech chová jinak).

### 1. ⛔ Tři bannery na homepage vedou do prázdna a jsou česky

`.slideshow-slides` + `.side-banners` jsou NATIVNÍ bannery z administrace
a duplikace v nich nechala české texty i **česká ID kategorií**:

| banner | odkaz | má být |
|---|---|---|
| „DÁRKOVÝ SET / JÍT NAKUPOVAT“ | `/c/1243139-darkove-sety` | **1254442** Darčekové sety |
| „LIMITOVANÉ EDICE / PROHLÉDNOUT“ | `/c/1243142-vyprodej-az-90` | **1254445** Výpredaj až ‑90% |
| „HOKEJ JE ŽIVOT / PROHLÉDNOUT“ | `/c/1243142-vyprodej-az-90` | **1254445** Výpredaj až ‑90% |

Ověřeno fetchem: obě česká ID na `.sk` **přesměrují na homepage** (žádný `<h1>`,
553 produktů = celý katalog). Správná ID vracejí 24 produktů a správný `<h1>`.
Jsou to tři největší CTA na stránce a nefunguje ani jedno.

### 2. ⛔ Celá platformní vrstva renderuje česky

`<html lang="sk">` je nastavené správně, a přesto jsou platformní řetězce české.
Důkaz, že nejde o naše texty ani o obsah: **404 stránka** hlásí „Je nám líto, ale
požadovaná stránka nebyla nalezena.“ — to nikdo needituje.

Odsud pochází naráz: breadcrumb „Domů“, cookie lišta („Tento web používá soubory
cookie… DALŠÍ VOLBY / PŘIJMOUT“), placeholder hledání „Hledat: Zdravotnictví,
káva, hokej…“, „Přidat do košíku“ na kartách i hlavní tlačítko na detailu,
„Zákazníci také nakupují“, a v košíku „ZBOŽÍ / Celkem / Mám slevový kupón /
Dodací adresa: / Jméno a příjmení / Mobilní telefon / Souhlasím s… / « Zpět do
obchodu“.

Řešit **jedním nastavením jazyka shopu** (případně dotazem na podporu
exitshop.cz), ne patchováním jednotlivých řetězců v JS. Náš kód umí oba jazyky
schválně — je to pojistka, ne řešení.

### 3. ⛔ Pokladna slibuje dopravu zdarma v korunách

Metoda se jmenuje `Zásilkovna - výdejní místa a boxy — Zadarmo nad 999 Kč —
2.99 €`. Eurový shop, korunový limit. Správně má být **zadarmo od 39,99 €** —
jeden plochý limit na OBĚ metody (potvrzeno uživatelem 2026‑09‑17). Skript slovo
„ZDARMA“ přeloží, ale číslo a měnu jen přebírá z názvu metody — opravit se to
musí v administraci.

✅ **Obsahová strana je hotová** (2026‑09‑17): částka 39,99 € je v USP blocich na
homepage i produktovém detailu, v ceníku a FAQ detailu a na stránce Doprava
a platba. Zbývá už jen název metody v administraci — do té doby slíbí web
39,99 € a pokladna 999 Kč.

### 4. ⛔ Stránka Doprava a platba neodpovídá pokladně

CMS 61600 slibuje: Packeta výdajné miesta 2,99 €, Packeta **doručenie domov
3,99 €**, **Platba kartou online zadarmo** (+ celá sekce „Ako prebieha online
platba“ s Comgate a 3D Secure).

Pokladna reálně nabízí dopravu pod jménem „Zásilkovna“ (ne Packeta) a platby
jen `bank_transfer` (QR kód/Bankovní převod), `clone_4171` (Google Pay),
`clone_4174` (Apple Pay) a `cash_on_delivery` (Na dobírku 1.69 €).
**Platba kartou v pokladně chybí úplně** — žádný `comgate`. Buď doplnit kartu
a doručení domů do pokladny, nebo srovnat CMS stránku s realitou.

ℹ️ `src/scripts/sk/00-css-sk-override.html` stylizuje `label[for="comgate"]`,
který na SK zatím neexistuje — až kartu založíš, override začne platit sám.

### 5. ✅ Produktové bloky na HP — HOTOVO (2026‑09‑17)

Založeny a ověřeny živě. **ID se mezi shopy nepřekládají**, každý má vlastní:

| blok | CZ | SK |
|---|---|---|
| To nejlepší právě v akci / To najlepšie práve v akcii | 3224 | **5254** |
| Dárkové sety / Darčekové sety | 3236 | **5266** |
| Upsell košík | 3177 | **5251** |

5254 a 5266 jsou v `src/content/sk/homepage.html` jako `%recommend_block_<ID>%`.
5251 se do obsahu **nevkládá** — páruje se v nastavení košíku; na `/cart` už se
`.cart-upsell` renderuje.

⚠️ **Oba HP bloky ukazují STEJNÉ čtyři produkty** (Zdravotníctvo nízke biele,
Zdravotníctvo biele, podkolienky, Mačky magenta) — u „Darčekové sety" to nesedí.
Nadpisy jsou správně, ale výběr produktů v bloku 5266 je potřeba doplnit
v administraci.

<details><summary>Původní znění bodu</summary>

Český shop má „To nejlepší právě v akci“ (`3224`) a „Dárkové sety“ (`3236`),
slovenský ani jeden (`recommend-block-*` v HTML 28711 = 0). Důsledky:

- na homepage chybí dvě produktové řady — v obsahu jsou zatím značky
  `{{SK_BLOK_AKCE}}` a `{{SK_BLOK_SETY}}` **uvnitř HTML komentáře**, takže je
  zákazník nevidí a nic nerozbíjejí,
- popup „pridané do košíka“ jede v ochuzené variantě bez progress baru —
  platforma nemá co vykreslit (viz `45-cart-popup.js`).

Založ je v SK administraci a ID dosaď do `src/content/sk/homepage.html`.

</details>

### 6. ⛔ Identita ukazuje na `.cz`

- **Logo je pořád české.** Soubor `/files/310/media/other/MX1l38A4BIgAgFSRuferpr9hl6wIMR6V.svg`
  vykresluje „Veselé ponožky**.cz**“ — `alt` už je správně „Veseléponožky.sk“,
  ale obrázek ne. Stejné logo je i na banneru s tričkem.
- **E-mail v hlavičce je `ponozky@veseleponozky.cz`**, i když SK schránka
  `ponozky@veseleponozky.sk` existuje (potvrzeno 2026‑09‑16) a `kontakt.html`
  ji už používá.
- **Meta description homepage** končí „…produktov Veseleponozky**.cz**“.

### 7. ⚠️ Náš kód: SK jede zastaralou pokladnu

`50-checkout.js` je na SK pinnutý na `@2cf01b4` a chybí mu commit `9f5e41b`
(upsell blok: pilulky místo dropdownu, +89 řádků). CZ už na něm jede. Oprava je
bump hashe v administraci, nic se negeneruje. Ostatní SK skripty i CSS jsou
aktuální (ověřeno `git diff` proti pinnutým hashům).

### 8. ⚠️ Právní stránky jsou česky

VOP (61615), GDPR (61621) a Vrátenie tovaru (61618) jsou duplikáty s **českým
textem**. Dohodnuto jako mimo rozsah — slovenské spotřebitelské právo a dozorové
orgány jsou jiné, překlad českého textu nestačí.

### 9. ⚠️ Čtyři barevné kategorie z HP na SK neexistují

České 1243445 MultiPACK, 1243460 Zdravotnictví, 1243463 Káva a 1243517 Adventní
kalendáře duplikace nepřenesla — slovenský strom je má jen jako podkategorie pod
Pánske, Dámske a Detské. Dokud nevzniknou, míří mobilní menu na čtyři hlavní
kategorie (viz `i18n/sk-ids.mjs` → `SIDE_CATEGORIES_SK`). Až je založíš, přepiš
ID v `i18n/sk-texty.mjs` a spusť `node build-sk.mjs`.

## ✅ Vyřešeno (dřív tu bylo jako blokující)

- **HTTPS na `www.veseleponozky.sk` funguje.** Certifikát doménu pokrývá,
  prohlížeč nehlásí varování (ověřeno 2026‑09‑16). Dřívější poznámka
  „nepřesměrovávat zákazníky na .sk“ už neplatí.
- **Koloo zákazníky neobtěžuje.** Kampaň je slovenská („ZÍSKAJTE ZĽAVU“) a na
  `.sk` běží bez chyby. Chybový `alert()` o nepovolené doméně vyskakuje **jen na
  technické adrese `exitshop.cz`**, která ve whitelistu kampaně není. Pro
  zákazníky je to neviditelné; při testování přes technickou adresu to ale
  otravuje — pokud vadí, doplň `www.exitshop.cz` do kampaně na my.koloo.net.
- **Dlaždice kategorií na HP** už na česká ID nemíří. Jediné české ID na
  homepage zbyla v těch třech bannerech (bod 1).
- **Ceník dopravy v produktovém detailu je vyplněný** — značky
  `{{SK_DOPRAVCA_*}}`, `{{SK_ZADARMO_*}}`, `{{SK_CENA_*}}` a
  `{{SK_DOPRAVA_ZADARMO_OD}}` už v `i18n/` hodnoty mají. `node check-sk.mjs`
  hlásí 13 souborů / 0 nálezů / 0 nevyplněných značek.

## Co zbývá česky v administraci SK shopu

Tohle náš kód vyřešit nemůže, jsou to data a nastavení v administraci.
Co z toho spadne pod jedno nastavení jazyka, je v bodu 2 výš — tady je zbytek:

- **Oznamovací lišta** — „VESELÉ PONOŽKY SE SLEVOU AŽ 90%“. Text bere
  `countdown-bar.js` z `#notification-bar-text`, což je obsah lišty
  z administrace (Marketing a slevy).
- **Nadpisy sloupců v patičce** — „KATEGORIE / INFORMACE / SÍDLO FIRMY /
  ADRESA SKLADU“. Jsou to nativní `.footer-column`, `footer.js` jim jen přidává
  třídu `vp-foot__acc-head` kvůli akordeonu na mobilu.
- **Nadpis nad tabulkou variant** — „Vyberte velikost“ (`.choose-variant-title`)
  přichází ze šablony, ne z naší položky.
- **Názvy kategorií** — menu ukazuje název z navigace schválně, aby se
  neudržoval na dvou místech. Přejmenovat je musíš v administraci.
- **Parametry produktů** — „Velikost VP / Velikosti / Je hlavní produkt / Ano /
  Motiv / Povolání“ se na detailu vypisují z katalogu.
- **Děkovná hláška newsletteru** — „Děkujeme!“ je text ecomailového formuláře
  (`.ec-v-form-text`), mění se v Ecomailu, ne u nás.
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
