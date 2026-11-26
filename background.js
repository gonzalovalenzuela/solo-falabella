// Modo automático: si está activo, cualquier listado de Falabella
// que se abra sin el filtro se redirige a la versión filtrada.
// Las pestañas donde el usuario quitó el filtro a mano quedan excluidas
// hasta que cambie de página.

const API = typeof browser !== "undefined" ? browser : chrome;

// tabId -> URL (sin filtro) que el usuario eligió ver sin filtrar
const optedOut = new Map();

function stripForCompare(urlStr) {
  try {
    const u = new URL(removeFilter(urlStr));
    u.searchParams.delete("facetSelected");
    return u.origin + u.pathname;
  } catch (e) {
    return urlStr;
  }
}

API.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  const url = changeInfo.url;
  if (!url || !isListing(url)) return;

  const { auto } = await API.storage.local.get({ auto: false });
  if (!auto) return;

  const skip = optedOut.get(tabId);
  if (skip && skip === stripForCompare(url)) return;
  optedOut.delete(tabId);

  if (!hasFilter(url)) {
    API.tabs.update(tabId, { url: addFilter(url) });
  }
});

API.tabs.onRemoved.addListener((tabId) => optedOut.delete(tabId));

// Mensajes desde el popup
API.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === "optOut") {
    optedOut.set(msg.tabId, stripForCompare(msg.url));
  }
});
