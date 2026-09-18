import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dania-tactica.daniellopez1990.chatgpt.site"),
  title: "DanIA Táctica",
  description: "Pizarra de fútbol para preparar entrenamientos, dibujar movimientos y organizar tus sesiones. Adaptación independiente de Board por DanIA Studio.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "DanIA Táctica",
    description: "Tu pizarra de fútbol para preparar entrenamientos y organizar tus sesiones.",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "DanIA Táctica — Tu pizarra de fútbol" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DanIA Táctica",
    description: "Tu pizarra de fútbol para preparar entrenamientos y organizar tus sesiones.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/dania-mark.svg",
    shortcut: "/dania-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
