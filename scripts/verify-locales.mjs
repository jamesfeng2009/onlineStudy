import fs from "node:fs";

const en = {
  translation: JSON.parse(fs.readFileSync("src/locales/en/translation.json", "utf-8")),
  learn: JSON.parse(fs.readFileSync("src/locales/en/learn.json", "utf-8")),
};

function keyPaths(node, prefix = "", out = []) {
  if (node !== null && typeof node === "object" && !Array.isArray(node)) {
    for (const [k, v] of Object.entries(node)) keyPaths(v, prefix ? prefix + "." + k : k, out);
  } else {
    out.push(prefix);
  }
  return out;
}

function getAt(node, p) {
  return p.split(".").reduce((n, k) => n?.[k], node);
}

const PH = /\{\{[^}]+\}\}/g;
const multiset = (s) => (s.match(PH) ?? []).sort().join(" ");

let fail = 0;
for (const lang of ["th", "ms", "id", "vi"]) {
  for (const file of ["translation", "learn"]) {
    const target = JSON.parse(fs.readFileSync(`src/locales/${lang}/${file}.json`, "utf-8"));
    const enPaths = keyPaths(en[file]);
    const tgtPaths = new Set(keyPaths(target));
    const missing = enPaths.filter((p) => !tgtPaths.has(p));
    const phBad = [];
    const untranslated = [];
    for (const p of enPaths) {
      const s = getAt(en[file], p);
      const t = getAt(target, p);
      if (typeof s === "string" && typeof t === "string") {
        if (multiset(s) !== multiset(t)) phBad.push(p);
        if (s === t && s.length >= 24) untranslated.push(p);
      }
    }
    console.log(`${lang}/${file}: leaves=${enPaths.length} missing=${missing.length} placeholderBad=${phBad.length} identical≥24=${untranslated.length}`);
    if (missing.length) { console.log("  MISSING:", missing.slice(0, 10)); fail = 1; }
    if (phBad.length) { console.log("  PH BAD:", phBad.slice(0, 10)); fail = 1; }
    if (untranslated.length) console.log("  identical sample:", untranslated.slice(0, 5));
  }
}
process.exit(fail);
