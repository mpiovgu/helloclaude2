import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: { where: { published: true } } } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">所有分类</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold">{cat.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{cat._count.articles} 篇文章</p>
          </Link>
        ))}
      </div>
      {categories.length === 0 && (
        <p className="text-center text-gray-500 py-12">暂无分类</p>
      )}
    </div>
  );
}
