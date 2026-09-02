import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AmbientField } from "@/components/AmbientField";
import { AmbientVideoGuard } from "@/components/AmbientVideoGuard";
import { ScrollRail, StickyCta } from "@/components/motion";
import { ThemePreset } from "@/components/ThemePreset";
import { MOTION_BOOTSTRAP } from "@/lib/motion";
import { THEME_BOOTSTRAP } from "@/lib/theme";
import { site } from "@/content/viart";

/**
 * One typeface.
 *
 * There was a second — a bold italic display serif, for the accent phrase
 * at the end of each heading. It went: two faces arguing inside one
 * sentence is the loudest thing a heading can do and the least meaningful,
 * and dropping it takes a whole font request off the page as well.
 * Manrope carries Cyrillic and holds up at 800, which is all the site asks
 * of it.
 */
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: `${site.tagline} в ${site.city}. ${site.address}. ${site.hours}. Рейтинг 5,0 на Яндекс Картах.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={manrope.variable}>
      <head>
        {/* Picks the colour preset out of the URL before first paint, so
            the alternative palette never arrives as a flash of the
            default one. See lib/theme.ts. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        {/* Arms the reveal system before first paint — and disarms it again
            if hydration never happens. See lib/motion.ts. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOTSTRAP }} />
      </head>
      <body className="font-sans">
        {/*
          The ambient field is the page's ground, not an ornament on top of
          it: it is fixed behind everything, and every band above is
          translucent so the same violet drift runs the whole length of the
          site. `main` and the chrome only need to claim a layer above it.
        */}
        <AmbientField />
        {/* Unloads the hero's ambient footage on viewports that never show
            it. Renders nothing; see the component. */}
        <AmbientVideoGuard />
        <Header />
        <ScrollRail />
        <main className="relative z-[1]">{children}</main>
        <Footer />
        <StickyCta href={site.booking} label="Записаться" />
        {/* Nothing at all unless the alternative preset is on. */}
        <ThemePreset />
      </body>
    </html>
  );
}
