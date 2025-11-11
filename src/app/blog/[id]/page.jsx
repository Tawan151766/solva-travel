import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function getBlogById(id) {
  if (!id) {
    return null;
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    if (!blog || !blog.published) {
      return null;
    }

    return {
      id: blog.id,
      title: blog.title,
      content: blog.content ?? "",
      imageUrl: blog.imageUrl ?? null,
      authorName: blog.author
        ? `${blog.author.firstName ?? ""} ${blog.author.lastName ?? ""}`.trim() || null
        : null,
      createdAt: blog.createdAt?.toISOString() ?? null,
      updatedAt: blog.updatedAt?.toISOString() ?? null,
    };
  } catch (error) {
    console.error("Failed to load blog detail", error);
    return null;
  }
}

function formatDate(dateString) {
  if (!dateString) {
    return "\u2014";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.valueOf())) {
    return "\u2014";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

const detailFallbackImages = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
];

function getFallbackImage(id = "") {
  if (!id) {
    return detailFallbackImages[0];
  }

  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % detailFallbackImages.length;
  return detailFallbackImages[index];
}

export async function generateMetadata({ params }) {
  const blog = await prisma.blog.findFirst({
    where: { id: params.id, published: true },
    select: { title: true, content: true },
  });

  if (!blog) {
    return { title: "Blog not found" };
  }

  const plainDescription = blog.content
    ? blog.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 140)
    : "";

  return {
    title: blog.title,
    description: plainDescription || "Read the latest travel story on Solva Travel.",
  };
}

export default async function BlogDetailPage({ params }) {
  const blog = await getBlogById(params.id);

  if (!blog) {
    notFound();
  }

  const formattedDate = formatDate(blog.updatedAt ?? blog.createdAt);
  const authorLabel = blog.authorName ? `By ${blog.authorName}` : "Solva Travel editorial team";
  const heroImage = blog.imageUrl || getFallbackImage(blog.id);

  return (
    <div className="min-h-screen bg-[#f3f5fb] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
        {heroImage && (
          <div className="h-72 w-full overflow-hidden sm:h-96">
            <img
              src={heroImage}
              alt={blog.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="px-6 py-10 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#0f172a]/60">
            {authorLabel}
            {" \u00B7 "}
            {formattedDate}
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-[#0f172a] sm:text-4xl">
            {blog.title}
          </h1>

          <div className="mt-8 whitespace-pre-line rounded-2xl border border-black/5 bg-[#f9fafc] px-5 py-6 text-base leading-relaxed text-gray-700">
            {blog.content}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d2749]"
            >
              {"\u2190"} Back to latest articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
