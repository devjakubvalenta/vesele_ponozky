# assets/pay/ — loga platebních metod (Comgate sada)

Oficiální loga ze sady **Comgate „Loga komplet 11/2024"**
(<https://help.comgate.cz/docs/loga-a-udaje-na-webu> → *Stáhnout loga
v komprimovaném souboru*). Comgate je pro obchodníky vydává právě k tomuhle
použití: podle obchodních podmínek **musí být loga Visa a Mastercard v patičce
webu e-shopu**, logo Comgate s odkazem na `www.comgate.eu` je doporučené.

| Soubor | Zdroj v sadě | Kde se používá |
|--------|--------------|----------------|
| `comgate.svg` | `comgate/cg-hor.svg` (vodorovná varianta pro světlé pozadí) | patička (inline) + CMS „Doprava a platba" |
| `visa.svg` | `Visa_Brandmark_Blue_RGB_2021.svg` | patička (inline) + CMS „Doprava a platba" |
| `mastercard.svg` | `mc_symbol.svg` | patička (inline) + CMS „Doprava a platba" |

## Jak se dostanou na web

- **Patička (všechny stránky)** — nic nahrávat netřeba. `src/scripts/footer.js`
  má loga jako **inline SVG** (`PAY_LOGO`), takže pruh funguje hned po bumpnutí
  hashe skriptu. viewBox je tam oříznutý na obsah (originály mají kolem loga
  velký prázdný okraj), jinak je kresba beze změny.
- **CMS stránka „Doprava a platba"** — HTML v CMS neumí inline SVG, proto se
  tyhle tři soubory **nahrají do administrace (média)** pod jmény
  `comgate.svg`, `visa.svg`, `mastercard.svg` → cesty
  `/files/310/files/comgate.svg` atd. (viz `src/content/doprava.html`).

> Loga se **needitují** (barvy ani proporce) — jsou to ochranné známky
> karetních asociací a Comgate; upravená verze by porušila podmínky užití.
