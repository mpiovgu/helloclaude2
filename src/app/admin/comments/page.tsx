import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function deleteComment(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  await prisma.comment.delete({ where: { id } });
  revalidatePath("/admin/comments");
}

export default async function CommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { article: { select: { title: true, slug: true } }, author: { select: { name: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">评论管理</h1>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {comment.author?.name || comment.guestName || "匿名"}
                </span>
                {" 评论了 "}
                <span className="font-medium">{comment.article.title}</span>
              </div>
              <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
            <form action={deleteComment}>
              <input type="hidden" name="id" value={comment.id} />
              <button type="submit" className="text-red-600 hover:underline text-sm">
                删除
              </button>
            </form>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-8">暂无评论</p>
        )}
      </div>
    </div>
  );
}
