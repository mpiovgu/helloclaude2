import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import { auth } from "@/lib/auth";

async function createCategory(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  if (!name) return;

  const slug = slugify(name) || name.replace(/\s+/g, "-").toLowerCase();
  await prisma.category.create({ data: { name, slug } });
  revalidatePath("/admin/categories");
}

async function deleteCategory(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">分类管理</h1>

      <form action={createCategory} className="flex gap-2 mb-6">
        <input
          name="name"
          type="text"
          required
          placeholder="新分类名称"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          添加
        </button>
      </form>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-md"
          >
            <div>
              <span className="font-medium">{cat.name}</span>
              <span className="ml-2 text-sm text-gray-500">({cat._count.articles} 篇文章)</span>
            </div>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={cat.id} />
              <button type="submit" className="text-red-600 hover:underline text-sm">
                删除
              </button>
            </form>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-gray-500 text-center py-4">暂无分类</p>
        )}
      </div>
    </div>
  );
}
