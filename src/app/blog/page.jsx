import { BlogHero } from "@/components/pages/blog/BlogHero";
import { BlogGrid } from "@/components/pages/blog/BlogGrid";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Blog Stories - Solva Travel",
  description:
    "Read honest stories and reviews from travellers who explored with Solva Travel. Discover tips, highlights, and inspiration for your next journey.",
  openGraph: {
    title: "Traveller Stories with Solva Travel",
    description: "Honest travel stories, highlights, and tips from the Solva Travel community.",
    type: "website",
  },
};

export const revalidate = 120;

async function getPublishedBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      include: {
        author: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      authorName: blog.author
        ? `${blog.author.firstName ?? ""} ${blog.author.lastName ?? ""}`.trim() || null
        : null,
      createdAt: blog.createdAt?.toISOString() ?? null,
    }));
  } catch (error) {
    console.error("Failed to load published blogs", error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getPublishedBlogs();
  const totalBlogs = blogs.length;
  const latestPublishedAt = totalBlogs > 0 ? blogs[0]?.createdAt ?? null : null;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-gradient-to-br from-black via-[#0a0804] to-black font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5 opacity-50" />

      <div className="layout-container relative flex h-full flex-col">
        <div className="flex flex-1 justify-center px-4 py-5 sm:px-6 lg:px-8">
          <div className="layout-content-container relative flex w-full max-w-6xl flex-col">
            <BlogHero />
            <BlogGrid
              blogs={blogs}
              totalBlogs={totalBlogs}
              latestPublishedAt={latestPublishedAt}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
