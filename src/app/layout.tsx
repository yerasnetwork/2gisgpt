import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0b12",
};

export const metadata: Metadata = {
  title: "LocalAI — AI-поиск заведений в Казахстане",
  description:
    "Найди лучшие рестораны, кафе и барбершопы в Атырау, Астане и Алматы с помощью искусственного интеллекта. Спроси на естественном языке — получи топ рекомендации.",
  keywords: ["2GIS", "кафе", "рестораны", "Атырau", "Алматы", "Астана", "AI поиск", "Казахстан"],
  openGraph: {
    title: "LocalAI — Умный поиск заведений",
    description: "Найди лучшие места рядом с тобой — одним запросом на естественном языке.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
