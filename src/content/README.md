# src/content/ — verzovaný HTML obsah CMS stránek

CMS nemá git, takže HTML obsahových stránek držíme **zde jako zdroj pravdy** a
**nasazujeme ručně** do administrace (vkládá uživatel). Styl dodává `src/css/*`
přes CDN (scope dle obalové třídy).

## Mapa souborů → CMS stránky

| Soubor | CMS stránka v admin | URL | Scope CSS | Stav |
|--------|---------------------|-----|-----------|------|
| `onas.html` | CMS a blog → **O nás** | `cms/56952-o-nas` | `.vp-onas` (`src/css/40-onas.css`) | ⏳ vkládá uživatel (zdrojový `</>` režim) |

## Jak nasadit

1. V administraci **CMS a blog → O nás** přepni editor do **zdrojového režimu** (`</>`).
2. Vlož celý obsah souboru, ulož, tvrdý reload stránky.
3. Při změně textu uprav i soubor tady (konzistence repo ↔ admin).

> Obrázky: nahraj v administraci (media), nahraď `PLACEHOLDER-*` URL skutečnými
> (`https://www.exitshop.cz/files/7203/media/files/<jmeno>`).
