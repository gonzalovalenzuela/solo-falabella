// Popup: casillas de vendedores que se aplican al instante a la pestaña
// actual y se guardan para el modo automático. Ninguna = todos.
// Popup: seller checkboxes applied instantly to the current tab and saved
// for auto mode. None checked = all sellers.

const API = typeof browser !== "undefined" ? browser : chrome;

const status = document.getElementById("status");
const fieldset = document.getElementById("sellers");
const autoBox = document.getElementById("auto");

// Crea una casilla por vendedor / one checkbox per seller
const boxes = SELLERS.map(({ id, name }) => {
  const label = document.createElement("label");
  const box = document.createElement("input");
  box.type = "checkbox";
  box.value = id;
  label.append(box, " " + name);
  fieldset.append(label);
  return box;
});

const checked = () => boxes.filter((b) => b.checked).map((b) => b.value);

function describe(urlStr) {
  const ids = selectedIn(urlStr);
  if (!ids.length) return "Mostrando todos los vendedores.";
  const names = SELLERS.filter((s) => ids.includes(s.id)).map((s) => s.name);
  return "Mostrando: " + names.join(", ") + ".";
}

(async () => {
  const stored = await API.storage.local.get({ auto: false, sellers: [] });
  autoBox.checked = stored.auto;
  const selected = normalizeSellers(stored.sellers);
  boxes.forEach((b) => (b.checked = selected.includes(b.value)));

  const [tab] = await API.tabs.query({ active: true, currentWindow: true });
  const onListing = !!(tab && tab.url && isListing(tab.url));
  let currentUrl = onListing ? tab.url : null;

  status.textContent = onListing
    ? describe(currentUrl)
    : "Abre un listado de falabella.com (categoría, marca o búsqueda) para aplicar el filtro.";

  fieldset.addEventListener("change", async () => {
    const sellers = checked();
    await API.storage.local.set({ sellers });
    if (!currentUrl) return;

    const newUrl = applySellers(currentUrl, sellers);
    if (newUrl === currentUrl) return;
    currentUrl = newUrl;
    status.textContent = describe(newUrl);
    await API.tabs.update(tab.id, { url: newUrl });
  });
})();

autoBox.addEventListener("change", () => {
  API.storage.local.set({ auto: autoBox.checked });
});
