// Pruebas simples de la lógica de URL: node test/url.test.js
// Simple URL logic tests.
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const vm = require("vm");

const ctx = { URL };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "common.js"), "utf8") +
  "\nthis.api = { isListing, normalizeSellers, selectedIn, applySellers, SELLER_IDS };", ctx);
const { isListing, normalizeSellers, selectedIn, applySellers, SELLER_IDS } = ctx.api;
const PARAM = "f.derived.variant.sellerId";
const param = (u) => new URL(u).searchParams.get(PARAM);
// Los arreglos vienen de otro contexto vm: comparar como JSON.
// Arrays come from another vm context: compare as JSON.
const eq = (a, b) => assert.strictEqual(JSON.stringify(a), JSON.stringify(b));

const tv = "https://www.falabella.com/falabella-cl/category/cat7190148/Smart-TV?sortBy=derived.price.search%2Casc&f.derived.product.attribute.range.Tamano_de_la_pantalla_cat7190148=32%22+-+39.9%22%3A%3A40%22+-+49.9%22%3A%3AHasta+31.9%22&facetSelected=true&page=3";

// isListing
assert.ok(isListing(tv));
assert.ok(isListing("https://www.falabella.com/falabella-cl/brand/APPLE"));
assert.ok(!isListing("https://www.falabella.com/falabella-cl/product/123/x"));
assert.ok(!isListing("https://example.com/falabella-cl/category/x"));
assert.ok(!isListing("no es url"));

// normalizeSellers: solo conocidos, sin repetir, en orden fijo
eq(SELLER_IDS, ["FALABELLA", "SODIMAC", "TOTTUS"]);
eq(normalizeSellers(["TOTTUS", "X", "FALABELLA", "TOTTUS"]), ["FALABELLA", "TOTTUS"]);
eq(normalizeSellers(undefined), []);

// Sin filtro
eq(selectedIn(tv), []);

// Un vendedor
const fala = applySellers(tv, ["FALABELLA"]);
assert.strictEqual(param(fala), "FALABELLA");
eq(selectedIn(fala), ["FALABELLA"]);
assert.ok(!new URL(fala).searchParams.has("page"), "vuelve a la página 1");
assert.ok(fala.includes("Tamano_de_la_pantalla"), "conserva otros filtros");
assert.strictEqual(new URL(fala).searchParams.get("sortBy"), "derived.price.search,asc");

// Varios vendedores, en orden fijo
const multi = applySellers(tv, ["TOTTUS", "FALABELLA"]);
assert.strictEqual(param(multi), "FALABELLA::TOTTUS");
eq(selectedIn(multi), ["FALABELLA", "TOTTUS"]);

// Cambiar la selección reemplaza (no acumula)
assert.strictEqual(param(applySellers(multi, ["SODIMAC"])), "SODIMAC");

// Ninguno = todos los vendedores
const none = applySellers(multi, []);
assert.ok(!new URL(none).searchParams.has(PARAM));
eq(selectedIn(none), []);

// Misma selección: URL sin cambios (no resetea la página)
const paged = fala + "&page=2";
assert.strictEqual(applySellers(paged, ["FALABELLA"]), paged);
assert.strictEqual(applySellers(tv, []), tv);

// Conserva vendedores que no son seleccionables
const other = "https://www.falabella.com/falabella-cl/brand/APPLE?f.derived.variant.sellerId=OTRO::FALABELLA";
eq(selectedIn(other), ["FALABELLA"]);
assert.strictEqual(param(applySellers(other, ["SODIMAC", "TOTTUS"])), "OTRO::SODIMAC::TOTTUS");
assert.strictEqual(param(applySellers(other, [])), "OTRO");

console.log("OK");
