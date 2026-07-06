import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CommentSection } from "@/components/comment-section";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug, published: true },
  });
  if (!article) return {};
  return {
    title: `${article.title} - 我的博客`,
    description: article.excerpt || article.content.slice(0, 160),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug, published: true },
    include: {
      author: { select: { name: true } },
      category: true,
      tags: true,
      comments: {
        where: { approved: true },
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
      },
    },
  });

  if (!article) notFound();

  const serializedComments = article.comments.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
          {article.category && (
            <Link
              href={`/categories/${article.category.slug}`}
              className="text-blue-600 hover:underline"
            >
              {article.category.name}
            </Link>
          )}
          <span>{formatDate(article.createdAt)}</span>
          <span>· {article.author.name}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
        {article.tags.length > 0 && (
          <div className="flex gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/articles?tag=${tag.slug}`}
                className="text-sm px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.content}
        </ReactMarkdown>
      </div>

      <CommentSection articleId={article.id} initialComments={serializedComments} />
    </article>
  );
}
