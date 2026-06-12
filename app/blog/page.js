import { getBlogs } from "@/lib/db";
import BlogPageClient from "./BlogPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Blog & Resources — Paul Scientific Works",
  description: "Insights, updates and resources for scientific education and healthcare.",
};

export default function BlogPage() {
  const blogs = [...getBlogs()].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
  return <BlogPageClient blogs={blogs} />;
}