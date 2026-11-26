const API = typeof browser !== "undefined" ? browser : chrome;

const btn = document.getElementById("toggle");
const status = document.getElementById("status");
const autoBox = document.getElementById("auto");

(async () => {
  const { auto } = await API.storage.local.get({ auto: false });
  autoBox.checked = auto;

  const [tab] = await API.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url || !isListing(tab.url)) {
    status.textContent = "Abre un listado de falabella.com (categoría, marca o búsqueda).";
    return;
  }

  const on = hasFilter(tab.url);
  status.textContent = on ? "Filtro activo." : "Mostrando todos los vendedores.";
  btn.textContent = on ? "Mostrar todos los vendedores" : "Mostrar solo Falabella";
  btn.classList.toggle("on", on);
  btn.disabled = false;

  btn.addEventListener("click", async () => {
    let newUrl;
    if (on) {
      newUrl = removeFilter(tab.url);
      // Evita que el modo automático lo vuelva a aplicar en esta página
      await API.runtime.sendMessage({ type: "optOut", tabId: tab.id, url: newUrl });
    } else {
      newUrl = addFilter(tab.url);
    }
    await API.tabs.update(tab.id, { url: newUrl });
    window.close();
  });
})();

autoBox.addEventListener("change", () => {
  API.storage.local.set({ auto: autoBox.checked });
});
