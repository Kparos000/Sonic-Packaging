import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Manrope only, approved hierarchy — Brand Guidelines v2.0. Loaded from the
// actual brand font files (src/fonts/, sourced from the brand guide
// project) via next/font/local rather than next/font/google, so the build
// never depends on reaching Google Fonts and always uses exactly the
// approved files.
const manrope = localFont({
  src: [
    { path: "../fonts/Manrope-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Manrope-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Manrope-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/Manrope-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/Manrope-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sonic Packaging",
    template: "%s | Sonic Packaging",
  },
  description:
    "Sonic Packaging engineers the packaging that moves African industry — from Sonic Plastics' rigid-plastics manufacturing in Benin City to a Pan-African packaging platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
