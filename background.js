// Modo automático: si está activo, cualquier listado de Falabella
// que se abra sin el filtro se redirige a la versión filtrada.
// Las pestañas donde el usuario quitó el filtro a mano quedan excluidas
// hasta que cambie de página.
// Auto mode: unfiltered Falabella listings are redirected to the filtered
// version, except in tabs where the user removed the filter by hand.
//
// Las exclusiones se guardan en storage.session (no en memoria) porque el
// service worker de Chrome y la página de eventos de Firefox se descargan
// cuando están inactivos. / Opt-outs live in storage.session (not memory)
// because the background is unloaded when idle in both browsers.

const API = typeof browser !== "undefined" ? browser : chrome;

API.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  const url = changeInfo.url;
  if (!url || !isListing(url)) return;

  const { auto } = await API.storage.local.get({ auto: false });
  if (!auto) return;

  const key = optOutKey(tabId);
  const { [key]: skip } = await API.storage.session.get(key);
  if (skip && skip === pageKey(url)) return;
  if (skip) await API.storage.session.remove(key);

  if (!hasFilter(url)) {
    API.tabs.update(tabId, { url: addFilter(url) });
  }
});

API.tabs.onRemoved.addListener((tabId) => {
  API.storage.session.remove(optOutKey(tabId));
});
