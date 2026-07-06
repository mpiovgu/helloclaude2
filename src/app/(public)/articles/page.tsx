import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const perPage = 10;
  const q = params.q || "";
  const categorySlug = params.category || "";
  const tagSlug = params.tag || "";

  const where = {
    published: true,
    ...(q && {
      OR: [
        { title: { contains: q } },
        { content: { contains: q } },
      ],
    }),
    ...(categorySlug && { category: { slug: categorySlug } }),
    ...(tagSlug && { tags: { some: { slug: tagSlug } } }),
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { category: true, author: { select: { name: true } }, tags: true },
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">所有文章</h1>

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form className="flex-1 flex gap-2">
          <input
            name="q"
            type="text"
            defaultValue={q}
            placeholder="搜索文章..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
            搜索
          </button>
        </form>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/articles"
            className={`px-3 py-1 rounded-full text-sm border ${
              !categorySlug ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            全部
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/articles?category=${cat.slug}`}
              className={`px-3 py-1 rounded-full text-sm border ${
                categorySlug === cat.slug ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Articles list */}
      <div className="space-y-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="border-b border-gray-200 dark:border-gray-800 pb-6"
          >
            <div className="flex items-center gap-2 mb-1 text-sm text-gray-500">
              {article.category && (
                <span className="text-blue-600">{article.category.name}</span>
              )}
              <span>{formatDate(article.createdAt)}</span>
              <span>· {article.author.name}</span>
            </div>
            <Link href={`/articles/${article.slug}`}>
              <h2 className="text-xl font-semibold mb-2 hover:text-blue-600">
                {article.title}
              </h2>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
              {article.excerpt}
            </p>
            {article.tags.length > 0 && (
              <div className="flex gap-1">
                {article.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/articles?tag=${tag.slug}`}
                    className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {articles.length === 0 && (
        <p className="text-center text-gray-500 py-12">没有找到文章</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {page > 1 && (
            <Link
              href={`/articles?page=${page - 1}${q ? `&q=${q}` : ""}${categorySlug ? `&category=${categorySlug}` : ""}`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              上一页
            </Link>
          )}
          <span className="px-4 py-2 text-gray-500">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/articles?page=${page + 1}${q ? `&q=${q}` : ""}${categorySlug ? `&category=${categorySlug}` : ""}`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              下一页
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
