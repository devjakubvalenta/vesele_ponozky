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
| `doprava.html` | CMS → Doprava a platba (`/cms/61600`) ⚠️ **nenasazovat, viz níže** |
| `velkoobchod.html` | CMS → Velkoobchodní spolupráce (`/cms/61606`) |
| `recenze.html` | CMS → Recenze (`/cms/61609`) |
| `vyroba.html` | CMS → Výroba na zakázku (`/cms/61603`) |
| `trebon.html` | CMS → Výroba (`/cms/61612`) — stránka „Výroba v Třeboni" |
| `kontakt.html` | CMS → Kontakty (`/cms/61624`) |
| `product-detail.html` | Obsah → Produktový detail |
| `dekovacka.html` | Obsah → Děkovačka / potvrzovací stránka |
| `countdown-source.html` | součást `homepage.html`, samostatně jen v nouzi |

## Před vložením si přečti

- **`doprava.html` obsahuje 23 značek `{{SK_…}}`** místo cen a jmen dopravců.
  Platforma je nerozbaluje — zákazník by je viděl doslova. Vyplň je podle
  skutečného slovenského ceníku, teprve pak stránku nasaď.
- **Produktové bloky na homepage** zatím neexistují; místo nich je v souboru
  komentář s instrukcí, co tam doplnit, až je založíš.
- **Právní stránky** (VOP, GDPR, Vrácení zboží) tu **záměrně nejsou** — a VOP
  na slovenském shopu vůbec neexistuje, musíš ji založit.
- Cesty k obrázkům `/files/310/…` se **nemění** — je to ID účtu, ne shopu.

## Kontrola

```bash
node check-sk.mjs
```

Projde všechny soubory a hlásí zbytky češtiny, česká ID a nevyplněné značky.
Podrobnosti a mapa ID: [reference/sk-mapa-id.md](../../../reference/sk-mapa-id.md).
