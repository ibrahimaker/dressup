// Export each original drawing as an editable, transparent SVG for artists.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/wardrobe.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const context = { exports: {} };
vm.runInNewContext(compiled.outputText, context);
const { items, categories, presets } = context.exports;
assert.equal(items.length, 33);
assert.equal(new Set(items.map(i => i.id)).size, items.length, 'Asset IDs must be unique');
for (const category of categories) {
  assert(items.filter(i => i.category === category.id).length >= 5);
  for (const preset of Object.values(presets)) {
    assert(items.some(i => i.id === preset[category.id] && i.category === category.id), 'Every preset needs valid assets');
  }
}
const folder = path.join(root, 'assets/wardrobe');
fs.mkdirSync(folder, { recursive: true });
for (const item of items) {
  assert(item.art.length > 50, 'An asset must have real vector geometry');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640"><title>${item.name}</title><g stroke="#765665" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${item.art}</g></svg>\n`;
  fs.writeFileSync(path.join(folder, `${item.id}.svg`), svg);
}
console.log(`Validated and exported ${items.length} original SVG assets across ${categories.length} categories.`);
