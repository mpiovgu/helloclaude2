"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createArticle(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const categoryId = formData.get("categoryId") as string;
  const published = formData.get("published") === "true";
  const tags = (formData.get("tags") as string || "").split(",").map(t => t.trim()).filter(Boolean);

  const slug = slugify(title) || title.replace(/\s+/g, "-").toLowerCase();

  const article = await prisma.article.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt || content.slice(0, 200),
      published,
      authorId: session.user.id,
      categoryId: categoryId || null,
      tags: {
        connectOrCreate: tags.map(tag => ({
          where: { slug: slugify(tag) || tag },
          create: { name: tag, slug: slugify(tag) || tag },
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/articles");
  redirect("/admin/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const categoryId = formData.get("categoryId") as string;
  const published = formData.get("published") === "true";
  const tags = (formData.get("tags") as string || "").split(",").map(t => t.trim()).filter(Boolean);

  await prisma.article.update({
    where: { id },
    data: {
      title,
      content,
      excerpt: excerpt || content.slice(0, 200),
      published,
      categoryId: categoryId || null,
      tags: {
        set: [],
        connectOrCreate: tags.map(tag => ({
          where: { slug: slugify(tag) || tag },
          create: { name: tag, slug: slugify(tag) || tag },
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/articles");
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "admin") throw new Error("Unauthorized");

  await prisma.article.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/admin/articles");
}
