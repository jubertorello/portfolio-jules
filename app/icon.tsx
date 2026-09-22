import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: «J» en Cormorant crema sobre el fondo oscuro, con el punto en el azul de acento. */
export default async function Icon() {
  return new ImageResponse(<Mark size={64} />, { ...size, fonts: await markFonts() });
}

/** Cormorant 600: a tamaño favicon el peso 300 de la web desaparece. */
export async function markFonts() {
  const data = await readFile(path.join(process.cwd(), "assets/fonts/cormorant-600.ttf"));
  return [{ name: "Cormorant", data, weight: 600 as const, style: "normal" as const }];
}

/** `rounded={false}` para apple-icon: iOS ya redondea las esquinas. */
export function Mark({ size, rounded = true }: { size: number; rounded?: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1E1E1E",
        borderRadius: rounded ? size * 0.22 : 0,
        color: "#F4F1E9",
        fontFamily: "Cormorant",
        fontSize: size * 1.02,
        fontWeight: 600,
        lineHeight: 1,
        paddingBottom: size * 0.1,
      }}
    >
      <span>J</span>
      <span style={{ color: "#7FC0DE" }}>.</span>
    </div>
  );
}
