# assets/media/ — obrázky, na které sahá naše CSS

Kopie souborů, které jsou zároveň v administraci v médiích
(`/files/310/files/…`). Leží tu proto, že **CSS se na web dostává z jsDelivr**,
a `url()` v CSS se vyhodnocuje **vůči stylopisu, ne vůči stránce**:

```
dist/custom.css jede z  https://cdn.jsdelivr.net/gh/…@<hash>/dist/custom.css
  url("/files/310/files/button_cart.svg")
      → https://cdn.jsdelivr.net/files/310/files/button_cart.svg   ← 404, ikona zmizí
  url("../assets/media/button_cart.svg")
      → https://cdn.jsdelivr.net/gh/…@<hash>/assets/media/button_cart.svg   ← OK
```

**Pravidlo: v `src/css/*.css` piš obrázky vždy relativně jako
`../assets/media/<soubor>`** (cesta je relativní k `dist/custom.css`, ne
k souboru v `src/css/`, protože na web jde vždycky sestavený `dist/`).
Nový obrázek → nahrát sem i do médií a odkazovat relativně.

| Soubor | Kde se používá |
|--------|----------------|
| `button_cart.svg` | ikona v tlačítku „Přidat do košíku" (`25-products.css`, `24-product-detail.css`) a ve štítku „V košíku" |
| `doruceni.svg` | ikonka u „doručíme DD.MM." na kartách a na detailu |
| `balne.png`, `dysko.png` | ikony doplňkových služeb v košíku (`10-checkout.css`) |
| `footer_sock.png` | dlaždice žlutého pásu s ponožkami v patičce (`30-footer.css`) |
| `download.svg` | ikona u odkazů na PDF (`50-vyroba.css`, `90-vraceni.css`) |

> Názvy jsou schválně **bez diakritiky** — v administraci se soubory jmenují
> `balné.png`, `dýško.png`, `doručení.svg` a musely by se v CSS URL-encodovat.
>
> ⚠️ `balne.png` (778×859, 463 kB) a `dysko.png` (730×801, 410 kB) jsou proti
> zobrazované velikosti 92×92 px hodně předimenzované — jsou to kopie 1:1
> z médií. Zmenšení na ~276 px by ušetřilo skoro 800 kB při načtení košíku.
