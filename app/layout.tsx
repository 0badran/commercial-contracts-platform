import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const noto_sans_arabic = Noto_Sans_Arabic({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "منصة العقود الإلكترونية",
  description: "منصة متكاملة لإدارة العقود والمدفوعات",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={noto_sans_arabic.className}>{children}</body>
    </html>
  );
}
