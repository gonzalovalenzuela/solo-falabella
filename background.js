// Modo automático: si está activo y hay vendedores seleccionados, cada
// listado de Falabella que se abra sin filtro de vendedor se redirige a la
// versión filtrada. Si la URL ya filtra por algún vendedor (por ejemplo,
// elegido en el sitio), se respeta.
// Auto mode: when enabled with sellers selected, listings opened without a
// seller filter are redirected to the filtered version. URLs that already
// filter by a seller (e.g. chosen on the site) are left alone.

const API = typeof browser !== "undefined" ? browser : chrome;

API.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  const url = changeInfo.url;
  if (!url || !isListing(url)) return;

  const { auto, sellers } = await API.storage.local.get({ auto: false, sellers: [] });
  const selected = normalizeSellers(sellers);
  if (!auto || !selected.length) return;

  if (!selectedIn(url).length) {
    API.tabs.update(tabId, { url: applySellers(url, selected) });
  }
});
