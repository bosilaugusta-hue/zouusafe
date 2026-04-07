import "./globals.css";

export const metadata = {
  title: "ZouuSafe",
  description: "Explore internet en toute sécurité",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}