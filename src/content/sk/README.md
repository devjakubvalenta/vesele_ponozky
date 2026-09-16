# src/content/sk/ — obsah pro slovenský shop 28711

Slovenské verze obsahových stránek. Vkládají se do administrace **slovenského**
shopu (`https://www.exitshop.cz/shops/28711/`, doména veseleponozky.sk) ve
zdrojovém `</>` režimu, stejně jako české originály o složku výš.

Zdroj pravdy je čeština v `src/content/`. Tyhle soubory se od ní liší jen
textem a ID — struktura a názvy tříd musí zůstat shodné, protože oba shopy
sdílejí tentýž `dist/custom.css` z CDN.

| soubor | kam v SK administraci |
|---|---|
| `homepage.html` | Nastavení designu → Úvodní stránka |
| `onas.html` | CMS → O nás (`/cms/61597-o-nas`) |
| `doprava.html` | CMS → Doprava a platba (`/cms/61600`) — ceník vyplněný, čeká na vložení |
| `velkoobchod.html` | CMS → Velkoobchodní spolupráce (`/cms/61606`) |
| `recenze.html` | CMS → Recenze (`/cms/61609`) |
| `vyroba.html` | CMS → Výroba na zakázku (`/cms/61603`) |
| `trebon.html` | CMS → Výroba (`/cms/61612`) — stránka „Výroba v Třeboni" |
| `kontakt.html` | CMS → Kontakty (`/cms/61624`) |
| `product-detail.html` | Obsah → Produktový detail |
| `dekovacka.html` | Obsah → Děkovačka / potvrzovací stránka |
| `countdown-source.html` | součást `homepage.html`, samostatně jen v nouzi |
| `email-potvrzeni-objednavky.html` | Nastavení → e-mail **zákazníkovi** o přijetí objednávky |
| `email-newsletter-potvrzeni.html` | Nastavení newsletteru → pole „Text emailu" |

## Před vložením si přečti

- ⚠️ **Značky `{{SK_…}}` NIKDY nedávej do polí, která renderuje Vue** —
  „Produktový detail", děkovačka a další obsah uvnitř `#app`. Vue si složené
  závorky vyloží jako svoji interpolaci, neznámý název skončí `ReferenceError`em
  a spadne render **celé stránky** (ověřeno 2026-09-16 naostro: nevyplněné
  `{{SK_DOPRAVCA_1}}` v poli „Produktový detail" shodilo detail všech produktů
  SK shopu). V HTML komentáři jsou neškodné — Vue komentáře zahazuje.
  V CMS stránkách (mimo `#app`) render nespadne, ale zákazník značky vidí
  doslova. Nevyplněný údaj proto raději vynech, než abys ho označkoval.
- **`doprava.html` už značky nemá** (od 2026-09-16) — nese reálný ceník
  ověřený v košíku: jediný dopravce **Packeta**, výdajné miesta a boxy
  **2,99 €**, doručenie domov **3,99 €**, dobierka **+1,69 €**. V administraci
  je ale pořád nasazená STARÁ verze, ve které zákazník vidí 32× `{{SK_…}}`
  doslova — vlož novou. Loga dopravy jsou přepsaná na slovenské hashe
  (`a4b81f86…` = Packeta); česká loga ukazovala metody, které v SK pokladně
  nejsou.
- ⚠️ **Emoji se do administrace neuloží** — databáze je v 3bajtovém `utf8`
  a znaky mimo BMP skončí jako `????`. Piš je jako HTML entitu
  (`&#x1F9E6;`), viz [../README.md](../README.md).
- ⚠️ Po vložení `doprava.html` zkontroluj v administraci **meta description**
  té CMS stránky — na produkci v ní pořád visí `{{SK_…}}` ze staré verze.
- **`product-detail.html` značky NEMÁ** (od 2026-09-16) — ceník v sekci
  accordionu „Doprava a vrátenie" nese rovnou reálné ceny Packety a otázka
  na dopravu zadarmo je z FAQ vypuštěná. Až se eurová hranice v administraci
  nastaví, doplň `<span>Zadarmo nad X €</span>` do řádků ceníku a vrať otázku
  do `i18n/sk-texty-faq.mjs`.
- **Produktové bloky na homepage** zatím neexistují; místo nich je v souboru
  komentář s instrukcí, co tam doplnit, až je založíš.
- **Právní stránky** (VOP, GDPR, Vrácení zboží) tu **záměrně nejsou** — a VOP
  na slovenském shopu vůbec neexistuje, musíš ji založit.
- **Oba `email-*.html` odkazují na `https://www.exitshop.cz/shops/28711/`,**
  ne na veseleponozky.sk — certifikát tu doménu nepokrývá (mapa ID, bod 6).
  Až bude HTTPS na .sk funkční, stačí v obou souborech nahradit ten prefix
  za `https://www.veseleponozky.sk/`; cesty za ním se nemění.
- **`email-newsletter-potvrzeni.html` nese český kód `VESELE15`** — tak to má
  i `i18n/sk-ids.mjs` (`SK_ECOMAIL.code = null`). Pokud vznikne slovenský
  kupón, změň ho v obou. A než newsletterový e-mail zapneš, ověř, že ho
  neposílá i Ecomail welcome automatizace — zákazník by dostal dva.
- Cesty k obrázkům `/files/310/…` se **nemění** — je to ID účtu, ne shopu.

## Kontrola

```bash
node check-sk.mjs
```

Projde všechny soubory a hlásí zbytky češtiny, česká ID a nevyplněné značky.
Podrobnosti a mapa ID: [reference/sk-mapa-id.md](../../../reference/sk-mapa-id.md).
