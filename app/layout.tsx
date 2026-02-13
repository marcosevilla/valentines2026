import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistPixelSquare } from "geist/font/pixel";
import { Playfair_Display } from "next/font/google";
import { Agentation } from "agentation";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Scream Queens: Six Degrees",
  description: "Connect the scream queens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistPixelSquare.variable} ${playfair.variable}`}>
      <body className="min-h-dvh font-sans font-semibold">
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
