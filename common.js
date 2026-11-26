// Lógica compartida entre background y popup.
// Shared logic for the background and the popup.
const PARAM = "f.derived.variant.sellerId";

// Vendedores seleccionables, en el orden en que se muestran y se escriben
// en la URL. Varios se combinan con "::" (O lógico en el sitio).
// Selectable sellers, in display/URL order. Joined with "::" (logical OR).
const SELLERS = [
  { id: "FALABELLA", name: "Falabella" },
  { id: "SODIMAC", name: "Sodimac" },
  { id: "TOTTUS", name: "Tottus" },
];
const SELLER_IDS = SELLERS.map((s) => s.id);

// Páginas de listado donde el filtro tiene sentido.
// Listing pages where the filter applies.
const LISTING_RE = /^\/falabella-cl\/(category|brand|search|collection|seller)\b/i;

function isListing(urlStr) {
  try {
    const u = new URL(urlStr);
    return u.hostname === "www.falabella.com" && LISTING_RE.test(u.pathname);
  } catch (e) {
    return false;
  }
}

// Deja solo IDs conocidos, sin repetir y en el orden de SELLERS.
// Keeps known IDs only, deduplicated, in SELLERS order.
function normalizeSellers(ids) {
  const set = new Set(Array.isArray(ids) ? ids : []);
  return SELLER_IDS.filter((id) => set.has(id));
}

function urlSellers(u) {
  const v = u.searchParams.get(PARAM);
  return v ? v.split("::").filter(Boolean) : [];
}

// Vendedores seleccionables presentes en la URL.
// Selectable sellers present in the URL.
function selectedIn(urlStr) {
  return normalizeSellers(urlSellers(new URL(urlStr)));
}

// Devuelve la URL filtrada exactamente por `selected` (vacío = todos los
// vendedores). Conserva otros vendedores que no son seleccionables.
// Returns the URL filtered by exactly `selected` (empty = all sellers),
// keeping any non-selectable sellers already in the URL.
function applySellers(urlStr, selected) {
  const u = new URL(urlStr);
  const current = urlSellers(u);
  const others = current.filter((s) => !SELLER_IDS.includes(s));
  const next = [...others, ...normalizeSellers(selected)];
  if (next.join("::") === current.join("::")) return urlStr;

  if (next.length) {
    u.searchParams.set(PARAM, next.join("::"));
    u.searchParams.set("facetSelected", "true");
  } else {
    u.searchParams.delete(PARAM);
  }
  u.searchParams.delete("page"); // volver a la página 1 / back to page 1
  return u.toString();
}
