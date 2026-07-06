import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-8">
      <aside className="w-48 shrink-0 hidden md:block">
        <nav className="sticky top-24 space-y-2">
          <Link href="/admin" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">
            仪表盘
          </Link>
          <Link href="/admin/articles" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            文章管理
          </Link>
          <Link href="/admin/categories" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            分类管理
          </Link>
          <Link href="/admin/comments" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            评论管理
          </Link>
        </nav>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
