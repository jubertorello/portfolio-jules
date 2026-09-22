import type { Metadata, Viewport } from "next";
import { Cormorant, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import { DAY_END, DAY_START, THEME_STORAGE_KEY } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "by Jules — Desarrollo web freelance",
  description:
    "Soy Jules, desarrolladora freelance. Diseño y programo webs, tiendas, aplicaciones y automatizaciones a medida.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F1E9" },
    { media: "(prefers-color-scheme: dark)", color: "#1E1E1E" },
  ],
};

// Se ejecuta antes del primer pintado: tema elegido a mano → si no, según la hora local (día claro, noche oscuro).
const themeScript = `(function(){var d=document.documentElement;d.classList.add("js");var h=new Date().getHours(),t=h>=${DAY_START}&&h<${DAY_END}?"light":"dark";try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");if(s==="light"||s==="dark")t=s}catch(e){}d.setAttribute("data-theme",t)})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-theme="light"
      suppressHydrationWarning
      className={`${cormorant.variable} ${schibsted.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
