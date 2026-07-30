/**
 * Génère les bonus PDF soignés dans private/formation/
 */
import PDFDocument from "pdfkit";
import { createWriteStream, existsSync, mkdirSync, copyFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { BRAND } from "../lib/formation/brand";
import {
  BONUS_CHECKLIST,
  BONUS_CONTRAT,
  BONUS_SCRIPTS,
} from "../lib/formation/bonus-content.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../private/formation");
const { night: NIGHT, gold: GOLD, cream: CREAM, text: TEXT } = BRAND;

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_Y = PAGE_H - 40;

type Doc = InstanceType<typeof PDFDocument>;

function ensureDir() {
  mkdirSync(outDir, { recursive: true });
  mkdirSync(resolve(outDir, "videos"), { recursive: true });
}

function fillCream(doc: Doc) {
  doc.rect(0, 0, PAGE_W, PAGE_H).fill(CREAM);
}

function goldRule(doc: Doc, y: number, width = CONTENT_W) {
  doc
    .strokeColor(GOLD)
    .lineWidth(1)
    .moveTo(MARGIN, y)
    .lineTo(MARGIN + width, y)
    .stroke();
}

function drawHeader(doc: Doc, eyebrow: string, title: string, subtitle?: string) {
  fillCream(doc);

  // Bandeau nuit
  doc.rect(0, 0, PAGE_W, 88).fill(NIGHT);
  doc
    .fillColor(GOLD)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text("DERRA VENDING  ·  BONUS MEMBRE", MARGIN, 22, { width: CONTENT_W });
  doc
    .fillColor("#FFFFFF")
    .font("Helvetica-Bold")
    .fontSize(18)
    .text(title, MARGIN, 40, { width: CONTENT_W });

  // Liseré or sous bandeau
  doc.rect(0, 88, PAGE_W, 3).fill(GOLD);

  doc.y = 108;
  if (subtitle) {
    doc
      .fillColor(TEXT)
      .font("Helvetica")
      .fontSize(10)
      .text(subtitle, MARGIN, doc.y, { width: CONTENT_W, lineGap: 2 });
    doc.moveDown(0.6);
  }
  goldRule(doc, doc.y);
  doc.moveDown(0.8);
}

function drawFooter(doc: Doc, label: string, pageNum: number) {
  goldRule(doc, FOOTER_Y);
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(TEXT)
    .text(`Derra Vending · ${label} · Confidentiel`, MARGIN, FOOTER_Y + 8, {
      width: CONTENT_W - 40,
      align: "left",
    });
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(GOLD)
    .text(String(pageNum), MARGIN, FOOTER_Y + 8, {
      width: CONTENT_W,
      align: "right",
    });
}

function ensureSpace(doc: Doc, needed: number, label: string, page: { n: number }) {
  if (doc.y + needed <= FOOTER_Y - 16) return;
  drawFooter(doc, label, page.n);
  doc.addPage();
  fillCream(doc);
  page.n += 1;
  // Mini header page suivante
  doc.rect(0, 0, PAGE_W, 28).fill(NIGHT);
  doc
    .fillColor(GOLD)
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("DERRA VENDING  ·  BONUS", MARGIN, 10, { width: CONTENT_W });
  doc.rect(0, 28, PAGE_W, 2).fill(GOLD);
  doc.y = 48;
}

function sectionTitle(doc: Doc, text: string, label: string, page: { n: number }) {
  ensureSpace(doc, 36, label, page);
  const y = doc.y;
  doc.rect(MARGIN, y, 4, 16).fill(GOLD);
  doc
    .fillColor(NIGHT)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(text, MARGIN + 14, y + 1, { width: CONTENT_W - 14 });
  doc.y = y + 22;
}

function bodyText(doc: Doc, text: string, label: string, page: { n: number }, opts?: { mono?: boolean }) {
  const lines = text.split("\n");
  for (const line of lines) {
    ensureSpace(doc, 18, label, page);
    doc
      .fillColor(TEXT)
      .font(opts?.mono ? "Courier" : "Helvetica")
      .fontSize(opts?.mono ? 9 : 9.5)
      .text(line.length ? line : " ", MARGIN, doc.y, {
        width: CONTENT_W,
        lineGap: 1.5,
      });
  }
  doc.moveDown(0.35);
}

function quoteBox(doc: Doc, text: string, label: string, page: { n: number }) {
  const padding = 12;
  const boxW = CONTENT_W;
  // Mesure hauteur approximative
  const heightEstimate = Math.max(48, text.split("\n").length * 13 + padding * 2);
  ensureSpace(doc, Math.min(heightEstimate, 200), label, page);

  const startY = doc.y;
  const textX = MARGIN + padding + 6;
  const textW = boxW - padding * 2 - 6;

  // Fond léger + bordure or
  const measured = doc.heightOfString(text, { width: textW, lineGap: 2 });
  const boxH = measured + padding * 2;

  ensureSpace(doc, boxH + 8, label, page);
  const y = doc.y;

  doc
    .save()
    .roundedRect(MARGIN, y, boxW, boxH, 4)
    .fill("#FFFFFF");
  doc
    .strokeColor(GOLD)
    .lineWidth(1)
    .roundedRect(MARGIN, y, boxW, boxH, 4)
    .stroke();
  // Barre gauche
  doc.rect(MARGIN, y, 4, boxH).fill(GOLD);
  doc.restore();

  doc
    .fillColor(TEXT)
    .font("Helvetica")
    .fontSize(9.5)
    .text(text, textX, y + padding, { width: textW, lineGap: 2 });

  doc.y = y + boxH + 14;
  void startY;
}

function writeContrat(): Promise<void> {
  return new Promise((res, rej) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      info: {
        Title: BONUS_CONTRAT.title,
        Author: "Derra Vending",
      },
    });
    const stream = createWriteStream(resolve(outDir, "contrat-depot-gratuit.pdf"));
    doc.pipe(stream);
    const page = { n: 1 };
    const label = "Contrat type";

    drawHeader(
      doc,
      "BONUS",
      BONUS_CONTRAT.title,
      BONUS_CONTRAT.subtitle +
        " — Remplis les champs _______________ . Fais valider localement si besoin."
    );

    for (const s of BONUS_CONTRAT.sections) {
      sectionTitle(doc, s.h, label, page);
      bodyText(doc, s.body, label, page);
      doc.moveDown(0.25);
    }

    drawFooter(doc, label, page.n);
    doc.end();
    stream.on("finish", () => res());
    stream.on("error", rej);
  });
}

function writeScripts(): Promise<void> {
  return new Promise((res, rej) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      info: { Title: BONUS_SCRIPTS.title, Author: "Derra Vending" },
    });
    const stream = createWriteStream(resolve(outDir, "scripts-prospection.pdf"));
    doc.pipe(stream);
    const page = { n: 1 };
    const label = "Scripts prospection";

    drawHeader(
      doc,
      "BONUS",
      BONUS_SCRIPTS.title,
      "Copie-colle et adapte [Prénom], [ta ville], ton ton. L’objectif : enlever tous les freins du commerçant."
    );

    for (const s of BONUS_SCRIPTS.sections) {
      sectionTitle(doc, s.h, label, page);
      quoteBox(doc, s.body, label, page);
    }

    drawFooter(doc, label, page.n);
    doc.end();
    stream.on("finish", () => res());
    stream.on("error", rej);
  });
}

function writeChecklist(): Promise<void> {
  return new Promise((res, rej) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      info: { Title: BONUS_CHECKLIST.title, Author: "Derra Vending" },
    });
    const stream = createWriteStream(resolve(outDir, "checklist-premiere-machine.pdf"));
    doc.pipe(stream);
    const page = { n: 1 };
    const label = "Checklist 1ère machine";

    drawHeader(doc, "BONUS", BONUS_CHECKLIST.title, BONUS_CHECKLIST.intro);

    BONUS_CHECKLIST.items.forEach((item, i) => {
      const textW = CONTENT_W - 68;
      doc.font("Helvetica-Bold").fontSize(10);
      const titleH = doc.heightOfString(item.title, { width: textW });
      doc.font("Helvetica").fontSize(8.5);
      const whyH = doc.heightOfString(item.why, { width: textW });
      const rowH = Math.max(54, 14 + titleH + 4 + whyH + 12);

      ensureSpace(doc, rowH + 4, label, page);
      const y = doc.y;

      if (i % 2 === 0) {
        doc.rect(MARGIN, y, CONTENT_W, rowH).fill("#FFFFFF");
      }

      doc
        .strokeColor(GOLD)
        .lineWidth(1.2)
        .roundedRect(MARGIN + 10, y + 12, 14, 14, 2)
        .stroke();

      doc
        .fillColor(GOLD)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(String(i + 1).padStart(2, "0"), MARGIN + 32, y + 14, { width: 22 });

      const textX = MARGIN + 56;

      doc
        .fillColor(NIGHT)
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(item.title, textX, y + 10, { width: textW });

      const afterTitle = doc.y + 2;

      doc
        .fillColor(TEXT)
        .font("Helvetica")
        .fontSize(8.5)
        .text(item.why, textX, afterTitle, { width: textW, lineGap: 1.5 });

      doc.y = Math.max(y + rowH, doc.y + 8);
    });

    doc.moveDown(0.8);
    ensureSpace(doc, 48, label, page);
    doc
      .fillColor(NIGHT)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Comment l’utiliser", MARGIN, doc.y, { width: CONTENT_W });
    doc.moveDown(0.3);
    doc
      .fillColor(TEXT)
      .font("Helvetica")
      .fontSize(9.5)
      .text(
        "Imprime cette checklist. Traite les points dans l’ordre : d’abord préparer (1–8), ensuite prospecter (9–10), puis installer et encaisser (11–15). Une case non cochée = un frein à lever.",
        { width: CONTENT_W, lineGap: 2 }
      );

    drawFooter(doc, label, page.n);
    doc.end();
    stream.on("finish", () => res());
    stream.on("error", rej);
  });
}

type CalcRow = { label: string; example: string; note: string };

const CALC_ROWS: CalcRow[] = [
  { label: "Prix facturé / tasse", example: "0,85 CHF", note: "À adapter (EUR, etc.)" },
  { label: "Coût consommables / tasse", example: "0,12 CHF", note: "Café + lait + gobelet…" },
  { label: "Marge brute / tasse", example: "0,73 CHF", note: "Prix − coût" },
  { label: "Tasses / mois (1 machine)", example: "300", note: "Selon emplacement" },
  { label: "CA mensuel machine", example: "255 CHF", note: "Tasses × prix" },
  { label: "Coût mensuel", example: "36 CHF", note: "Tasses × coût" },
  { label: "Marge mensuelle machine", example: "219 CHF", note: "CA − coût" },
  { label: "Prix machine", example: "2 750 CHF", note: "Neuf ou occasion" },
  { label: "Mois pour rembourser", example: "≈ 12,5 mois", note: "Prix ÷ marge mensuelle" },
  { label: "Nombre de machines", example: "10", note: "Ton parc cible" },
  { label: "Marge parc mensuelle", example: "2 190 CHF", note: "Marge × nb machines" },
];

function writeCalculator(): Promise<void> {
  return new Promise((res, rej) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      info: { Title: "Calculateur de marges — Derra Vending", Author: "Derra Vending" },
    });
    const stream = createWriteStream(resolve(outDir, "calculateur-marges.pdf"));
    doc.pipe(stream);
    const page = { n: 1 };
    const label = "Calculateur de marges";

    drawHeader(
      doc,
      "BONUS",
      "Calculateur de marges",
      "Exemples terrain (CHF). Remplace par TES chiffres dans la colonne « Ton chiffre ». Convertis en EUR / autre devise selon ton pays."
    );

    // En-tête tableau
    const col1 = MARGIN;
    const col2 = MARGIN + 200;
    const col3 = MARGIN + 320;
    const col4 = MARGIN + 430;
    const rowH = 26;

    ensureSpace(doc, rowH + 8, label, page);
    let y = doc.y;
    doc.rect(MARGIN, y, CONTENT_W, rowH).fill(NIGHT);
    doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(8);
    doc.text("INDICATEUR", col1 + 8, y + 9, { width: 180 });
    doc.text("EXEMPLE", col2 + 4, y + 9, { width: 100 });
    doc.text("NOTE", col3 + 4, y + 9, { width: 100 });
    doc.text("TON CHIFFRE", col4 + 4, y + 9, { width: 90 });
    doc.y = y + rowH;

    CALC_ROWS.forEach((row, i) => {
      ensureSpace(doc, rowH, label, page);
      y = doc.y;
      doc.rect(MARGIN, y, CONTENT_W, rowH).fill(i % 2 === 0 ? "#FFFFFF" : CREAM);
      doc
        .strokeColor(GOLD)
        .lineWidth(0.4)
        .rect(MARGIN, y, CONTENT_W, rowH)
        .stroke();

      doc.fillColor(NIGHT).font("Helvetica-Bold").fontSize(8.5).text(row.label, col1 + 8, y + 8, {
        width: 188,
      });
      doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(8.5).text(row.example, col2 + 4, y + 8, {
        width: 100,
      });
      doc.fillColor(TEXT).font("Helvetica").fontSize(7.5).text(row.note, col3 + 4, y + 8, {
        width: 100,
      });
      // Case saisie
      doc
        .strokeColor(GOLD)
        .lineWidth(0.8)
        .roundedRect(col4 + 4, y + 5, 88, 16, 2)
        .stroke();

      doc.y = y + rowH;
    });

    doc.moveDown(1.2);
    ensureSpace(doc, 90, label, page);
    sectionTitle(doc, "Formules à retenir", label, page);
    quoteBox(
      doc,
      `Marge / tasse = Prix facturé − Coût consommables
CA mensuel = Tasses × Prix
Marge mensuelle = Tasses × Marge / tasse
Point mort (mois) = Prix machine ÷ Marge mensuelle
Marge parc = Marge mensuelle × Nombre de machines`,
      label,
      page
    );

    sectionTitle(doc, "Exemple rapide", label, page);
    bodyText(
      doc,
      "300 tasses × 0,73 CHF de marge ≈ 219 CHF / mois sur une machine.\n10 machines à cette moyenne ≈ 2 190 CHF / mois.\nAdapte le prix/tasse et les volumes à ton marché (France, Belgique, Suisse…).",
      label,
      page
    );

    drawFooter(doc, label, page.n);
    doc.end();
    stream.on("finish", () => res());
    stream.on("error", rej);
  });
}

function writeVideoReadme() {
  const readme = `# Vidéos formation — Derra Vending

Place ici tes fichiers MP4 (mêmes noms) :

- 01-presentation.mp4
- 02-business-model.mp4
- 03-prospection.mp4
- 04-machines.mp4
- 05-gestion.mp4
- 06-chiffres.mp4

Servis uniquement aux membres via /api/formation/video/[id]
`;
  writeFileSync(resolve(outDir, "videos/README.md"), readme, "utf8");
}

async function syncEbook() {
  const publicPdf = resolve(__dirname, "../public/formation/ebook.pdf");
  const privatePdf = resolve(outDir, "ebook.pdf");
  if (existsSync(privatePdf)) {
    console.log("✅ ebook.pdf déjà présent dans private/formation/");
    return;
  }
  if (existsSync(publicPdf)) {
    copyFileSync(publicPdf, privatePdf);
    console.log("✅ ebook.pdf copié → private/formation/");
  } else {
    console.warn("⚠️ Pas d'ebook.pdf — lance npm run generate:ebook d'abord");
  }
}

async function main() {
  ensureDir();
  await writeContrat();
  await writeScripts();
  await writeChecklist();
  await writeCalculator();
  writeVideoReadme();
  await syncEbook();
  console.log(`✅ Bonus PDF générés dans ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
