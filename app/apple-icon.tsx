import { ImageResponse } from "next/og";
import { Mark, markFonts } from "./icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(<Mark size={180} rounded={false} />, { ...size, fonts: await markFonts() });
}
