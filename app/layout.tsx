import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZouuSafe",
  description: "Internet sécurisé pour les enfants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}