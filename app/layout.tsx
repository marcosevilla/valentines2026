import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
