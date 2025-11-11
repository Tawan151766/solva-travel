import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Travel Blog - Popular Articles",
  description:
    "Fresh field notes, planning ideas, and conservation stories collected from our travel community blog.",
};

export const revalidate = 120;

const fallbackArticles = [
  {
    id: "placeholder-1",
    title: "Guardians of the Pride: The Urgency of Lion Conservation Efforts",
    content:
      "Step onto the savannah and learn how local guides protect Africa's majestic cats while restoring habitats for future generations.",
    imageUrl:
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1400&q=80",
    tagLabel: "Africa",
  },
  {
    id: "placeholder-2",
    title: "Unveiling the Enigmatic World of Giant Pandas",
    content:
      "Walk through misty bamboo forests in Sichuan, meet dedicated researchers, and see how eco-tourism supports panda conservation.",
    imageUrl:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80",
    tagLabel: "China",
  },
  {
    id: "placeholder-3",
    title: "Protecting the Unique and Threatened Seas",
    content:
      "Sail Indonesia's remote archipelagos while supporting reef-safe practices, local marine crews, and coral restoration.",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    tagLabel: "Ocean",
  },
  {
    id: "placeholder-4",
    title: "Exploring the Fascinating Realm of Birds",
    content:
      "Glide above cloud forests in Central America and witness rare species alongside expert naturalists.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    tagLabel: "Birdwatching",
  },
];

const PAGE_SIZE = 4;

const clampStyle = (lines) => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: lines,
  overflow: "hidden",
});

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
      imageUrl: blog.imageUrl,
      createdAt: blog.createdAt?.toISOString() ?? null,
      authorName: blog.author
        ? `${blog.author.firstName ?? ""} ${blog.author.lastName ?? ""}`.trim() || null
        : null,
    }));
  } catch (error) {
    console.error("Unable to load blog articles", error);
    return [];
  }
}

function stripHtml(text = "") {
  return text.replace(/<[^>]*>/g, " ");
}

function formatDateLabel(dateString) {
  if (!dateString) {
    return "\u2014";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.valueOf())) {
    return "\u2014";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function matchesSearch(blog, query) {
  if (!query) {
    return true;
  }

  const normalized = query.toLowerCase();
  const haystacks = [
    blog.title ?? "",
    stripHtml(blog.content ?? ""),
    blog.authorName ?? "",
  ];

  return haystacks.some((value) => value.toLowerCase().includes(normalized));
}

function createExcerpt(text = "", wordLimit, characterMultiplier = 8) {
  const clean = stripHtml(text).replace(/\s+/g, " ").trim();
  if (!clean) {
    return "This story is coming soon.";
  }

  const words = clean.split(" ");
  const charLimit = wordLimit * characterMultiplier;
  let shortened = false;
  let truncated = clean;

  if (words.length > wordLimit) {
    truncated = words.slice(0, wordLimit).join(" ");
    shortened = true;
  }

  if (truncated.length > charLimit) {
    truncated = truncated.slice(0, charLimit).trim();
    shortened = true;
  }

  return shortened ? `${truncated}...` : truncated;
}

function normalizeArticles(source, fallback, { fillToFour = false } = {}) {
  const shapedSource = source.map((article, index) => ({
    id: article.id,
    title: article.title ?? "Untitled story",
    excerpt: createExcerpt(article.content, 24),
    description: createExcerpt(article.content, 48),
    tag: (article.tagLabel ?? article.authorName ?? "Travel").toUpperCase(),
    image: article.imageUrl ?? fallback[index % fallback.length].imageUrl,
  }));

  if (!fillToFour) {
    return shapedSource;
  }

  if (shapedSource.length >= 4) {
    return shapedSource.slice(0, 4);
  }

  const needed = 4 - shapedSource.length;
  const padded = [...shapedSource];

  for (let i = 0; i < needed; i += 1) {
    const placeholder = fallback[i % fallback.length];
    padded.push({
      id: `${placeholder.id}-fallback-${i}`,
      title: placeholder.title,
      excerpt: createExcerpt(placeholder.content, 24),
      description: createExcerpt(placeholder.content, 48),
      tag: (placeholder.tagLabel ?? "Travel").toUpperCase(),
      image: placeholder.imageUrl,
    });
  }

  return padded;
}

export default async function TravelBlogPage({ searchParams }) {
  const searchQuery =
    typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
  const rawPage =
    typeof searchParams?.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const publishedBlogs = await getPublishedBlogs();
  const filteredBlogs = searchQuery
    ? publishedBlogs.filter((blog) => matchesSearch(blog, searchQuery))
    : publishedBlogs;
  const totalPublished = publishedBlogs.length;
  const totalFiltered = filteredBlogs.length;
  const usingFallback = !searchQuery && totalFiltered === 0;
  const paginationSource = usingFallback ? fallbackArticles : filteredBlogs;
  const totalPages = Math.max(1, Math.ceil(paginationSource.length / PAGE_SIZE));
  const safePage =
    Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const currentPage = Math.min(Math.max(safePage, 1), totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageSlice = paginationSource.slice(startIndex, startIndex + PAGE_SIZE);
  const articles = normalizeArticles(pageSlice, fallbackArticles, {
    fillToFour: !usingFallback,
  });
  const hasArticles = articles.length > 0;
  const [featuredArticle, ...secondaryArticles] = hasArticles ? articles : [];
  const latestUpdatedLabel = formatDateLabel(publishedBlogs[0]?.createdAt ?? null);
  const emptyStateMessage = searchQuery
    ? `No articles found for "${searchQuery}".`
    : "No articles available just yet. Please check back soon.";
  const showNextButton = currentPage < totalPages;
  const showPrevButton = currentPage > 1;
  const buildQueryString = (pageValue) => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set("q", searchQuery);
    }
    if (pageValue > 1) {
      params.set("page", String(pageValue));
    }
    return params.toString() ? `?${params.toString()}` : "";
  };

  return (
    <div className="min-h-screen bg-[#f3f5fb] font-['Plus_Jakarta_Sans','Inter',sans-serif] text-gray-900">
      <header className="relative isolate overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80"
          alt="Mountain lake landscape"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />

        <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-20 pt-12 text-white lg:py-24">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Share your travel experience.
            <br />
            Inspire someone to start their own journey
            <br />
            {"\u2014"} with us, Solva Travel.
          </h1>

          <p className="max-w-2xl text-base text-white/80 sm:text-lg">
            Stories, tips, and real journeys shared by travellers — curated to inspire your next adventure.
          </p>

          <form
            className="flex w-full flex-col gap-3 rounded-2xl bg-white/15 p-3 backdrop-blur-sm sm:flex-row sm:items-center"
            action="/blog"
            method="get"
          >
            <div className="flex-1 rounded-xl bg-white/95 px-4 py-3 text-gray-900">
              <input
                type="search"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search travel stories..."
                aria-label="Search travel stories"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-white/90 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-gray-900 transition hover:bg-white"
            >
              Search
            </button>
          </form>
        </section>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <div className="mb-10 flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[#0f172a]/70">Blog</span>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold text-[#0f172a] sm:text-4xl">
              {currentPage === 1 ? "Latest Articles" : "More Articles"}
            </h2>
            <div className="flex flex-col gap-2 text-sm text-gray-500 sm:items-end sm:text-right">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                <span>
                  {totalPublished === 1
                    ? "1 travel story"
                    : `${totalPublished} Articles`}
                </span>
              </div>
              <span>Last updated {latestUpdatedLabel}</span>
            </div>
          </div>
        </div>

        {hasArticles ? (
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <article className="flex flex-col overflow-hidden rounded-[30px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
              <div className="relative h-64 w-full overflow-hidden sm:h-80">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-6 top-6 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  Featured
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-4 px-6 py-8 sm:px-9">
                <h3 className="break-words text-2xl font-semibold text-[#0f172a]">{featuredArticle.title}</h3>
                <p
                  className="break-words text-base leading-relaxed text-gray-700"
                  style={clampStyle(3)}
                >
                  {featuredArticle.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <span className="rounded-full bg-[#eef2ff] px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#4338ca]">
                    {featuredArticle.tag}
                  </span>
                  <Link
                    href={`/blog/${featuredArticle.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f172a] transition hover:text-[#1d4ed8]"
                    aria-label={`Read more about ${featuredArticle.title}`}
                  >
                    Read more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-4 w-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>

            <div className="flex flex-col gap-6">
              {secondaryArticles.map((article) => (
                <article
                  key={article.id}
                  className="flex gap-4 rounded-2xl bg-white p-4 shadow-[0_25px_60px_rgba(15,23,42,0.1)] sm:p-5"
                >
                  <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-32">
                    <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-3">
                    <h4 className="break-words text-lg font-semibold text-[#0f172a]" style={clampStyle(2)}>
                      {article.title}
                    </h4>
                    <p
                      className="break-words text-sm leading-relaxed text-gray-600"
                      style={clampStyle(2)}
                    >
                      {article.excerpt}
                    </p>
                    <div className="mt-auto flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-[#ecfeff] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#0f8b8d]">
                        {article.tag}
                      </span>
                      <Link
                        href={`/blog/${article.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#0f8b8d] transition hover:text-[#0b6475]"
                        aria-label={`Read more about ${article.title}`}
                      >
                        Read more
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          className="h-3.5 w-3.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-[30px] bg-white px-8 py-16 text-center shadow-[0_30px_80px_rgba(15,23,42,0.1)]">
            <p className="text-xl font-semibold text-[#0f172a]">No articles found</p>
            <p className="mt-3 text-sm text-gray-500">{emptyStateMessage}</p>
            {searchQuery && (
              <Link
                href="/blog"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d2749]"
              >
                Clear search
              </Link>
            )}
          </div>
        )}

        {(showPrevButton || showNextButton) && (
          <div className="mt-10 flex flex-wrap justify-end gap-4">
            {showPrevButton && (
              <Link
                href={`/blog${buildQueryString(currentPage - 1)}`}
                aria-label="Go to the previous set of articles"
                className="inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d2749]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 18 7 12l6-6" />
                </svg>
                Previous
              </Link>
            )}
            {showNextButton && (
              <Link
                href={`/blog${buildQueryString(currentPage + 1)}`}
                aria-label="Go to the next set of articles"
                className="inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d2749]"
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
