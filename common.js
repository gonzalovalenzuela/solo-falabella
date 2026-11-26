// Lógica compartida entre background y popup.
const PARAM = "f.derived.variant.sellerId";
const SELLER = "FALABELLA";

// Páginas de listado donde el filtro tiene sentido.
const LISTING_RE = /^\/falabella-cl\/(category|brand|search|collection|seller)\b/i;

function isListing(urlStr) {
  try {
    const u = new URL(urlStr);
    return u.hostname === "www.falabella.com" && LISTING_RE.test(u.pathname);
  } catch (e) {
    return false;
  }
}

function hasFilter(urlStr) {
  const u = new URL(urlStr);
  const v = u.searchParams.get(PARAM);
  return !!v && v.split("::").includes(SELLER);
}

function addFilter(urlStr) {
  const u = new URL(urlStr);
  const current = u.searchParams.get(PARAM);
  const sellers = current ? current.split("::").filter(Boolean) : [];
  if (!sellers.includes(SELLER)) sellers.push(SELLER);
  u.searchParams.set(PARAM, sellers.join("::"));
  u.searchParams.set("facetSelected", "true");
  u.searchParams.delete("page"); // volver a la página 1
  return u.toString();
}

// Identifica la página (sin query) para recordar dónde el usuario quitó
// el filtro. / Identifies the page (without query) for opt-out tracking.
function pageKey(urlStr) {
  try {
    const u = new URL(urlStr);
    return u.origin + u.pathname;
  } catch (e) {
    return urlStr;
  }
}

// Clave en storage.session de la exclusión de una pestaña.
// storage.session key for a tab's opt-out.
function optOutKey(tabId) {
  return "optOut:" + tabId;
}

function removeFilter(urlStr) {
  const u = new URL(urlStr);
  const current = u.searchParams.get(PARAM);
  if (!current) return urlStr;
  const sellers = current.split("::").filter((s) => s && s !== SELLER);
  if (sellers.length) u.searchParams.set(PARAM, sellers.join("::"));
  else u.searchParams.delete(PARAM);
  u.searchParams.delete("page");
  return u.toString();
}
