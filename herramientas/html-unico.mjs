// Mete el JavaScript y el CSS compilados dentro del index.html, para que la
// carpeta dist se pueda abrir con doble clic, sin levantar un servidor.
//
// Por qué hace falta: los navegadores bloquean los archivos de JavaScript
// cargados como módulo cuando la página se abre desde el disco (file://).
// Si el código está escrito dentro del propio HTML, no hay nada que cargar
// y el bloqueo no aplica.
//
// Se ejecuta solo, después de compilar:  npm run build
// (ver el script "build" en package.json)

import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const INDEX = join(DIST, 'index.html');

if (!existsSync(INDEX)) {
  console.error(`No encontré ${INDEX}. Compilá primero con: npm run build`);
  process.exit(1);
}

let html = readFileSync(INDEX, 'utf8');
const usados = [];

// Un '</script>' dentro del código cortaría la etiqueta antes de tiempo.
function escaparCierres(codigo) {
  return codigo.replace(/<\/script>/gi, '<\\/script>');
}

// <script type="module" crossorigin src="./assets/xxx.js"></script>
html = html.replace(
  /<script\b[^>]*\bsrc="\.\/([^"]+)"[^>]*><\/script>/gi,
  (etiqueta, ruta) => {
    const archivo = join(DIST, ruta);
    if (!existsSync(archivo)) return etiqueta;
    usados.push(archivo);
    const codigo = escaparCierres(readFileSync(archivo, 'utf8'));
    return `<script type="module">\n${codigo}\n</script>`;
  },
);

// <link rel="stylesheet" crossorigin href="./assets/xxx.css">
html = html.replace(
  /<link\b[^>]*\brel="stylesheet"[^>]*\bhref="\.\/([^"]+)"[^>]*>/gi,
  (etiqueta, ruta) => {
    const archivo = join(DIST, ruta);
    if (!existsSync(archivo)) return etiqueta;
    usados.push(archivo);
    return `<style>\n${readFileSync(archivo, 'utf8')}\n</style>`;
  },
);

writeFileSync(INDEX, html, 'utf8');

// Los archivos que quedaron adentro del HTML ya no se usan.
for (const archivo of usados) rmSync(archivo, { force: true });

const peso = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0);
console.log(
  `index.html quedó con todo adentro (${peso} KB). ` +
    `Se pueden abrir haciendo doble clic.`,
);
