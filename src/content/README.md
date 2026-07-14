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
| `doprava.html` | CMS a blog → **Doprava a platba** | `cms/56955-doprava-a-platba` | `.vp-doprava` (`src/css/85-doprava.css`) | ⏳ vkládá uživatel (zdrojový `</>` režim) |
| `homepage.html` | Nastavení designu → **Úvodní stránka** | `/shops/28056/` (HP) | `.content .benefits` (`26-benefits.css`) + `.vp-recenze--hp` (`27-hp-recenze.css`, základ z `95-recenze.css`) + `.vp-hpvyr` (`29-hp-vyroba.css`, placka z `70-trebon.css`) | ⏳ vkládá uživatel (zdrojový `</>` režim); benefits pás + recenze + `%recommend_block_*%` + sekce Výroba v Třeboni |

> `gdpr.html` i `vop.html` sdílejí jeden stylopis `src/css/80-legal.css` (scope `.vp-legal`) —
> jsou to vizuálně stejné textové/právní stránky, liší se jen obsahem.

## Jak nasadit

1. V administraci **CMS a blog → O nás** přepni editor do **zdrojového režimu** (`</>`).
2. Vlož celý obsah souboru, ulož, tvrdý reload stránky.
3. Při změně textu uprav i soubor tady (konzistence repo ↔ admin).

> Obrázky: nahraj v administraci (media), nahraď `PLACEHOLDER-*` URL skutečnými
> (`https://www.exitshop.cz/files/7203/media/files/<jmeno>`).
