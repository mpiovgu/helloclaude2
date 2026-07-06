import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@blog.com" },
    update: {},
    create: {
      email: "admin@blog.com",
      name: "管理员",
      password: hashedPassword,
      role: "admin",
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "tech" },
      update: {},
      create: { name: "技术", slug: "tech" },
    }),
    prisma.category.upsert({
      where: { slug: "life" },
      update: {},
      create: { name: "生活", slug: "life" },
    }),
    prisma.category.upsert({
      where: { slug: "thoughts" },
      update: {},
      create: { name: "随想", slug: "thoughts" },
    }),
  ]);

  await prisma.article.upsert({
    where: { slug: "hello-world" },
    update: {},
    create: {
      title: "你好，世界！",
      slug: "hello-world",
      content: `# 你好，世界！

这是我的第一篇博客文章。

## 关于这个博客

这个博客使用以下技术构建：

- **Next.js 15** - React 全栈框架
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Prisma** - 现代数据库 ORM
- **SQLite** - 轻量级数据库

## 代码示例

\`\`\`typescript
function hello(name: string) {
  console.log(\`Hello, \${name}!\`);
}

hello("世界");
\`\`\`

## 下一步计划

1. 写更多技术文章
2. 分享学习心得
3. 记录生活点滴

感谢阅读！`,
      excerpt: "这是我的第一篇博客文章，介绍了这个博客使用的技术栈。",
      published: true,
      authorId: admin.id,
      categoryId: categories[0].id,
      tags: {
        connectOrCreate: [
          { where: { slug: "nextjs" }, create: { name: "Next.js", slug: "nextjs" } },
          { where: { slug: "react" }, create: { name: "React", slug: "react" } },
        ],
      },
    },
  });

  await prisma.article.upsert({
    where: { slug: "learning-typescript" },
    update: {},
    create: {
      title: "TypeScript 学习笔记",
      slug: "learning-typescript",
      content: `# TypeScript 学习笔记

TypeScript 是 JavaScript 的超集，添加了类型系统。

## 基本类型

\`\`\`typescript
let name: string = "张三";
let age: number = 25;
let isStudent: boolean = true;
let hobbies: string[] = ["阅读", "编程"];
\`\`\`

## 接口

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email?: string;
}
\`\`\`

## 泛型

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

TypeScript 让代码更安全、更易维护。`,
      excerpt: "TypeScript 是 JavaScript 的超集，本文记录了学习 TypeScript 的一些关键概念。",
      published: true,
      authorId: admin.id,
      categoryId: categories[0].id,
      tags: {
        connectOrCreate: [
          { where: { slug: "typescript" }, create: { name: "TypeScript", slug: "typescript" } },
          { where: { slug: "tutorial" }, create: { name: "教程", slug: "tutorial" } },
        ],
      },
    },
  });

  console.log("Seed data created successfully!");
  console.log("Admin account: admin@blog.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
