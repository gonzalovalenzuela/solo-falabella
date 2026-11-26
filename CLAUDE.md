# CLAUDE.md

Contexto para Claude Code en este repo.

## Proyecto

Extensión para Firefox (Manifest V2, `manifest.json`) y Chrome (Manifest V3, `manifest.chrome.json`) que agrega/quita el filtro "Vendido por Falabella" en los listados de falabella.com/falabella-cl. El usuario habla español; responde y comenta el código en español.

## Cómo funciona

- El filtro es solo un parámetro de query: `f.derived.variant.sellerId=FALABELLA` (múltiples vendedores separados por `::`). También se fija `facetSelected=true` y se borra `page`.
- `common.js` tiene toda la manipulación de URL y se carga tanto en el background como en el popup (scripts globales, sin módulos). En Chrome, `sw.js` los carga con `importScripts`.
- Los dos manifests deben tener la misma versión (`build.sh` lo verifica). Chrome no acepta íconos SVG: usa `icons/*.png`.
- `background.js` implementa el modo automático: en `tabs.onUpdated` con `changeInfo.url`, si la URL es un listado sin filtro y `storage.local.auto` es true, redirige con `tabs.update`. Falabella es una SPA, así que la navegación interna (pushState) también dispara `onUpdated`.
- Cuando el usuario quita el filtro desde el popup, se guarda `optOut:<tabId>` → `pageKey(url)` en `storage.session` para no reaplicarlo en esa misma página. No se usa memoria porque el background se descarga cuando está inactivo (service worker en Chrome).
- Páginas consideradas listado: regex `LISTING_RE` en `common.js` (`category|brand|search|collection|seller`).

## Cosas sin verificar

- El nombre del parámetro (`f.derived.variant.sellerId`) no se confirmó en el sitio en vivo. Si el filtro no funciona, aplicar "Vendido por → Falabella" manualmente en el sitio y copiar el parámetro real de la URL.

## Comandos

- Empaquetar: `./build.sh` → `dist/solo-falabella-<version>.xpi`, `dist/solo-falabella-chrome-<version>.zip` y `dist/chrome/`
- Probar en vivo: `npx web-ext run` (opcional, requiere web-ext)
- Lint: `npx web-ext lint`
- Probar lógica de URL: `node test/url.test.js`

## Publicación

- AMO (addons.mozilla.org) es gratis. Para uso personal: "sin listar".
- Si se lista públicamente, cambiar el nombre a algo que no parezca oficial (p. ej. "Filtro de vendedor para Falabella.com") por las políticas de marcas de AMO.
