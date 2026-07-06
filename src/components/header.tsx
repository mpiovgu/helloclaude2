"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
          我的博客
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/articles" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            文章
          </Link>
          <Link href="/categories" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            分类
          </Link>
          {session?.user?.role === "admin" && (
            <Link href="/admin" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              管理
            </Link>
          )}
          {session ? (
            <button
              onClick={() => signOut()}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              退出
            </button>
          ) : (
            <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              登录
            </Link>
          )}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="切换主题"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="菜单"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-3">
          <Link href="/articles" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300">文章</Link>
          <Link href="/categories" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300">分类</Link>
          {session?.user?.role === "admin" && (
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300">管理</Link>
          )}
          {session ? (
            <button onClick={() => signOut()} className="text-left text-gray-600 dark:text-gray-300">退出</button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300">登录</Link>
          )}
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="text-left text-gray-600 dark:text-gray-300">
            {theme === "dark" ? "切换到亮色" : "切换到暗色"}
          </button>
        </nav>
      )}
    </header>
  );
}
