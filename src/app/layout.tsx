import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dlogic Academy | AI個人開発者養成コミュニティ",
  description:
    "ノーコードで本格競馬AIを作った実績者が教える、AI個人開発者養成コミュニティ。10年前には不可能だった。今日から、あなたにもできる。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
