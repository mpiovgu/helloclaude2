"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  guestName: string | null;
  author: { name: string } | null;
  createdAt: string;
}

export function CommentSection({
  articleId,
  initialComments,
}: {
  articleId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        articleId,
        content: formData.get("content"),
        guestName: formData.get("guestName"),
      }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments([newComment, ...comments]);
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  return (
    <section className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
      <h2 className="text-xl font-bold mb-6">评论 ({comments.length})</h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3">
        <input
          name="guestName"
          type="text"
          placeholder="你的名字"
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="content"
          rows={3}
          required
          placeholder="写下你的评论..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
        >
          {loading ? "提交中..." : "提交评论"}
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">
                {comment.author?.name || comment.guestName || "匿名"}
              </span>
              <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
