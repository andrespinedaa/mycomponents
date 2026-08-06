// Genera src/theme/generators/css-property-names.data.ts a partir de la interfaz
// `Properties` de csstype (la misma fuente de la que sale React.CSSProperties).
// No depende del DOM — corre en Node, seguro para SSR — y no se mantiene a mano.
//
// Regenerar cuando csstype se actualice: node scripts/generate-css-properties.mjs

import ts from "typescript";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const csstypePath = resolve(root, "node_modules/csstype/index.d.ts");
const outPath = resolve(root, "src/theme/generators/css-property-names.data.ts");

const program = ts.createProgram([csstypePath], { allowJs: false, noEmit: true });
const sourceFile = program.getSourceFile(csstypePath);
const checker = program.getTypeChecker();

if (!sourceFile) {
  throw new Error(`No se pudo leer ${csstypePath}`);
}

let propertiesInterface;
ts.forEachChild(sourceFile, (node) => {
  if (ts.isInterfaceDeclaration(node) && node.name.text === "Properties") {
    propertiesInterface = node;
  }
});

if (!propertiesInterface) {
  throw new Error('No se encontró la interfaz "Properties" en csstype/index.d.ts');
}

const type = checker.getTypeAtLocation(propertiesInterface);
const names = checker
  .getPropertiesOfType(type)
  .map((symbol) => symbol.getName())
  .filter((name) => /^[a-zA-Z]/.test(name))
  .sort();

const header = `// AUTO-GENERADO — no editar a mano.
// Fuente: la interfaz Properties<TLength, TTime> de csstype (de donde sale React.CSSProperties).
// Regenerar: node scripts/generate-css-properties.mjs
`;

const body = `export const CSS_PROPERTY_NAMES = ${JSON.stringify(names, null, 2)} as const;\n`;

writeFileSync(outPath, header + body, "utf-8");
console.log(`${names.length} CSS properties escritas en ${outPath}`);
