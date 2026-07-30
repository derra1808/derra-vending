const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const sharp = require("sharp");

const SITE_URL = "https://derra-vending.vercel.app";
const MACHINE_URL = SITE_URL + "/m/cynara-rollier";
const ORANGE = "#e8742c";
const INK = "#1a1a1a";
const OUT_DIR = path.join(__dirname, "..", "public", "qr");
const LOGO = path.join(__dirname, "..", "public", "brand", "logo.png");

async function makeQrBuffer(url, size) {
  return QRCode.toBuffer(url, {
    errorCorrectionLevel: "H",
    type: "png",
    width: size,
    margin: 2,
    color: { dark: INK, light: "#ffffff" },
  });
}

async function addLogoCenter(qrBuffer, qrSize) {
  const logoSize = Math.round(qrSize * 0.22);
  const pad = Math.round(logoSize * 0.12);
  const box = logoSize + pad * 2;

  const logo = await sharp(LOGO)
    .resize(logoSize, logoSize, { fit: "contain", background: "#ffffff" })
    .png()
    .toBuffer();

  const whiteBox = await sharp({
    create: {
      width: box,
      height: box,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .png()
    .composite([{ input: logo, top: pad, left: pad }])
    .png()
    .toBuffer();

  const left = Math.round((qrSize - box) / 2);
  return sharp(qrBuffer).composite([{ input: whiteBox, top: left, left }]).png().toBuffer();
}

async function makeSitePoster(qrWithLogo) {
  const w = 1200;
  const h = 1600;
  const qrSize = 720;

  const qrResized = await sharp(qrWithLogo).resize(qrSize, qrSize).png().toBuffer();
  const logoHeader = await sharp(LOGO).resize(180, 180, { fit: "contain" }).png().toBuffer();

  const svgText = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ffffff"/>
      <rect x="0" y="0" width="${w}" height="14" fill="${ORANGE}"/>
      <rect x="0" y="${h - 14}" width="${w}" height="14" fill="${ORANGE}"/>
      <text x="600" y="340" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" fill="${INK}">Derra Vending</text>
      <text x="600" y="400" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#666">Scannez pour visiter notre site</text>
      <text x="600" y="1280" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#666">derra-vending.vercel.app</text>
      <text x="600" y="1330" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="${ORANGE}">Installation gratuite · Genève &amp; Suisse romande</text>
      <text x="600" y="1380" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#888">+41 79 757 08 97 · derra_vending@hotmail.com</text>
    </svg>`;

  const base = await sharp(Buffer.from(svgText)).png().toBuffer();

  return sharp(base)
    .composite([
      { input: logoHeader, top: 80, left: Math.round((w - 180) / 2) },
      { input: qrResized, top: 480, left: Math.round((w - qrSize) / 2) },
    ])
    .png()
    .toBuffer();
}

async function makeSurveyMachineSticker(qrWithLogo) {
  const w = 900;
  const h = 1200;
  const qrSize = 520;

  const qrResized = await sharp(qrWithLogo).resize(qrSize, qrSize).png().toBuffer();
  const logoHeader = await sharp(LOGO).resize(100, 100, { fit: "contain" }).png().toBuffer();

  const svgText = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ffffff"/>
      <rect x="0" y="0" width="${w}" height="12" fill="${ORANGE}"/>
      <rect x="0" y="${h - 12}" width="${w}" height="12" fill="${ORANGE}"/>
      <text x="450" y="200" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="800" fill="${INK}">SCANNEZ ICI</text>
      <text x="450" y="260" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="${ORANGE}">Votre avis compte !</text>
      <text x="450" y="310" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#444">Dites-nous quel sandwich vous</text>
      <text x="450" y="345" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#444">préférez dans ce distributeur</text>
      <text x="450" y="1000" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#666">Thon · Jambon · Saumon</text>
      <text x="450" y="1040" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="${INK}">Cynara — Chantier Rollier</text>
      <text x="450" y="1080" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#888">Derra Vending · 30 secondes</text>
    </svg>`;

  const base = await sharp(Buffer.from(svgText)).png().toBuffer();

  return sharp(base)
    .composite([
      { input: logoHeader, top: 50, left: Math.round((w - 100) / 2) },
      { input: qrResized, top: 400, left: Math.round((w - qrSize) / 2) },
    ])
    .png()
    .toBuffer();
}

async function makeSiteMachineSticker(qrWithLogo) {
  const w = 900;
  const h = 1200;
  const qrSize = 520;

  const qrResized = await sharp(qrWithLogo).resize(qrSize, qrSize).png().toBuffer();
  const logoHeader = await sharp(LOGO).resize(100, 100, { fit: "contain" }).png().toBuffer();

  const svgText = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ffffff"/>
      <rect x="0" y="0" width="${w}" height="12" fill="${ORANGE}"/>
      <rect x="0" y="${h - 12}" width="${w}" height="12" fill="${ORANGE}"/>
      <text x="450" y="195" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="800" fill="${INK}">SCANNEZ ICI</text>
      <text x="450" y="250" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="${ORANGE}">Derra Vending</text>
      <text x="450" y="300" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#444">Découvrez nos services vending</text>
      <text x="450" y="335" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#444">Installation gratuite · Genève</text>
      <text x="450" y="1000" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#666">Commerces &amp; chantiers BTP</text>
      <text x="450" y="1040" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="${INK}">derra-vending.vercel.app</text>
      <text x="450" y="1080" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#888">+41 79 757 08 97</text>
    </svg>`;

  const base = await sharp(Buffer.from(svgText)).png().toBuffer();

  return sharp(base)
    .composite([
      { input: logoHeader, top: 50, left: Math.round((w - 100) / 2) },
      { input: qrResized, top: 400, left: Math.round((w - qrSize) / 2) },
    ])
    .png()
    .toBuffer();
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const siteRaw = await makeQrBuffer(SITE_URL, 1000);
  const siteQr = await addLogoCenter(siteRaw, 1000);
  const sitePoster = await makeSitePoster(siteQr);
  const siteSticker = await makeSiteMachineSticker(siteQr);

  const machineRaw = await makeQrBuffer(MACHINE_URL, 1000);
  const machineQr = await addLogoCenter(machineRaw, 1000);
  const machineSticker = await makeSurveyMachineSticker(machineQr);

  fs.writeFileSync(path.join(OUT_DIR, "derra-vending-qr.png"), siteQr);
  fs.writeFileSync(path.join(OUT_DIR, "derra-vending-qr-poster.png"), sitePoster);
  fs.writeFileSync(path.join(OUT_DIR, "site-machine-autocollant.png"), siteSticker);
  fs.writeFileSync(path.join(OUT_DIR, "sondage-machine-autocollant.png"), machineSticker);

  console.log("QR codes générés :");
  console.log("  - site-machine-autocollant.png (site → à coller sur distributeur)");
  console.log("  - sondage-machine-autocollant.png (sondage → à coller sur distributeur)");
  console.log("  - derra-vending-qr.png (site → réseaux / WhatsApp)");
  console.log("  Hub : " + SITE_URL + "/qr/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
