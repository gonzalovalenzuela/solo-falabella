// Configuración de web-ext (solo Firefox): excluye lo que no va en el .xpi.
// web-ext config (Firefox only): excludes files that don't ship in the .xpi.
export default {
  ignoreFiles: [
    "build.sh",
    "CLAUDE.md",
    "README.md",
    "dist",
    "icons",
    "manifest.chrome.json",
    "sw.js",
    "test",
    "web-ext-config.mjs",
  ],
};
