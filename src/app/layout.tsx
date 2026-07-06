import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { Header } from "@/components/header";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "我的博客",
  description: "一个使用 Next.js 构建的个人博客平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={geist.variable}>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen font-[family-name:var(--font-geist)]">
        <SessionProvider>
          <ThemeProvider>
            <Header />
            <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
            <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-gray-500 text-sm">
              © 2024 我的博客
            </footer>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
