/**
 * Copie assets/ebook-official.pdf → private/formation/ebook.pdf
 */
import { copyFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = resolve(__dirname, "../assets/ebook-official.pdf");
const dest = resolve(__dirname, "../private/formation/ebook.pdf");

if (!existsSync(source)) {
  console.error("❌ Fichier manquant : assets/ebook-official.pdf");
  process.exit(1);
}

copyFileSync(source, dest);
console.log(`✅ PDF officiel copié → ${dest}`);
