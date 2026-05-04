/**
 * Markdown 教材を PDF に変換する。
 *
 * - materials/*.md を materials/pdf/*.pdf に変換
 * - 黒×ゴールドのブランドデザインを適用 (LP と統一感)
 * - 表紙 + 本文 + ヘッダー/フッター付き
 * - Puppeteer で印刷品質の PDF 出力
 *
 * Run: node scripts/distribution/generate_pdfs.mjs
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, "..", "..");
const MATERIALS_DIR = join(ROOT, "materials");
const PDF_DIR = join(MATERIALS_DIR, "pdf");
const PUPPETEER_PATH = join(ROOT, "node_modules", "puppeteer");

if (!existsSync(PDF_DIR)) mkdirSync(PDF_DIR, { recursive: true });

// ─── Markdown -> HTML (minimal converter) ───
// Use marked from npm if installed, otherwise lazy-load
let marked;
try {
  ({ marked } = await import("marked"));
} catch {
  console.error("ERROR: 'marked' is not installed. Run: npm install marked puppeteer");
  process.exit(1);
}

let puppeteer;
try {
  puppeteer = (await import("puppeteer")).default;
} catch {
  console.error("ERROR: 'puppeteer' is not installed. Run: npm install puppeteer");
  process.exit(1);
}

// ─── HTML テンプレート (印刷用 CSS) ───
function makeHtml(title, contentHtml) {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<title>${title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Noto+Serif+JP:wght@400;700;900&family=JetBrains+Mono:wght@400;600&display=swap');

  :root {
    --bg: #ffffff;
    --bg-dark: #0a0a0f;
    --surface: #f5f5f0;
    --primary: #c9a84c;
    --primary-light: #e8c96a;
    --text-main: #1a1a1f;
    --text-muted: #5a5a6a;
    --border: #d8d4c4;
    --accent: #c9a84c;
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    padding: 0;
    font-family: "Noto Sans JP", sans-serif;
    color: var(--text-main);
    background: var(--bg);
    line-height: 1.85;
    font-size: 11pt;
  }

  /* ── 表紙 ── */
  .cover {
    page-break-after: always;
    height: 297mm;
    background: var(--bg-dark);
    color: #f0f0f0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 40mm 20mm;
    position: relative;
    overflow: hidden;
  }
  .cover::before {
    content: "";
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(201, 168, 76, 0.25) 0%, transparent 60%);
    pointer-events: none;
  }
  .cover .brand-bar {
    position: absolute;
    top: 30mm;
    left: 0;
    right: 0;
    text-align: center;
    color: var(--primary-light);
    font-family: "Noto Serif JP", serif;
    font-weight: 700;
    font-size: 14pt;
    letter-spacing: 0.3em;
    z-index: 2;
  }
  .cover h1 {
    font-family: "Noto Serif JP", serif;
    font-weight: 900;
    font-size: 36pt;
    margin: 0 0 20mm 0;
    line-height: 1.3;
    letter-spacing: 0.04em;
    z-index: 2;
    background: linear-gradient(180deg, #f0f0f0 0%, var(--primary-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .cover .subtitle {
    color: #c9c9d8;
    font-size: 14pt;
    font-weight: 500;
    margin-bottom: 30mm;
    z-index: 2;
  }
  .cover .divider {
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--primary), transparent);
    margin: 0 auto 20mm;
    z-index: 2;
  }
  .cover .footer {
    position: absolute;
    bottom: 30mm;
    left: 0;
    right: 0;
    text-align: center;
    color: var(--text-muted);
    font-size: 10pt;
    letter-spacing: 0.2em;
    z-index: 2;
  }

  /* ── 本文 ── */
  .content {
    padding: 25mm 22mm 30mm 22mm;
  }

  h1 {
    font-family: "Noto Serif JP", serif;
    font-weight: 900;
    font-size: 22pt;
    color: var(--text-main);
    margin: 0 0 8mm 0;
    padding-bottom: 4mm;
    border-bottom: 2px solid var(--primary);
    page-break-after: avoid;
  }
  h2 {
    font-family: "Noto Serif JP", serif;
    font-weight: 700;
    font-size: 16pt;
    color: var(--text-main);
    margin: 12mm 0 5mm 0;
    padding-left: 4mm;
    border-left: 4px solid var(--primary);
    page-break-after: avoid;
  }
  h3 {
    font-family: "Noto Serif JP", serif;
    font-weight: 700;
    font-size: 13pt;
    color: var(--accent);
    margin: 8mm 0 3mm 0;
    page-break-after: avoid;
  }
  h4 {
    font-family: "Noto Sans JP", sans-serif;
    font-weight: 700;
    font-size: 11pt;
    margin: 6mm 0 2mm 0;
    color: var(--text-main);
    page-break-after: avoid;
  }

  p, li {
    color: var(--text-main);
    font-size: 10.5pt;
  }
  ul, ol {
    padding-left: 6mm;
    margin: 3mm 0;
  }
  li {
    margin-bottom: 1mm;
  }

  strong {
    color: var(--accent);
    font-weight: 700;
  }
  em {
    color: var(--text-muted);
    font-style: italic;
  }

  blockquote {
    margin: 4mm 0;
    padding: 4mm 6mm;
    background: var(--surface);
    border-left: 4px solid var(--primary);
    color: var(--text-main);
    font-style: italic;
    page-break-inside: avoid;
  }
  blockquote p { margin: 1mm 0; }

  code {
    font-family: "JetBrains Mono", monospace;
    background: rgba(201, 168, 76, 0.12);
    color: #8a6f1a;
    padding: 0.5mm 1.5mm;
    border-radius: 1mm;
    font-size: 9.5pt;
  }
  pre {
    font-family: "JetBrains Mono", monospace;
    background: var(--bg-dark);
    color: #e8c96a;
    padding: 4mm 5mm;
    border-radius: 2mm;
    font-size: 9pt;
    line-height: 1.5;
    overflow-x: auto;
    page-break-inside: avoid;
    margin: 3mm 0;
  }
  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 4mm 0;
    page-break-inside: avoid;
    font-size: 9.5pt;
  }
  th {
    background: var(--bg-dark);
    color: var(--primary-light);
    font-weight: 700;
    text-align: left;
    padding: 2mm 3mm;
    border: 1px solid var(--border);
    font-family: "Noto Sans JP", sans-serif;
  }
  td {
    padding: 2mm 3mm;
    border: 1px solid var(--border);
    vertical-align: top;
  }
  tr:nth-child(even) td {
    background: var(--surface);
  }

  hr {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    margin: 8mm 0;
  }

  a {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px dotted var(--accent);
  }

  /* ── ページ区切り ── */
  h1 { page-break-before: auto; }
  .page-break { page-break-after: always; }

  /* 印刷時にコンテナ調整 */
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>
  <div class="cover">
    <div class="brand-bar">A I &nbsp;&nbsp; B U I L D E R S &nbsp;&nbsp; L A B</div>
    <h1>${title}</h1>
    <div class="divider"></div>
    <div class="subtitle">教材 — ${title}</div>
    <div class="footer">CLAUDE CODE で作る、AI 個人開発のすべて</div>
  </div>
  <div class="content">
    ${contentHtml}
  </div>
</body>
</html>`;
}

// ─── 表紙用タイトル抽出 (#見出し から) ───
function extractTitle(md, fallback) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

// ─── PDF レンダリング (Puppeteer) ───
async function renderPdf(htmlContent, outputPath) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.emulateMediaType("print");
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      displayHeaderFooter: false,
    });
  } finally {
    await browser.close();
  }
}

// ─── メイン ───
async function main() {
  // Configure marked
  marked.setOptions({
    gfm: true,
    breaks: false,
    headerIds: false,
    mangle: false,
  });

  const mdFiles = readdirSync(MATERIALS_DIR).filter((f) => f.endsWith(".md"));
  if (mdFiles.length === 0) {
    console.error(`No .md files in ${MATERIALS_DIR}`);
    process.exit(1);
  }

  console.log(`Found ${mdFiles.length} markdown files. Generating PDFs...`);

  for (const fname of mdFiles) {
    const mdPath = join(MATERIALS_DIR, fname);
    const md = readFileSync(mdPath, "utf-8");
    const baseName = basename(fname, ".md");
    const title = extractTitle(md, baseName);

    // README.md → "00-README.pdf" でソート安定化
    const pdfName = baseName === "README" ? "00-README.pdf" : `${baseName}.pdf`;
    const pdfPath = join(PDF_DIR, pdfName);

    // Markdown -> HTML (フロントマター除去)
    const cleanMd = md.replace(/^---[\s\S]*?---\s*/m, "");
    // 最初のH1は表紙に出すので本文からは除く
    const bodyMd = cleanMd.replace(/^#\s+.+\n/m, "");

    const contentHtml = marked.parse(bodyMd);
    const html = makeHtml(title, contentHtml);

    process.stdout.write(`  ${fname} -> ${pdfName} ... `);
    await renderPdf(html, pdfPath);
    console.log("OK");
  }

  console.log(`\nDone. PDFs in: ${PDF_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
