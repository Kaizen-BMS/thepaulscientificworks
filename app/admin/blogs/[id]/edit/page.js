"use client";

import { useEffect, useState, use } from "react";
import BlogForm from "@/components/admin/BlogForm";
import { Loader2 } from "lucide-react";

export default function EditBlogPage({ params }) {
  const resolvedParams = use(params);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/${resolvedParams.id}`);
        const data = await res.json();

        if (data.data) {
          setBlog(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-32 text-red-400">
        Blog not found
      </div>
    );
  }

  return <BlogForm mode="edit" initialData={blog} />;
}