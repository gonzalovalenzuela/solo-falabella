# CLAUDE.md

Contexto para Claude Code en este repo.

## Proyecto

Extensión para Firefox (Manifest V2, `manifest.json`) y Chrome (Manifest V3, `manifest.chrome.json`) que filtra por vendedor (Falabella, Sodimac, Tottus) los listados de falabella.com/falabella-cl. El usuario habla español; responde y comenta el código en español.

## Cómo funciona

- El filtro es solo un parámetro de query: `f.derived.variant.sellerId=FALABELLA` (múltiples vendedores separados por `::`, O lógico). También se fija `facetSelected=true` y se borra `page`. Los vendedores seleccionables están en `SELLERS` (`common.js`); `applySellers` reemplaza solo esos y conserva otros que ya estén en la URL.
- La selección se guarda en `storage.local.sellers` (vacía = todos). El popup la aplica al instante a la pestaña actual.
- `common.js` tiene toda la manipulación de URL y se carga tanto en el background como en el popup (scripts globales, sin módulos). En Chrome, `sw.js` los carga con `importScripts`.
- Los dos manifests deben tener la misma versión (`build.sh` lo verifica). Chrome no acepta íconos SVG: usa `icons/*.png`.
- `background.js` implementa el modo automático: en `tabs.onUpdated` con `changeInfo.url`, si la URL es un listado sin ningún vendedor seleccionable, `storage.local.auto` es true y hay selección, redirige con `tabs.update`. Falabella es una SPA, así que la navegación interna (pushState) también dispara `onUpdated`.
- El background no guarda estado en memoria (el service worker de Chrome se descarga cuando está inactivo).
- Páginas consideradas listado: regex `LISTING_RE` en `common.js` (`category|brand|search|collection|seller`).

## Parámetro del filtro

- `f.derived.variant.sellerId=FALABELLA` está confirmado en el sitio en vivo (nov 2026): en Smart TV baja de 365 a 131 productos, todos vendidos por Falabella. `SODIMAC` y `TOTTUS` también funcionan y se combinan (Falabella+Tottus en Smart TV = 131+6). `IKEA` no funciona con este parámetro: solo con `f.derived.variant.sellerId_popularBrand=IKEA`, que no tiene "solo Falabella" y se cruza como Y con `sellerId`, por eso se dejó fuera. Si Falabella lo cambia, aplicar "Vendido por → Falabella" manualmente en el sitio y copiar el parámetro real de la URL.

## Comandos

- Empaquetar: `./build.sh` → `dist/solo-falabella-<version>.xpi`, `dist/solo-falabella-chrome-<version>.zip` y `dist/chrome/`
- Probar en vivo: `npx web-ext run` (opcional, requiere web-ext)
- Lint: `npx web-ext lint`
- Probar lógica de URL: `node test/url.test.js`

## Publicación

- AMO (addons.mozilla.org) es gratis. Está listada públicamente desde la 1.0.2.
- Desde la 1.0.3 se llama "Filtro de vendedor para Falabella.com" (antes "Solo Falabella") para no parecer oficial, por las políticas de marcas de AMO. El repo y los archivos de `dist/` mantienen `solo-falabella`, y el ID de gecko no se cambia.
