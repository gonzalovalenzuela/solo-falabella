# Solo Falabella

Extensión de Firefox que filtra los listados de [falabella.com](https://www.falabella.com/falabella-cl) (Chile) para mostrar solo productos **vendidos por Falabella**, ocultando los de vendedores del marketplace.

> Proyecto personal, sin relación con Falabella.

## Qué hace

- **Botón en la barra**: activa o quita el filtro en el listado abierto (categoría, marca, búsqueda, colección). Mantiene tus otros filtros, el orden y la ubicación, y vuelve a la página 1.
- **Aplicar automáticamente**: cada listado de Falabella que abras se filtra solo. Si quitas el filtro con el botón, no se vuelve a aplicar en esa página.

Internamente agrega a la URL el parámetro:

```
f.derived.variant.sellerId=FALABELLA
```

Varios vendedores se separan con `::` (en URL, `%3A%3A`), por ejemplo `FALABELLA::SODIMAC`.

## Instalación

**Temporal (cualquier Firefox):** `about:debugging#/runtime/this-firefox` → "Cargar complemento temporal…" → elegir `manifest.json` o el `.xpi`.

**Permanente:** firmarla gratis en [addons.mozilla.org/developers](https://addons.mozilla.org/developers) como "sin listar", o en Firefox Developer Edition/Nightly poner `xpinstall.signatures.required = false` en `about:config`.

## Empaquetar

```bash
./build.sh   # genera dist/solo-falabella-<version>.xpi
```

## Estructura

| Archivo | Rol |
|---|---|
| `manifest.json` | Manifest V2 (Firefox ≥ 109) |
| `common.js` | Lógica de URL compartida: `isListing`, `hasFilter`, `addFilter`, `removeFilter` |
| `background.js` | Modo automático (escucha `tabs.onUpdated`) |
| `popup.html` / `popup.js` | Interfaz del botón |
| `icon.svg` | Ícono |
