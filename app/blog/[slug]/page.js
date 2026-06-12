import { getBlogs, getBlogBySlug } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Tag, ArrowLeft, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  try {
    const slug = decodeURIComponent(
      resolvedParams?.slug || ""
    ).toLowerCase().trim();

    const blog = getBlogBySlug(slug);

    if (!blog) {
      return {
        title: "Blog Not Found — Paul Scientific Works",
      };
    }

    return {
      title: blog.metaTitle || `${blog.title} — Paul Scientific Works`,
      description: blog.metaDescription || blog.excerpt || "",
      openGraph: {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.excerpt || "",
        ...(blog.image ? { images: [blog.image] } : {}),
      },
    };
  } catch {
    return {
      title: "Blog — Paul Scientific Works",
    };
  }
}

function formatDate(str) {
  if (!str) return "";

  try {
    return new Date(str).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return str;
  }
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;

  const rawSlug = decodeURIComponent(
    resolvedParams?.slug || ""
  ).toLowerCase().trim();

  const blog = getBlogBySlug(rawSlug);

  if (!blog) {
    notFound();
  }

  const allBlogs = getBlogs();

  const related = allBlogs
    .filter(
      (b) =>
        b.id !== blog.id &&
        b.category === blog.category
    )
    .slice(0, 3);

  const paragraphs = (blog.content || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-16">
      {/* Hero */}
      <div className="relative h-56 md:h-80 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
        {blog.image &&
          blog.image !== "/blogs/placeholder.jpg" && (
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover opacity-70"
              sizes="100vw"
              priority
            />
          )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 max-w-4xl mx-auto w-full">
          {blog.category && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-blue-600 rounded-full px-3 py-1 mb-3">
              <Tag className="w-2.5 h-2.5" />
              {blog.category}
            </span>
          )}

          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-3xl">
            {blog.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Meta */}
        <div className="flex items-center gap-5 mb-8 text-sm text-slate-500 dark:text-slate-400 pb-6 border-b border-slate-200 dark:border-slate-700 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(blog.createdAt)}
          </span>

          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {blog.author || "Admin"}
          </span>
        </div>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 font-medium border-l-4 border-blue-500 pl-5 italic">
            {blog.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="text-slate-700 dark:text-slate-300 text-base leading-relaxed space-y-5">
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Back */}
        <div className="mt-10">
          <Link href="/blog">
            <span className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </span>
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Related Articles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((rb) => (
                <Link
                  key={rb.id}
                  href={`/blog/${rb.slug}`}
                >
                  <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="relative h-32 bg-slate-100 dark:bg-slate-700">
                      <Image
                        src={
                          rb.image ||
                          "/blogs/placeholder.jpg"
                        }
                        alt={rb.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="300px"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-3">
                      <p className="text-xs text-slate-500 mb-1">
                        {formatDate(rb.createdAt)}
                      </p>

                      <h3 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {rb.title}
                      </h3>

                      <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-2">
                        Read
                        <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}