import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
      },
    },
  });

  if (!category) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">分类：{category.name}</h1>
      <div className="space-y-6">
        {category.articles.map((article) => (
          <article key={article.id} className="border-b border-gray-200 dark:border-gray-800 pb-6">
            <div className="text-sm text-gray-500 mb-1">
              {formatDate(article.createdAt)} · {article.author.name}
            </div>
            <Link href={`/articles/${article.slug}`}>
              <h2 className="text-xl font-semibold hover:text-blue-600">{article.title}</h2>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{article.excerpt}</p>
          </article>
        ))}
      </div>
      {category.articles.length === 0 && (
        <p className="text-center text-gray-500 py-12">该分类下暂无文章</p>
      )}
    </div>
  );
}
