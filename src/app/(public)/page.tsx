import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { category: true, author: { select: { name: true } } },
  });

  return (
    <div>
      <section className="mb-12 text-center py-12">
        <h1 className="text-4xl font-bold mb-4">欢迎来到我的博客</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          分享技术、生活和思考
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">最新文章</h2>
          <Link href="/articles" className="text-blue-600 hover:underline">
            查看全部 →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <article
              key={article.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                {article.category && (
                  <Link
                    href={`/categories/${article.category.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {article.category.name}
                  </Link>
                )}
                <span>·</span>
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <Link href={`/articles/${article.slug}`}>
                <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">
                  {article.title}
                </h3>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="mt-3 text-sm text-gray-500">
                {article.author.name}
              </div>
            </article>
          ))}
        </div>

        {articles.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            暂无文章，请先在管理后台发布文章。
          </p>
        )}
      </section>
    </div>
  );
}
