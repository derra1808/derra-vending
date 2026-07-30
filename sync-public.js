const fs = require("fs");
const path = require("path");

const root = path.join(__dirname);
const publicDir = path.join(root, "public");
fs.mkdirSync(publicDir, { recursive: true });

let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
html = html
  .replace(/public\/brand\//g, "/brand/")
  .replace(/public\/gallery\//g, "/gallery/")
  .replace(/public\/images\//g, "/images/")
  .replace(/public\/qr\//g, "/qr/")
  .replace('href="styles.css"', 'href="/styles.css"')
  .replace('src="script.js"', 'src="/script.js"')
  .replace('src="social.js"', 'src="/social.js"')
  .replace('href="public/brand/logo.png"', 'href="/brand/logo.png"');

fs.writeFileSync(path.join(publicDir, "index.html"), html, "utf8");

for (const file of ["styles.css", "script.js", "social.js"]) {
  fs.copyFileSync(path.join(root, file), path.join(publicDir, file));
}

// Fix bg-logo path in public CSS
let css = fs.readFileSync(path.join(publicDir, "styles.css"), "utf8");
css = css.replace('url("public/brand/logo.png")', 'url("/brand/logo.png")');
fs.writeFileSync(path.join(publicDir, "styles.css"), css, "utf8");

console.log("Site synced to public/");
