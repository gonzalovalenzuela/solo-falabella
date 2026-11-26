# Solo Falabella

Extensión para Firefox y Chrome que filtra los listados de [falabella.com](https://www.falabella.com/falabella-cl) (Chile) por vendedor: **Falabella**, **Sodimac** y/o **Tottus**, ocultando los de vendedores del marketplace.

> Proyecto personal, sin relación con Falabella.

## Qué hace

- **Casillas "Vendido por"** (Falabella, Sodimac, Tottus): al marcar o desmarcar se aplica al instante en el listado abierto (categoría, marca, búsqueda, colección) y la selección queda guardada. Se pueden combinar. Sin ninguna marcada se ven todos los vendedores. Mantiene tus otros filtros y el orden, y vuelve a la página 1.
- **Aplicar automáticamente**: cada listado que abras sin filtro de vendedor se filtra con la selección guardada. Si en el sitio eliges otro vendedor, se respeta.

Internamente agrega a la URL el parámetro:

```
f.derived.variant.sellerId=FALABELLA
```

Varios vendedores se separan con `::` (en URL, `%3A%3A`), por ejemplo `FALABELLA::SODIMAC`.

IKEA no se incluye: ese parámetro no la filtra, y el que usa el sitio para IKEA no tiene "solo Falabella" y no se puede combinar con este.

## Instalación

**Temporal (cualquier Firefox):** `about:debugging#/runtime/this-firefox` → "Cargar complemento temporal…" → elegir `manifest.json` o el `.xpi`.

**Permanente:** firmarla gratis en [addons.mozilla.org/developers](https://addons.mozilla.org/developers) como "sin listar", o en Firefox Developer Edition/Nightly poner `xpinstall.signatures.required = false` en `about:config`.

### Chrome

Ejecutar `./build.sh`, ir a `chrome://extensions`, activar "Modo de desarrollador" → "Cargar descomprimida" → elegir la carpeta `dist/chrome`. Para la Chrome Web Store se sube `dist/solo-falabella-chrome-<version>.zip`.

## Empaquetar

```bash
./build.sh   # genera el .xpi (Firefox), el .zip y dist/chrome/ (Chrome)
```

## Estructura

| Archivo | Rol |
|---|---|
| `manifest.json` | Firefox: Manifest V2 (Firefox ≥ 109, Android ≥ 142) |
| `manifest.chrome.json` | Chrome: Manifest V3; `build.sh` lo copia como `manifest.json` |
| `sw.js` | Service worker de Chrome: carga `common.js` y `background.js` |
| `common.js` | Lógica de URL compartida: `SELLERS`, `isListing`, `selectedIn`, `applySellers` |
| `background.js` | Modo automático (escucha `tabs.onUpdated`) |
| `popup.html` / `popup.js` | Popup con las casillas de vendedores |
| `icon.svg` | Ícono (Firefox) |
| `icons/*.png` | Ícono en PNG 16/32/48/128 (Chrome no acepta SVG) |
| `web-ext-config.mjs` | Excluye de `web-ext` los archivos que no van en el `.xpi` |
