import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();

/** Fuentes TTF para ImageResponse (Satori no lee woff2). */
export async function ogFonts() {
  const font = (file: string) => readFile(path.join(root, "assets/fonts", file));
  const [cormorant, cormorantItalic, schibsted] = await Promise.all([
    font("cormorant-300.ttf"),
    font("cormorant-300-italic.ttf"),
    font("schibsted-400.ttf"),
  ]);
  return [
    { name: "Cormorant", data: cormorant, weight: 300 as const, style: "normal" as const },
    { name: "Cormorant", data: cormorantItalic, weight: 300 as const, style: "italic" as const },
    { name: "Schibsted Grotesk", data: schibsted, weight: 400 as const, style: "normal" as const },
  ];
}

/** Captura de public/ redimensionada a PNG en data URL (Satori no admite WebP). */
export async function shotDataUrl(publicPath: string, width: number) {
  const buf = await sharp(path.join(root, "public", publicPath)).resize({ width }).png().toBuffer();
  return `data:image/png;base64,${buf.toString("base64")}`;
}
