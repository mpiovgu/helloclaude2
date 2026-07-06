import { prisma } from "@/lib/prisma";
import { createArticle } from "../actions";
import { ArticleEditor } from "@/components/article-editor";

export default async function NewArticlePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">新建文章</h1>
      <ArticleEditor action={createArticle} categories={categories} />
    </div>
  );
}
