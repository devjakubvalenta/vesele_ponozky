# Možnosti administrace exitshop.cz — obchod „Zkouška 2" (WitSocks)

Katalog **nativních možností** administrace (z prohlídky panelu). Slouží k
rozhodování, co dělat **nativně** vs. co stylovat/injektovat naší CSS/JS smyčkou.
Viz [../CLAUDE.md](../CLAUDE.md).

## Identifikátory

| | |
|---|---|
| Obchod | **Zkouška 2**, typ „Klasický obchod" |
| Live URL | https://www.exitshop.cz/shops/28056/ |
| Shop ID | **28056** |
| Aktivní šablona | **Next** |
| Media (upload) ID | **7203** → obrázky mají URL `https://www.exitshop.cz/files/7203/media/files/<jmeno>` |
| CMS stránky | `%shop_url%cms/<id>-<slug>` |

> ⚠️ Červený banner v administraci („Chyba v přijetí objednávky z napojeného
> e-shopu: prestashop") je upozornění na **synchronizaci objednávek** s napojeným
> prestashopem — se vzhledem **nesouvisí**, neřešíme ho.

## Ovládací panel — přehled dlaždic

| Dlaždice | K čemu | Pro nás důležité |
|----------|--------|------------------|
| Základní nastavení | jméno, doména, … | |
| **Obsah** | homepage, slider, patičky, texty | 🟢 hlavní obsahový nástroj |
| **Vzhled** | šablona, logo, nastavení, **Vaše CSS** | 🟢 sem patří logo i finální CSS |
| Zboží | produkty | |
| Doprava | dopravci | |
| Nastavení | obecné | |
| **CMS a blog** | podstránky + blog | 🟢 obsahové stránky |
| Platební moduly | platby | |
| Zákaznické účty a VO | účty, velkoobchod | |
| **Skripty** | vlastní JS/CSS/`<link>` | 🟢 náš injektážní bod (CDN) |
| XML feedy | exporty (Heureka, Zboží…) | |
| **Kategorie** | správa kategorií (vč. **obrázků**) | 🟢 zdroj pro slider kategorií |
| Doplňkové služby a prodej | | |
| URL, Sitemap, robots.txt | SEO/technické | |
| Zrcadlení e-shopu | mirror kategorie | |
| **Akční bannery** | bannery v kategoriích, s platností | 🟡 promo |
| Landing pages | vstupní stránky | 🟡 |
| Validovat HTML | kontrola | |
| Terciární popisky | | |
| **Produktové bloky** | vlastní product listy (`%recommend_block_X%`) | 🟢 homepage produkty |
| Diskuze | | |
| Otázky a odpovědi | | |
| Kontaktní formulář | | |
| UTM přepisy | marketing | |
| Nastavení API dopravců | | |

---

## 🟢 Vzhled (dlaždice „Vzhled")

Záložky: **Výběr šablony · Logo a ikona · Nastavení · Vaše CSS**

### Logo a ikona — *(řeší dřívější dotaz na logo!)*
- **Nahrát logo obchodu** — aktuální logo „WiT Socks" (jde *Odstranit*). → **Tady se mění logo, ne přes CSS.**
- **Nahrát ikonu (favicon)**
- **Nahrát obrázek pro sociální sítě (OG:IMAGE)** — použije se místo loga, když není lepší obrázek
- **Nahrát obrázek pozadí hlavičky** + **Průhlednost pozadí** (teď `0,15`)

### Nastavení
**Menu a hlavička:**
- Ukotvení celé hlavičky — ☐ vyp
- Ukotvené vodorovné menu — ☑ zap
- Megamenu — ☑ zap
- Velké obrázky na liště megamenu — ☐ vyp
- Systém zobrazení kategorií v liště — *Všechny hlavní kategorie*
- Název Root kategorie — *Katalog*

**Ostatní:**
- Vypnout indexaci dlouhého popisku pro Google — ☐
- Dlouhý popisek na celou šířku — ☑
- Hover nad obrázkem produktu — *Zobrazit další obrázek produktu*
- Zobrazení produktů na mobilu — *1 sloupec (klasická karta)*
- Styl řazení produktů v kategorii — *Roletka (výchozí)*

> Tyhle přepínače mění layout/markup → **vědět o nich dřív, než budeme bojovat CSS** (např. počet sloupců na mobilu).

### Vaše CSS
Nativní pole pro doplňkové CSS (i LESS). **Sem se na konci „zapeče" finální `dist/custom.css`** (produkční krok smyčky).

---

## 🟢 Obsah (dlaždice „Obsah")

Texty, obrázky a galerie obchodu. Klíčové bloky:

### Slider (homepage) — *(řeší dřívější dotaz na slider — je NATIVNÍ!)*
- Drag&drop obrázky, mění se pořadí, každý snímek má **„Nastavit text / odkaz"**.
- **Autoplay:** „Počet sekund mezi přechodem" (teď `5`).
- **Šablona Next:** při **3+ bannerech** carousel zabírá ~⅔ šířky, poslední 2 obrázky jdou do **bočních pozic**. Při 1–2 bannerech přes celou šířku.
  - Doporučené rozměry (1+2): **hlavní 856×500 px**, **boční 416×242 px**; bez bočních **1296×500 px**.
- → **Slider děláme nativně**, my ho jen nastylujeme přes CSS.

### Úvodní stránka (homepage body)
WYSIWYG + **zdrojový HTML** (`</>`). Můžeme vkládat HTML sekce a **placeholdery**, např.:
- `%recommend_block_3224%`, `%recommend_block_3236%` (produktové bloky)
- volný text/nadpisy („Všechny naše produkty", „skladem")
- → **„Obrázek + text" sekce = sem jako HTML** (obrázky z media URL), nastylovat CSS.

### Titulek a kategorie na homepage
- **Titulek na homepage** + **Perex pod titulkem**
- **Kategorie na homepage** — multiselect kategorií (teď nic vybráno). → nativní blok kategorií na HP.

### Produktová patička
„Na detailu produktu dole." Obsah: `%products_category%` (produkty z kategorie).

### Produktový detail
„Na detailu produktu." Aktuálně blok výhod:
```html
<ul class="benefits-product">
  <li><span><img src="https://www.exitshop.cz/files/7203/media/files/czech-republic.png" class="img-responsive-editor"></span><span>Vyrobeno v České republice</span></li>
  <li>… Kvalitní materiály …</li>
  <li>… Vrácení do 90 dní …</li>
  <li>… Vše máme skladem …</li>
</ul>
```
→ Ukázka **media URL** (`/files/7203/media/files/…`) a třídy `.benefits-product`, `.img-responsive-editor` (vhodné cíle pro CSS).

### Další obsahové sloty
| Slot | Kde se zobrazí | Stav |
|------|----------------|------|
| **Doplňující informace** | horní část e-shopu vedle košíku (telefon/e-mail v hlavičce) | `792 377 714 (9:00-16:00) witsocks@modacapek.cz` |
| **Box pod hlavičkou** | spodní část hlavičky | prázdný (volné místo!) |
| **Levý box** | vlevo pod menu | prázdný |

> Telefon/e-mail, co jsme v hlavičce přebarvili, **se edituje v „Doplňující informace"**.

### Patička obchodu (footer)
4 editovatelné sekce + spodní řádek:
- **Sekce 1 (Kategorie):** nadpis „Kategorie" + `%menu_categories_vertical%`
- **Sekce 2 (Sociální sítě):** nadpis „Informace" + `%menu_vertical%`
- **Sekce 3 (Informace):** Sídlo firmy (MODA ČAPEK s.r.o., B. Němcové 1095, 37901 Třeboň, +420 792 377 714) + Adresa skladu (Nádražní 323, Areál Jipro, 37816 Lomnice nad Lužnicí)
- **Sekce 4 (O nás):** Velkoobchodní kontakty — Morava: Lumír Buchta, lumas@lumas.cz, +420 603 249 326 · Čechy: David Čapek, david@modacapek.cz, +420 724 061 774
- **Patička:** „Objednáním produktu souhlasíte s obchodními podmínkami." (placeholder `%current_year%`, `%current_year(X)%`)

### Prázdný košík / Potvrzovací stránka (děkovačka)
- **Prázdný košík** — vlastní text (teď prázdné).
- **Děkovačka** — „Děkujeme za objednávku" + bohaté placeholdery objednávky (viz tabulka níže).

### Upravit textové prvky na stránce
Přepis **všech UI popisků** (Chci objednat, Název, Cena, Množství, tlačítko *Objednat*, adresní pole, chybové hlášky, *Otevřít/Zavřít kategorii*, …). → i18n/wording bez CSS.

---

## 🟢 Kategorie

Plný správce: Pořadí & Název, **Obrázek**, ID, krátký/dlouhý název, popisek, aktivní, …
Akce: Vybrat/Upravit výběr, Uložit pořadí, **Obarvit**, Export/Import, Excel hromadné úpravy, Přeložit, **Přidat kategorii**.

- **Kategorie mají vlastní obrázky** (ikonky ponožek apod.) → ideální zdroj pro **slider/dlaždice kategorií**.
- Menu kategorií do Obsahu přes `%menu_categories_vertical%` / `%menu_categories_horizontal%`.
- Příklady ID: ROOT `1196952`, Pánské Veselé ponožky `1243130`, Nízké ponožky `1243145`, Zdravotnictví `1243148`, MultiPACK `1243151`, Káva `1243154`, Povolání `1243157`, Zvířátka `1243160`.

## 🟢 Produktové bloky
Vlastní product listy s nastavitelným algoritmem (řadí se přepočtem **v noci**), zobrazí se jako **běžný product list, ne carousel**. Vkládají se placeholderem `%recommend_block_<ID>%`:
- **Upsell košík** → `%recommend_block_3177%`
- **Novinky** → `%recommend_block_3224%`
- **Dárkové sety** → `%recommend_block_3236%`

## 🟡 Akční bannery
Bannery v kategoriích s **platností od–do** a odkazem. Teď: „Test 2" a „Test" (ORIGINÁLNÍ VZORY, 25.–27. 2. 2026) → seznam.cz.

## 🟢 CMS a blog
- **CMS podstránky** (URL `cms`): O nás, Doprava a platba, Výroba na zakázku (`%shop_url%cms/<id>-<slug>`), „V menu". Menu přes `%menu_horizontal%` / `%menu_vertical%`.
- **Sidebar widget**: Rychlé kontakty, odkaz na kontaktní formulář, Doporučené produkty (ID produktů).
- **Blog** (URL `blog`/`post`/`section`): rubriky, příspěvky, `%blog_vertical%`, počet příspěvků na HP, „V horním menu".

## 🟢 Skripty
Vlastní `<script>` (JS) / holý `<link>`/`<style>` (CSS). **Náš injektážní bod** — tady běží CDN `<link>` na `dist/custom.css`. Detail a past „neobalovat do `<script>`": [../src/scripts/README.md](../src/scripts/README.md).

---

## Katalog zástupných symbolů (placeholderů)

### Obsah / homepage / menu
| Placeholder | Význam |
|---|---|
| `%recommend_block_<ID>%` | produktový blok (Upsell `3177`, Novinky `3224`, Dárkové sety `3236`) |
| `%products_category%` | produkty z kategorie (produktová patička) |
| `%menu_categories_vertical%` / `…_horizontal%` | menu kategorií |
| `%menu_vertical%` / `%menu_horizontal%` | menu CMS/informací |
| `%blog_vertical%` | menu blogu |
| `%shop_url%` | základ URL obchodu |
| `%current_year%` / `%current_year(X)%` | aktuální rok (± X) |

### Skripty — konverzní stránka
`%v`, `%v[czk]`, `%v2`, `%v2[czk]`, `%m`, `%m[czk]`, `%s`, `%s2`, `%n`, `%c`, `%jmeno`, `%prijmeni`, `%ulice`, `%mesto`, `%psc`, `%email`, `%telefon`, `%telefon2`

### Děkovačka (potvrzovací stránka)
`%a` (údaje zákazníka), `%o` (číslo obj.), `%s` (název obchodu), `%p` (shrnutí), `%tt`/`%st`/`%at` (tabulky zboží), `%n` (jméno), `%x` (datum), `%e` (e-mail), `%c` (cena bez dopravy), `%k` (cena vč. dopravy), `%u` (doména), `%m` (měna), `%r` (číslo účtu), `%w` (poznámka), `%qrcode%` (QR platba), `%d` (doprava), `%y` (text e-mailu dopravce)

---

## Hostování obrázků (logo, sekce, slider)

Obrázek nahraný editorem/uploadem dostane stabilní URL:
```
https://www.exitshop.cz/files/7203/media/files/<jmeno>.<přípona>
```
→ obrázky pro homepage sekce / dlaždice můžeme **hostovat přímo v administraci** a odkazovat tímto URL (alternativa: hostovat v repu → jsDelivr). **Logo** se ale řeší **nativně** (Vzhled → Logo a ikona), ne přes URL v CSS.

---

## Důsledky pro workflow: nativně vs. CSS/JS

| Záměr | Dělat **nativně** | Naše **CSS/JS** smyčka |
|-------|-------------------|------------------------|
| **Slider na homepage** | ✅ Obsah → Slider (obsah + autoplay) | stylovat vzhled carouselu |
| **Sekce obrázek + text** | ✅ Obsah → Úvodní stránka (HTML + media URL) | stylovat |
| **Dlaždice/slider kategorií** | kategorie mají obrázky; `%menu_categories_horizontal%` nebo blok kategorií na HP | stylovat na slider (CSS scroll-snap), příp. JS carousel |
| **Produktové řady na HP** | ✅ Produktové bloky → `%recommend_block_X%` | stylovat |
| **Logo / favicon / OG** | ✅ Vzhled → Logo a ikona | — |
| **Promo banner v kategorii** | ✅ Akční bannery | stylovat |
| **CMS stránky / blog** | ✅ CMS a blog | stylovat |
| **Texty/popisky/wording** | ✅ Obsah → Textové prvky | — |
| **Barvy, layout, responzivita, hover, animace, mikrointerakce** | — | ✅ CSS |
| **Chování, co platforma neumí** (sticky lišty, custom interakce, dynamická data z API) | — | ✅ JS |

**Pravidlo:** *obsah* (editovatelný, SEO) řeš **nativně** a my ho **nastylujeme**;
*vzhled a vychytávky* nad rámec platformy řešíme **CSS/JS** přes git→CDN smyčku.
