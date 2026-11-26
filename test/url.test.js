// Pruebas simples de la lógica de URL: node test/url.test.js
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const vm = require("vm");

const ctx = { URL };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "common.js"), "utf8") +
  "\nthis.api = { isListing, hasFilter, addFilter, removeFilter };", ctx);
const { isListing, hasFilter, addFilter, removeFilter } = ctx.api;

const tv = "https://www.falabella.com/falabella-cl/category/cat7190148/Smart-TV?sortBy=derived.price.search%2Casc&f.derived.product.attribute.range.Tamano_de_la_pantalla_cat7190148=32%22+-+39.9%22%3A%3A40%22+-+49.9%22%3A%3AHasta+31.9%22&facetSelected=true&page=3";

assert.ok(isListing(tv));
assert.ok(isListing("https://www.falabella.com/falabella-cl/brand/APPLE"));
assert.ok(!isListing("https://www.falabella.com/falabella-cl/product/123/x"));
assert.ok(!isListing("https://example.com/falabella-cl/category/x"));

assert.ok(!hasFilter(tv));
const on = addFilter(tv);
assert.ok(hasFilter(on));
assert.ok(!new URL(on).searchParams.has("page"));
assert.ok(on.includes("Tamano_de_la_pantalla"), "conserva otros filtros");

const off = removeFilter(on);
assert.ok(!hasFilter(off));

// Conserva otros vendedores
const multi = "https://www.falabella.com/falabella-cl/brand/APPLE?f.derived.variant.sellerId=SODIMAC";
const multiOn = addFilter(multi);
assert.strictEqual(new URL(multiOn).searchParams.get("f.derived.variant.sellerId"), "SODIMAC::FALABELLA");
assert.strictEqual(new URL(removeFilter(multiOn)).searchParams.get("f.derived.variant.sellerId"), "SODIMAC");

console.log("OK");
