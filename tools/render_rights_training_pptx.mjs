import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "output");
const PPTX_PATH = path.join(OUT_DIR, "성인_발달장애인_인권교육_예습복습_진행자료.pptx");
const RENDER_DIR = path.join(OUT_DIR, "rights_training_pptx_render");
const MONTAGE_PATH = path.join(OUT_DIR, "성인_발달장애인_인권교육_예습복습_진행자료_pptx_render_montage.png");
const TOOL_PATH =
  process.env.ARTIFACT_TOOL_PATH ||
  "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const { PresentationFile } = await import(TOOL_PATH);

fs.mkdirSync(RENDER_DIR, { recursive: true });

const bytes = fs.readFileSync(PPTX_PATH);
const presentation = await PresentationFile.importPptx(bytes);
const previewPaths = [];

for (let index = 0; index < presentation.slides.count; index += 1) {
  const slide = presentation.slides.getItem(index);
  const blob = await slide.export({ format: "png" });
  const output = path.join(RENDER_DIR, `slide-${String(index + 1).padStart(2, "0")}.png`);
  fs.writeFileSync(output, Buffer.from(await blob.arrayBuffer()));
  previewPaths.push(output);
}

const thumbs = await Promise.all(
  previewPaths.map((file) =>
    sharp(file)
      .resize({ width: 320, height: 180, fit: "cover" })
      .extend({ top: 0, left: 0, right: 0, bottom: 28, background: "#FFFFFF" })
      .png()
      .toBuffer(),
  ),
);

const columns = 4;
const rows = Math.ceil(thumbs.length / columns);
await sharp({
  create: {
    width: columns * 330,
    height: rows * 218,
    channels: 4,
    background: "#F7FBF8",
  },
})
  .composite(
    thumbs.map((input, i) => ({
      input,
      left: (i % columns) * 330,
      top: Math.floor(i / columns) * 218,
    })),
  )
  .png()
  .toFile(MONTAGE_PATH);

console.log(
  JSON.stringify(
    {
      pptx: PPTX_PATH,
      renderDir: RENDER_DIR,
      montage: MONTAGE_PATH,
      slides: presentation.slides.count,
    },
    null,
    2,
  ),
);
