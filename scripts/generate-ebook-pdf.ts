/**
 * Génère public/formation/ebook.pdf
 * Contenu officiel + petites illustrations anime (sans pages blanches)
 */
import PDFDocument from "pdfkit";
import { createWriteStream, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { BRAND } from "../lib/formation/brand.ts";
import {
  OFFICIAL_EBOOK,
  OFFICIAL_PARTS,
  type EbookBlock,
} from "../lib/formation/official-ebook.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../private/formation/ebook.pdf");
const imgDir = resolve(__dirname, "../public/formation/illustrations");
const thumbDir = resolve(__dirname, "../public/formation/illustrations/thumbs");

const { night: NIGHT, gold: GOLD, cream: CREAM, text: TEXT } = BRAND;
const MARGIN = 48;
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_Y = PAGE_H - 36;
const IMG_H = 160; // illustration plus haute pour voir les personnages

type Doc = InstanceType<typeof PDFDocument>;

async function makeThumbs() {
  const { mkdirSync } = await import("fs");
  mkdirSync(thumbDir, { recursive: true });
  const files = ["cover.png", "part1.png", "part2.png", "part3.png", "part4.png", "part5.png"];
  for (const f of files) {
    const src = resolve(imgDir, f);
    if (!existsSync(src)) continue;
    await sharp(src)
      .resize(1000, 562, { fit: "contain", background: { r: 26, g: 26, b: 46, alpha: 1 } })
      .jpeg({ quality: 78 })
      .toFile(resolve(thumbDir, f.replace(".png", ".jpg")));
  }
}

function fillCream(doc: Doc) {
  doc.rect(0, 0, PAGE_W, PAGE_H).fill(CREAM);
}

function fillNight(doc: Doc) {
  doc.rect(0, 0, PAGE_W, PAGE_H).fill(NIGHT);
}

function drawFooter(doc: Doc, n: number) {
  doc
    .strokeColor(GOLD)
    .lineWidth(0.5)
    .moveTo(MARGIN, FOOTER_Y)
    .lineTo(PAGE_W - MARGIN, FOOTER_Y)
    .stroke();
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(TEXT)
    .text(`DERRA VENDING · Le café en dépôt gratuit · ${n}`, MARGIN, FOOTER_Y + 6, {
      width: CONTENT_W,
      align: "center",
    });
}

/** Nouvelle page uniquement si le contenu ne tient vraiment pas */
function needPage(doc: Doc, needed: number, page: { n: number; dirty: boolean }) {
  if (doc.y + needed <= FOOTER_Y - 12) return;
  if (page.dirty) drawFooter(doc, page.n);
  doc.addPage();
  fillCream(doc);
  page.n += 1;
  page.dirty = false;
  doc.y = MARGIN;
}

function mark(page: { dirty: boolean }) {
  page.dirty = true;
}

function drawSmallImage(doc: Doc, filename: string, page: { n: number; dirty: boolean }) {
  const thumb = resolve(thumbDir, filename.replace(".png", ".jpg"));
  const fallback = resolve(imgDir, filename);
  const path = existsSync(thumb) ? thumb : fallback;
  if (!existsSync(path)) return;

  needPage(doc, IMG_H + 18, page);
  const imgW = CONTENT_W;
  const x = MARGIN;
  const y = doc.y;
  doc.image(path, x, y, { width: imgW, height: IMG_H, fit: [imgW, IMG_H], align: "center", valign: "center" });
  doc.strokeColor(GOLD).lineWidth(0.8).rect(x, y, imgW, IMG_H).stroke();
  doc.y = y + IMG_H + 12;
  mark(page);
}

function writeBlock(doc: Doc, block: EbookBlock, page: { n: number; dirty: boolean }) {
  switch (block.type) {
    case "spacer":
      doc.moveDown(0.25);
      return;
    case "h2":
      needPage(doc, 28, page);
      doc.moveDown(0.2);
      doc.font("Helvetica-Bold").fontSize(14).fillColor(NIGHT).text(block.text, { width: CONTENT_W });
      doc.moveDown(0.25);
      mark(page);
      return;
    case "h3":
      needPage(doc, 22, page);
      doc.moveDown(0.25);
      doc.font("Helvetica-Bold").fontSize(10.5).fillColor(GOLD).text(block.text, { width: CONTENT_W });
      doc.moveDown(0.15);
      mark(page);
      return;
    case "p": {
      doc.font("Helvetica").fontSize(9.5);
      const h = doc.heightOfString(block.text, { width: CONTENT_W, lineGap: 1.5 });
      needPage(doc, h + 10, page);
      doc.font("Helvetica").fontSize(9.5).fillColor(TEXT).text(block.text, {
        width: CONTENT_W,
        lineGap: 1.5,
      });
      doc.moveDown(0.28);
      mark(page);
      return;
    }
    case "bullet": {
      doc.font("Helvetica").fontSize(9.5);
      const h = doc.heightOfString(`•  ${block.text}`, { width: CONTENT_W - 8 });
      needPage(doc, h + 6, page);
      doc.font("Helvetica").fontSize(9.5).fillColor(TEXT).text(`•  ${block.text}`, {
        width: CONTENT_W,
        indent: 6,
      });
      doc.moveDown(0.1);
      mark(page);
      return;
    }
    case "tip": {
      const pad = 8;
      const textW = CONTENT_W - pad * 2;
      doc.font("Helvetica-Bold").fontSize(8.5);
      const titleH = doc.heightOfString(block.title.toUpperCase(), { width: textW });
      doc.font("Helvetica").fontSize(9);
      const bodyH = doc.heightOfString(block.text, { width: textW, lineGap: 1.5 });
      const boxH = titleH + bodyH + pad * 2 + 6;
      needPage(doc, boxH + 10, page);
      const tipTop = doc.y;
      doc.strokeColor(GOLD).lineWidth(0.9).rect(MARGIN, tipTop, CONTENT_W, boxH).stroke();
      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor(GOLD)
        .text(block.title.toUpperCase(), MARGIN + pad, tipTop + pad, { width: textW });
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(TEXT)
        .text(block.text, MARGIN + pad, tipTop + pad + titleH + 3, { width: textW, lineGap: 1.5 });
      doc.y = tipTop + boxH + 10;
      mark(page);
      return;
    }
  }
}

async function generate() {
  const { mkdirSync } = await import("fs");
  mkdirSync(resolve(__dirname, "../private/formation"), { recursive: true });
  await makeThumbs();

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    autoFirstPage: true,
    info: {
      Title: `${OFFICIAL_EBOOK.title} — Derra Vending`,
      Author: "Ibrahim Derra",
      Subject: "Formation café en dépôt gratuit",
    },
  });

  const stream = createWriteStream(outPath);
  doc.pipe(stream);
  const page = { n: 1, dirty: true };

  // Couverture compacte
  fillNight(doc);
  const coverThumb = resolve(thumbDir, "cover.jpg");
  if (existsSync(coverThumb)) {
    doc.image(coverThumb, MARGIN, 70, {
      width: CONTENT_W,
      height: 200,
      fit: [CONTENT_W, 200],
      align: "center",
    });
    doc.strokeColor(GOLD).lineWidth(1).rect(MARGIN, 70, CONTENT_W, 200).stroke();
  }
  doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(11).text("DV  ·  DERRA VENDING", MARGIN, 300, {
    width: CONTENT_W,
    align: "center",
  });
  doc
    .fillColor(CREAM)
    .font("Helvetica-Bold")
    .fontSize(24)
    .text("LE CAFÉ EN\nDÉPÔT GRATUIT", MARGIN, 330, {
      width: CONTENT_W,
      align: "center",
      lineGap: 3,
    });
  doc
    .fillColor(GOLD)
    .font("Helvetica")
    .fontSize(10)
    .text(OFFICIAL_EBOOK.subtitle, MARGIN, 420, { width: CONTENT_W, align: "center", lineGap: 2 });
  doc.fillColor(CREAM).fontSize(10).text(OFFICIAL_EBOOK.author, MARGIN, 480, {
    width: CONTENT_W,
    align: "center",
  });
  doc.fillColor(GOLD).fontSize(9).text(OFFICIAL_EBOOK.tagline, MARGIN, 510, {
    width: CONTENT_W,
    align: "center",
  });

  // Bienvenue
  doc.addPage();
  page.n = 2;
  page.dirty = true;
  fillCream(doc);
  doc.y = MARGIN;
  doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(9).text("BIENVENUE");
  doc.fillColor(NIGHT).font("Helvetica-Bold").fontSize(16).text("Avant de commencer", { width: CONTENT_W });
  doc.moveDown(0.45);

  for (const p of [
    "Ce guide n'est pas de la théorie. C'est la méthode utilisée tous les jours sur un parc de machines à café construit à Genève — et applicable partout en Europe. Les chiffres d'exemple sont en CHF ; adapte prix et fournisseurs à ton pays. Les erreurs décrites, je les ai faites avant toi.",
    "Le principe du café en dépôt gratuit est simple : tu installes une machine professionnelle gratuitement chez un commerçant, et tu factures chaque tasse consommée. Peu de risque, un investissement maîtrisé, et des revenus qui reviennent chaque mois.",
    "Lis-le en entier, applique étape par étape, et laisse le temps faire le reste.",
  ]) {
    writeBlock(doc, { type: "p", text: p }, page);
  }

  doc.moveDown(0.3);
  doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(9).text("SOMMAIRE");
  doc.moveDown(0.25);
  for (const part of OFFICIAL_PARTS) {
    needPage(doc, 16, page);
    doc.font("Helvetica").fontSize(10).fillColor(NIGHT).text(`${part.id}  ·  ${part.title}`, {
      width: CONTENT_W,
    });
    doc.moveDown(0.2);
    mark(page);
  }
  drawFooter(doc, page.n);

  // Parties — enchaînées sans page vide
  for (const part of OFFICIAL_PARTS) {
    // Sauter de page seulement s'il ne reste pas assez pour titre + petite image
    needPage(doc, 140, page);

    doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(9).text(`PARTIE ${part.id}`);
    doc.fillColor(NIGHT).font("Helvetica-Bold").fontSize(14).text(part.title, { width: CONTENT_W });
    doc.moveDown(0.35);
    mark(page);

    drawSmallImage(doc, part.image, page);

    for (const block of part.blocks) {
      writeBlock(doc, block, page);
    }
  }

  // Aller plus loin
  needPage(doc, 160, page);
  if (doc.y > MARGIN + 20) {
    // continue on same page if space
  }
  doc.moveDown(0.4);
  doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(9).text("ALLER PLUS LOIN");
  doc.fillColor(NIGHT).font("Helvetica-Bold").fontSize(14).text("Tu veux te lancer plus vite ?");
  doc.moveDown(0.35);
  mark(page);
  writeBlock(
    doc,
    {
      type: "p",
      text: "Ce guide te donne toute la méthode. Mais si tu veux gagner des mois et éviter les erreurs de débutant, je propose deux formules d'accompagnement :",
    },
    page
  );
  writeBlock(
    doc,
    {
      type: "tip",
      title: "Appel questions / réponses — 150 CHF",
      text: "Un appel dédié où tu poses toutes tes questions et où je te débloque sur ta situation précise.",
    },
    page
  );
  writeBlock(
    doc,
    {
      type: "tip",
      title: "Accompagnement complet",
      text: "Le pack complet, avec en plus mes contacts fournisseurs directs — machines et consommables aux meilleurs prix, ceux que j'utilise moi-même.",
    },
    page
  );
  writeBlock(
    doc,
    {
      type: "p",
      text: "Il existe aussi un guide dédié aux snacks, à combiner avec le café pour augmenter tes revenus sur chaque emplacement.",
    },
    page
  );
  doc.moveDown(0.8);
  doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(10).text("Derra Vending — Méthode Genève · Europe", {
    width: CONTENT_W,
    align: "center",
  });
  doc.fillColor(TEXT).font("Helvetica").fontSize(9).text("La distribution automatique, faite simplement.", {
    width: CONTENT_W,
    align: "center",
  });
  mark(page);
  drawFooter(doc, page.n);

  doc.end();
  await new Promise<void>((res, rej) => {
    stream.on("finish", () => res());
    stream.on("error", rej);
  });
  console.log(`✅ Ebook compact généré (${page.n} pages) : ${outPath}`);
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
