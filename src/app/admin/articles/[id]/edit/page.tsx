import { prisma } from "@/lib/prisma";
import { updateArticle } from "../../actions";
import { ArticleEditor } from "@/components/article-editor";
import { notFound } from "next/navigation";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: { tags: true },
  });

  if (!article) notFound();

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const boundUpdate = updateArticle.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">编辑文章</h1>
      <ArticleEditor
        action={boundUpdate}
        categories={categories}
        initialData={{
          title: article.title,
          content: article.content,
          excerpt: article.excerpt || "",
          categoryId: article.categoryId || "",
          published: article.published,
          tags: article.tags.map(t => t.name).join(", "),
        }}
      />
    </div>
  );
}
