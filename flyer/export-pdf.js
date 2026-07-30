const path = require("path");
const puppeteer = require("puppeteer");

(async () => {
  const dir = __dirname;
  const pdfPath = path.join(dir, "Derra-Vending-Gaggia-G100.pdf");
  const url = "http://127.0.0.1:8765/index.html";

  const browser = await puppeteer.launch({
    headless: true,
    protocolTimeout: 180000,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
  await page.emulateMediaType("print");
  await page.pdf({
    path: pdfPath,
    format: "A5",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });
  await browser.close();
  console.log("PDF créé :", pdfPath);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
