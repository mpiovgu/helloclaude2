import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { deleteArticle } from "./actions";
import { formatDate } from "@/lib/utils";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          新建文章
        </Link>
      </div>

      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">标题</th>
              <th className="text-left px-4 py-3 text-sm font-medium hidden md:table-cell">分类</th>
              <th className="text-left px-4 py-3 text-sm font-medium hidden md:table-cell">日期</th>
              <th className="text-left px-4 py-3 text-sm font-medium">状态</th>
              <th className="text-right px-4 py-3 text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="px-4 py-3">{article.title}</td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                  {article.category?.name || "-"}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-sm">
                  {formatDate(article.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      article.published
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                    }`}
                  >
                    {article.published ? "已发布" : "草稿"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    编辑
                  </Link>
                  <form action={deleteArticle.bind(null, article.id)} className="inline">
                    <button
                      type="submit"
                      className="text-red-600 hover:underline text-sm"
                    >
                      删除
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  暂无文章，点击右上角创建第一篇
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
