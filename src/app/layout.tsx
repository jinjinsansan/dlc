import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Builders Lab | 競馬予想AIを作った私が教えるAI個人開発者養成コミュニティ",
  description:
    "ノーコードで本格競馬予想AIを作った実績者が教える、AI個人開発者養成コミュニティ。題材は競馬AIですが、身につくのは『何でも作れる力』です。10年前には不可能だった。今日から、あなたにもできる。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
