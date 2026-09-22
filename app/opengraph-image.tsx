import { ImageResponse } from "next/og";
import { ogFonts, shotDataUrl } from "@/lib/og";

export const alt = "by Jules — Portfolio de desarrollo web freelance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#F4F1E9";
const FG = "#1E1E1E";
const MUTED = "#8C8578";
const ACCENT = "#3E7FA6";
const SHADOW = "0 1px 2px rgba(27,25,23,0.06), 0 30px 50px -24px rgba(27,25,23,0.45)";

export default async function OpengraphImage() {
  const [fonts, ais, kish, faro] = await Promise.all([
    ogFonts(),
    shotDataUrl("/screenshots/all-in-sports.webp", 720),
    shotDataUrl("/screenshots/kish-and-go.webp", 660),
    shotDataUrl("/screenshots/faro-app-hoy.webp", 300),
  ]);

  const shot = (src: string, style: React.CSSProperties) => (
    <img
      src={src}
      alt=""
      style={{ position: "absolute", objectFit: "cover", objectPosition: "top", borderRadius: 8, boxShadow: SHADOW, ...style }}
    />
  );

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: BG, color: FG }}>
        {shot(ais, { left: 680, top: 64, width: 360, height: 203 })}
        {shot(kish, { left: 640, top: 336, width: 330, height: 186 })}
        {shot(faro, { left: 1000, top: 170, width: 146, height: 316 })}

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 72px", width: 640 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{ fontFamily: "Cormorant", fontSize: 40, letterSpacing: "-0.01em" }}>by Jules</span>
            <span style={{ fontFamily: "Schibsted Grotesk", fontSize: 18, letterSpacing: 1, textTransform: "uppercase", color: MUTED }}>
              Desarrollo web freelance
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "Cormorant", fontSize: 150, lineHeight: 0.88, letterSpacing: "-0.04em" }}>Mi</span>
            <span style={{ fontFamily: "Cormorant", fontSize: 150, lineHeight: 0.88, letterSpacing: "-0.04em" }}>Portfolio</span>
            <div style={{ display: "flex", flexDirection: "column", fontFamily: "Cormorant", fontSize: 36, lineHeight: 1.2, marginTop: 28, letterSpacing: "-0.01em" }}>
              <span>Webs, tiendas, apps y</span>
              <div style={{ display: "flex" }}>
                <span>automatizaciones&nbsp;</span>
                <span style={{ fontStyle: "italic", color: ACCENT }}>a medida</span>
                <span>.</span>
              </div>
            </div>
          </div>

          <span style={{ fontFamily: "Schibsted Grotesk", fontSize: 18, letterSpacing: 1, textTransform: "uppercase", color: MUTED }}>
            Webs · Tiendas · Apps · Invitaciones
          </span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
