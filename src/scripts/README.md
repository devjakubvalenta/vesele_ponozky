# src/scripts/ — položky pro administraci „Skripty"

Sekce **Administrace → Skripty** je správce položek (ne jedno pole). Každý soubor
zde = **jedna položka**. Obsah se vkládá **včetně tagů** (`<script>…</script>`,
`<style>…</style>`, `<link>`). Soubor zkopíruj celý do pole položky.

> ⚠️ **Žádné URL s doménou.** Eshop běží na produkci **www.veseleponozky.cz**
> i na technické adrese `www.exitshop.cz/shops/28056/` (jeden shop, dvě
> domény). Média mají na obou stejnou cestu → `"/files/310/files/…"`.
> Kategorie/CMS mají na technické adrese navíc prefix `/shops/28056` →
> odkazy skládej přes `SHOP_BASE` (viz `30-product-cards.js`), ne natvrdo.

## Mapa souborů → položky

| Soubor | Název položky v admin | Zobrazit na stránkách | Umístit v Head | Stav |
|--------|------------------------|------------------------|----------------|------|
| `00-css-cdn-link.html` | github | Na všech stránkách | **ANO** | ✅ **nasazeno** — položka „github", ověřeno živě (CSS jde z CDN) |
| `10-force-variant-selection.html` | Pokus s nutností vybrat variantu. JS i CSS | Pouze produktový detail | ne (patička) | ✅ **už nasazeno** v admin — tady jen verzovaný zdroj |
| `footer.js` | patička (sock strip + recenze + badge + logo + accordion + newsletter + platební loga) | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…@<hash>/src/scripts/footer.js">` — **pin hashem** (v adminu byl původně `@main`, ale jsDelivr ho drží v cache i dny a purge nezabírá); newsletter = **Ecomail embed widget** (formulář ID 4, účet witsocks) mountovaný do brandového bloku, styl `src/css/32-newsletter.css`. **Nevkládej Ecomail embed zvlášť** — footer.js si widget načte sám (jinak by běžel 2×). Ecomail vynucuje reCAPTCHA, proto NE syrový POST — viz paměť `ecomail-robotcheck`. Do právního pásu dole přidává i **pruh platebních log** (Comgate + Visa + Mastercard) — Comgate to má v obchodních podmínkách jako povinnost pro patičku webu; loga jsou **inline SVG** přímo ve skriptu (`PAY_LOGO`, verzovaná kopie v `assets/pay/`), takže nezávisí na nahrání do médií |
| `countdown-bar.js` | Odpočet v liště | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…/src/scripts/countdown-bar.js">`; datum konce akce (TARGET) je v souboru |
| `30-product-cards.js` | Produktové karty (název, datum, Zobrazit vše) | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…/src/scripts/30-product-cards.js">`; mapa „Zobrazit vše" (SHOW_ALL) a prefixy názvů jsou v souboru |
| `hp-categories.js` | Kategorie na HP (přesun + barevné dlaždice) | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…@<hash>/src/scripts/hp-categories.js">` — **pin hashem** jako u CSS linku, bump jen při změně souboru; styl `src/css/28-hp-kategorie.css` |
| `header.js` | Hlavička (Heureka + zákaznická linka + cart ikona) | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…@<hash>/src/scripts/header.js">` — **pin hashem**; styl `src/css/20-header.css`. Telefon/e-mail v lince se čtou z pole „Doplňující informace" (nemazat ho) |
| `40-product-detail.js` | Produktový detail (recenze, slevový pill, množství) | **Pouze produktový detail** | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…@<hash>/src/scripts/40-product-detail.js">` — **pin hashem**; styl `src/css/24-product-detail.css`; benefity do admin pole „Produktový detail" = `src/content/product-detail-benefits.html` |
| `45-cart-popup.js` | Popup přidáno do košíku | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…@<hash>/src/scripts/45-cart-popup.js">` — **pin hashem**; styl `src/css/33-cart-popup.css`; texty cookie lišty se nastavují v administraci (styl `src/css/34-cookies.css` je čisté CSS) |
| `50-checkout.js` | Pokladna (dopravy a platby) | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…@<hash>/src/scripts/50-checkout.js">` — **pin hashem**; styl `src/css/10-checkout.css` (`.vp-lbl*`, `.vp-save*`, `.vp-optout*`) |
| `35-listing-sort.js` | Řazení ve výpisech (klikací odkazy) | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…@<hash>/src/scripts/35-listing-sort.js">` — **pin hashem**; styl `src/css/26-listing-sort.css` |
| `36-filter.js` | Filtr — výchozí sbalený na mobilu | Na všech stránkách | ne (patička) | ⏳ vlož 1× jako `<script src="…jsDelivr…@<hash>/src/scripts/36-filter.js">` — **pin hashem**; styl `src/css/27-filter.css` |
| `koloo-wheel.html` | Koloo (kolo štěstí) | Na všech stránkách | ne (patička) | ⏳ vlož obsah `<script>` DOSLOVA (3rd-party async loader, kLicense `UNI-FB75BE3A-1714`). Vzhled/texty/kupóny/trigger se řeší v adminu Koloo (my.koloo.net), ne v kódu; z naší strany jen pozice sbaleného štítku — `src/css/37-koloo.css` |

> ⚠️ **Sekce „Skripty" vkládá obsah DOSLOVA** (neobaluje ho). `<link>` a
> `<style>` vkládej **holé** — NIKDY ne uvnitř `<script>…</script>` (browser by
> je ignoroval). Do `<script>` patří jen JavaScript. (Toto nás jednou zdrželo:
> `<link>` byl omylem obalený v `<script>` → CSS se nenačítalo.)

## Už existující položky v administraci (NEPŘEPISOVAT)

- **„Font"** — Na všech stránkách (Space Grotesk). Mimo tento repo.
- **„Pokus s nutností vybrat variantu. JS i CSS"** — Pouze produktový detail.
  Zdroj je `10-force-variant-selection.html`. Když ji upravíš tady, **ručně**
  přenes do admin položky (CSS přes jsDelivr se jí netýká).

Nové položky vždy **přidáváme**, stávající nepřepisujeme.

## Co dělá `30-product-cards.js`

Doplňky k CSS produktových karet (`src/css/25-products.css`) ve všech
výpisech `.products`: (1) rozdělí název na 2 řádky — černý typ produktu
+ modrý motiv (dělí se na první „ - ", jinak podle prefixů v
`NAME_PREFIXES`); (2) obalí datum v „doručíme 15.07." do
`.pc-delivery-date` (zelené); (3) pod HP produktové bloky přidá tlačítko
„Zobrazit vše" podle mapy `SHOW_ALL` (`{id bloku: URL}` — blok bez
záznamu tlačítko nemá) a pod hlavní HP výpis odkaz na `HP_ALL_URL`;
(4) štítek „V KOŠÍKU" (`.pc-in-cart`) na kartách
produktů, které už v košíku jsou — čte cart cookie
`shopping_cart_<shopId>` (JSON `{"productId-variantId": "ks"}`, shop id
se nehardcoduje), páruje přes productId z `href` karty a po vyprázdnění
košíku štítek zase odebere (`pageshow` pokrývá i návrat zpět přes
bfcache). Idempotentní, MutationObserver zpracuje i karty dorenderované
AJAX filtrováním v kategorii a v popupu „přidáno do košíku".

> **Cíle „Zobrazit vše" — past platformy.** Root kategorie Katalog
> (1196952) vykresluje ve filtraci staré parametry `334` „Velikosti" +
> `335` „Je hlavní produkt" místo `52221` Motiv + `52209` Velikost, které
> mají všechny ostatní kategorie — proto tam **chybí filtrace podle
> Povolání** (Povolání je hodnota parametru Motiv). Je to server-side,
> CSS/JS to nespraví; opravuje se přenastavením parametrů v administraci.
> Suffix `/new` u kategorie **není jiný výpis**, jen řazení „Nejnovější"
> (dál `/price`, `/price_desc`). Proto blok „To nejlepší právě v akci"
> (3224) míří na kategorii **Výprodej** (1243142), ne na `…/katalog/new`.

## Co dělá `45-cart-popup.js`

Doplněk k CSS popupu „Produkt byl přidán do košíku"
(`src/css/33-cart-popup.css`, scope `.added_to_cart_popup` — fancybox):
rozdělí nativní jednořádkový název „Ponožky - Berušky nízké - 35-38" na
název + řádek `.acp-meta` „Velikost 35-38 · 1 ks" (počet ks z cart
cookie) a doplní zelenou cenu `.acp-price` (z `data-product-price`
naposledy kliknuté varianty, na detailu z `.product-price-our`; když
cena není zjistitelná, řádek se vynechá). Velikost se odděluje jen když
sedí na label kliknuté varianty nebo vypadá číselně („35-38") — jiné
názvy s „ - " se nerozbijí. CSS zároveň omezuje Doporučené produkty na
4 karty (desktop) a na mobilu je skrývá úplně. Idempotentní; bez JS
zůstane nativní obsah popupu jen nastylovaný.

## Co dělá `50-checkout.js`

Pět věcí v košíku/pokladně. Vše je idempotentní a jede přes jeden
`MutationObserver` nad `.main-order-form`, takže to přežije i překreslení
seznamu dopravy nebo změnu množství.

**1) Řádky dopravy a platby** — srovná je do podoby „název vlevo, cena
vpravo" (styl `src/css/10-checkout.css`, třídy `.vp-lbl*`). Název metody je
v šabloně **holý textový uzel** uvnitř `.label-shipping-text` — ve flexu z něj
vznikne anonymní flex item, kterému nejde nastavit `min-width: 0`, takže dlouhý
název („Zásilkovna - výdejní místa a boxy - ZDARMA NAD 999 Kč - ") vytlačil cenu
na vlastní řádek a dlaždice na mobilu narostla na 3 řádky. Skript text obalí do
`<span class="vp-lbl">`, poznámku „ZDARMA NAD 999 Kč" (píše se v adminu do názvu
metody) vyzobne na druhý řádek jako modré `.vp-lbl-free` „Zdarma nad 999 Kč"
a ořízne osiřelé pomlčky na konci („Na dobírku - " → „Na dobírku"). Když
platforma cenu přepne na „ZDARMA" (překročený limit), řádek dostane `.vp-free`
→ zelené „Zdarma" a modrá poznámka se skryje. Idempotentní (`data-vp-lbl`),
Bez skriptu zůstane nativní chování (text se zalomí, cena spadne pod něj).

**2) Pořadí skupin dopravy** — skupina „Doprava na výdejní místo a do boxu" jde
před „Doprava na adresu". Šablona obě renderuje do jednoho `.col-md-6` jako
ploché sourozence (`h4` + `ul` + `h4` + `ul`), takže se to nedá udělat CSS
`order` — nadpis a jeho seznam by se musely párovat. Přesouvají se uzly, jednou
za načtení (`data-vp-order`).

**3) Souhlasy „Nesouhlasím"** — volitelné souhlasy (`checkbox_newsletter`,
`checkbox_heureka`) jsou nativně PŘEDzaškrtnuté a znamenají „souhlasím".
Zadání je opačné: prázdné políčko s textem „Nesouhlasím…", ale souhlas se má
dál ukládat. Logika se proto obrací — reálný input zůstane zaškrtnutý a jen se
vizuálně schová (`.vp-optout-real`, `position:absolute`, ne `display:none`, aby
se odeslal), před popisek se vloží proxy `.vp-optout` a `for` na popisku se
přepne na něj. Zaškrtnutí proxy = „nesouhlasím" = reálný se odškrtne.
**Obchodní podmínky (`checkbox_op`, required) se nemění.** Když se skript
nenačte, zůstane nativní „Souhlasím" — bezpečný směr selhání.

**4) Doplňkové služby přes refresh** — platforma volbu (Dýško) nedrží, po F5 se
panel vykreslí odškrtnutý a částka zmizí (ověřeno 196 → 157 Kč). Stav se ukládá
do `sessionStorage` (`vp-services`) — ne `localStorage`, tichý návrat placené
položky po dnech je horší než zapomenutí. Obnovuje se `input.click()`, ne
`checked = true`: platforma na klik pošle přepočet, samotné nastavení vlastnosti
by nechalo zaškrtnuté políčko u nezaplacené služby. Klikne se jen jednou za
načtení stránky.

**5) Sleva u položky na mobilu** — sloupec „Cena/Pár" má nativně
`d-none d-lg-block`, takže pod 992 px zmizí přeškrtnutá cena i pilulka se
slevou a zákazník o slevě neví. Odkrýt ho nejde: je to cena **za pár**, kdežto
viditelná částka vedle je **celkem za řádek** — při množství 1 by se zdvojily,
při 2 by si odporovaly. Skript proto dopočítá přeškrtnutou cenu za celý řádek
z `data-old-price × ks` na inputu množství a vloží ji spolu s procenty nad
částku (`.vp-save`). Zapisuje jen při skutečné změně textu, jinak by observer
reagoval na vlastní zápis.

## Co dělá `35-listing-sort.js`

Nativní roletku řazení ve výpisech (`select.sorting` v toolbaru nad
gridem — kategorie, hlavní výpis, hledání) přestaví na **klikací odkazy
zarovnané vpravo**; počet položek („Zobrazeno 1–3 z 3") se přesune vlevo.
Odkazy vznikají z `<option>` (text = popisek, `href` = `option.value`,
což je cílová URL), takže klik je obyčejná navigace a funguje i bez JS na
kliknutí. Aktivní volba (`<option selected>`) dostane `.is-active`
(modrá + podtržení) a `aria-current`. Styl dodává `src/css/26-listing-sort.css`
(scope `.vp-sort-row`); JS jen přidá třídy a postaví `<nav.vp-sort>`.
Idempotentní; mimo výpisy (chybí `select.sorting`) neudělá nic;
MutationObserver zpracuje i toolbar překreslený AJAX filtrováním v kategorii.

Navíc řeší **výchozí řazení kategorií v `PRICE_FIRST`** (teď jen Výprodej
1243142), které administrace nastavit neumí: holá URL kategorie se hned
překlopí (`location.replace`) na `…/price` a odkazy na tu kategorii (menu, HP,
„Zobrazit vše") se přepíšou rovnou na `/price`, ať se redirect používá jen pro
vstupy zvenčí. **Návrat na „Nejprodávanější" nejde přes `…/sales`** — ta URL
301 přesměruje na holou a ta by se překlopila zpět; proto odkaz míří na holou
URL s markerem `?vp-sort=sales`, který platforma ignoruje (200 + řazení dle
prodejnosti) a redirect ho bere jako vědomou volbu. Stránkování má vlastní
segment (`/price/24`, `/sales/24`), takže se ho redirect netýká.

## Co dělá `36-filter.js`

Řídí **výchozí stav filtru** ve výpisu kategorie podle šířky displeje:
na **mobilu (<768 px)** filtr sbalí (platforma ho jinak renderuje otevřený
přes inline `style="display:flex"`, který CSS nepřebije), takže se otevírá
až tlačítkem „Filtr"; na **desktopu (≥768 px)** nedělá nic — vždy otevřený
sidebar a skryté tlačítko řeší CSS (`src/css/27-filter.css`). Nativní
toggle (`.filter-button`) funguje dál. Tlačítko přejmenuje na „Filtr".
Po prvním kliknutí uživatele na toggle se přestane vynucovat sbalení
(`userToggled`). Idempotentní; mimo výpis kategorie (chybí
`.category-filters-collapsible`) neudělá nic.

## Co dělá `header.js`

Do hlavičky přidá tři věci a jednu skryje: (1) **Heureka odznak**
„97 % zákazníků doporučuje" (`heureka_banner.png`) dovnitř `.logotype` vedle
loga; (2) **zákaznickou linku** `.vp-hdr-care` (fotka `kontakt.svg` + telefon
+ otevírací doba + e-mail) za vyhledávání — **data čte z nativního pole
„Doplňující informace"** (`.company-info a.phone` / `a.mail`), takže se mění
v adminu bez kódu; (3) **vlastní ikonu košíku** (`cart.svg` místo Bootstrap
`bi-handbag`). CSS (`20-header.css`) zároveň skryje duplicitní kontakt nahoře
v modré liště — **pole „Doplňující informace" ale nechat vyplněné** (je zdroj
dat pro linku). Zákaznická linka je jen na desktopu (≥992 px). Idempotentní.

Navíc v **mobilním menu (<992 px)** vrací kategoriím normální proklik: šablona
jim dává `data-toggle="dropdown"`, takže Bootstrap na klik zavolá `preventDefault`
a místo přechodu rozbalí podkategorie. Atribut neodstraňujeme (na desktopu má
dropdown fungovat dál) — klik zachytíme v **capture fázi** na odkazu a zavoláme
`stopPropagation()`, takže se k události Bootstrapův delegovaný handler na
`document` vůbec nedostane a prohlížeč normálně následuje `href`. Šířka se
kontroluje až uvnitř handleru, takže to sedí i po otočení displeje.

**Sticky hlavička** (na všech stránkách): při scrollu dolů hlavička odjede
nahoru, při scrollu nahoru se vrátí (`.vp-hdr-off`, styl v `20-header.css`).
Nad prahem 120 px dostane `.vp-hdr-stuck`, což na mobilu schová horní modrý
pruh. S otevřeným mobilním menu se hlavička neschovává — rozbalený panel je
uvnitř ní a odjel by ze obrazovky s ní.

> **Proč to není nativní.** Šablona má vlastní mechanismus „make-sticky"
> (třída `.is-sticky`, `position: fixed`) a lepí jím odpočtovou lištu
> `#notification-bar` a modrou lištu `#top-menu`. Seznam prvků si ale
> **snímkuje při inicializaci** — přidat `make-sticky` hlavičce za běhu nemá
> žádný efekt (ověřeno živě). Proto vlastní `position: sticky`; `#top-menu`
> se uvnitř přilepené hlavičky vrací do toku, jinak by se lišta zdvojila.
> Odsazení shora (`--vp-hdr-top`) se počítá z výšky odpočtové lišty za běhu —
> zákazník ji může zavřít křížkem.

A ještě jedna **plošná pojistka** (běží na všech stránkách, i tam kde není
hlavička): obsah vložený v adminu přes WYSIWYG si nese absolutní URL na
`www.exitshop.cz` (editor cesty zabsolutizuje doménou, na které se edituje) —
na produkci pak USP dlaždice a ikony odvádějí zákazníka na technickou adresu.
`localizeUrl()` je za běhu přepíše na cesty od kořene
(`…/shops/28056/cms/60954-x` → `/cms/60954-x`, `…/files/…` → `/files/…`);
odkaz na samotný `exitshop.cz` (kredit platformy v patičce) zůstává. MutationObserver
pokrývá i obsah dorenderovaný později. **Správná oprava je obsah v administraci** —
zdroje jsou v `src/content/*.html` a vkládají se ve zdrojovém režimu (`</>`).

## Co dělá `hp-categories.js`

Nativní HP sekci „Titulek a kategorie" (`.category-circle-section`, renderuje
se mezi bento kompozicí a `#homepage_text`) přesune DOVNITŘ `#homepage_text`
hned za sekci recenzí `.vp-recenze--hp` (fallback za benefits pás) a zapne
její restyle na barevné dlaždice
(`src/css/28-hp-kategorie.css`, scope `.vp-cats`): každé dlaždici přidá
`vp-cat-c1..c4` (červená → žlutá → modrá → zelená), u víceslovných názvů
obalí slova 2+ do `.vp-cat-accent` (akcentní barva dle dlaždice). Kategorie
se dál plně spravují v adminu (multiselect + pořadí v manageru Kategorie).
Idempotentní; bez skriptu zůstává sekce v nativní pozici i vzhledu. Mobilní
swipe dodává CSS scroll-snap v `28-hp-kategorie.css` — šablonová třída
`only-mobile-slider` je na tomto shopu mrtvý hook (Swiper se nenačítá,
`window.Swiper` je `undefined`, ověřeno i s mobilním UA).

## Co dělá `40-product-detail.js`

Doplňky k CSS redesignu detailu (`src/css/24-product-detail.css`, scope
`#app.product-detail`): (1) pod hlavní obrázek vloží pás recenzí
`.vp-recenze--pd` („Přes 130 000 spokojených zákazníků" + 3 karty **staticky
vedle sebe**, na mobilu 2 — reuse komponenty z `95-recenze.css`; není to
marquee jako v patičce a na HP); (2) klonuje slevový pill „-46 %" do
pravého sloupce (`.pd-discount-pill`) a synchronizuje ho MutationObserverem
se zdrojem na obrázku (Vue v-if — mizí/mění se při přepnutí varianty);
(3) vloží label „Množství" (`.pd-qty-label`) nad stepper; (4) u neponožkového
zboží přepíše „Ponožky budou u vás" na „Zboží bude u vás" (rozhoduje název
v H1) + pojistka na zvýraznění data doručení; (5) blok **„Zákazníci také
nakupují"** přestaví z nativního owl karuselu na **stejné karty jako ve výpisu
kategorie** (viz níže); (6) do YouTube facade nasadí náhledový obrázek videa
(`img.youtube.com/vi/<id>/hqdefault.jpg`, modrý přeliv kreslí CSS);
(7) **drží jednotkovou cenu** i při zvýšení množství (viz níže).
Nic nepřesouvá (Vue-safe, pořadí řeší CSS flex order) a respektuje zámek
z `10-force-variant-selection.html` (`variant-selection-required` → bílé chipy
+ ztlumené CTA). Idempotentní.

> **Jednotková cena vs. množství.** Platforma při změně množství pošle
> `POST /recalculate_price/<pid>/<qty>` (bez variant), resp.
> `POST /recalculate_price_variant/<pid>-<vid>/<qty>`, a odpovědí přepíše cenu
> na cenu za celé množství. Odpojit handler **nestačí** — u variant zapisuje
> cenu přímo Vue z odpovědi (ověřeno živě: `off("do_recalculate_price")`
> i `off("configurator_price_changed")` cenu nezastaví). Proto se nemění zápis,
> ale **dotaz**: patch `XMLHttpRequest.open` + `fetch` přepíše množství v URL
> na `1`, takže server vrátí jednotkovou cenu a Vue, přeškrtnutá cena i text
> slevy zůstanou konzistentní. Do košíku jde množství z inputu, to se nemění.

> **„Zákazníci také nakupují" (`.vp-also`).** Nativně je to
> `section#products_category.itembox` — owl karusel s ochuzenou dlaždicí
> (obrázek + název + cena, **bez košíku**). JS z dlaždic postaví plnohodnotné
> karty výpisu (`.products .product`), takže vzhled dědí celý z
> `25-products.css`, a vloží je do vlastního scroll-snap slideru se šipkami
> (styl `.vp-also` v `24-product-detail.css`; 992+ = 5 karet, 576–991 = 3,
> pod 576 = 2 — stejný žebřík, jaký měl owl). Nativní blok se pak z DOM
> odstraní (owl se předtím korektně `destroy`ne).
>
> **Proč přestavba a ne restyl owlu:** šablona má
> `.itembox .itembox-content * { padding: 0 !important }` — kartám uvnitř
> karuselu by to vynulovalo všechny paddingy.
>
> **Co karta nemá** (dlaždice ta data neobsahuje a platforma je do bloku
> nerenderuje): přeškrtnutá původní cena, datum doručení, chipy velikostí.
> Dopočítat starou cenu ze zaokrouhleného procenta slevy = riziko zobrazení
> nesprávné ceny; dotáhnout data ze serveru = 10 requestů na detail.
>
> Tlačítko je `.add-to-cart-js-variants` + `data-url` — přesně ten prvek,
> který má karta ve výpisu. Delegovaný handler šablony na klik udělá
> `location.href = data-url` (proklik na detail k výběru velikosti); ve výpisu
> kategorie se takhle chovají **všechny** karty, sortiment je variantní.
> Štítek „V KOŠÍKU" a dělení názvu na 2 řádky doplní `30-product-cards.js`
> (jeho MutationObserver reaguje na přidané `.product`).

## Co dělá `10-force-variant-selection.html`

U variantních produktů (`.variant-name`, `#variant-selector`,
`#configurator-variants`) zamkne tlačítko „do košíku", dokud zákazník nevybere
variantu; přidá hlášku „Nejprve vyberte variantu." a zruší zvýraznění
„předvybrané" varianty. Kořen `#app`, košík
`.product-add-to-shopping-basket(-wrapper)`. Při hash variantě (`#variant-123`)
se zámek přeskočí.
