"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface Category {
  id: string;
  name: string;
}

interface ArticleEditorProps {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  initialData?: {
    title: string;
    content: string;
    excerpt: string;
    categoryId: string;
    published: boolean;
    tags: string;
  };
}

export function ArticleEditor({ action, categories, initialData }: ArticleEditorProps) {
  const [content, setContent] = useState(initialData?.content || "");

  return (
    <form action={action} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">标题</label>
        <input
          name="title"
          type="text"
          required
          defaultValue={initialData?.title}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">摘要</label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={initialData?.excerpt}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="留空将自动截取内容前200字"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">分类</label>
          <select
            name="categoryId"
            defaultValue={initialData?.categoryId}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">无分类</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">标签（逗号分隔）</label>
          <input
            name="tags"
            type="text"
            defaultValue={initialData?.tags}
            placeholder="例如: Next.js, React, 教程"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">内容 (Markdown)</label>
        <div data-color-mode="auto">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || "")}
            height={400}
          />
        </div>
        <input type="hidden" name="content" value={content} />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="published"
            value="true"
            defaultChecked={initialData?.published}
            className="rounded"
          />
          <span className="text-sm">立即发布</span>
        </label>
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
      >
        保存
      </button>
    </form>
  );
}
