import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maison — Thiết kế nội thất minh bạch",
  description:
    "Maison kết nối chủ nhà với đội ngũ thiết kế nội thất chuyên nghiệp. Minh bạch từ ý tưởng đến bàn giao.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.className} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
