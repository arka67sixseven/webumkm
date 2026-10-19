// Menyusun output statis untuk Vercel ke folder `public/`.
// Dipanggil oleh `npm run vercel-build` (setelah CSS dibangun).
import { cp, mkdir, rm } from "node:fs/promises";

const out = "public";
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const file of ["index.html", "robots.txt"]) {
  await cp(file, `${out}/${file}`);
}
for (const dir of ["css", "js", "assets"]) {
  await cp(dir, `${out}/${dir}`, { recursive: true });
}

console.log("public/ siap untuk Vercel (tanpa node_modules / file sumber).");
