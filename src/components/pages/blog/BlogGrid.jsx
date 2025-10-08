"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Eye, EyeOff, Search, UserRound } from "lucide-react";
import { BlogCard } from "./BlogCard";

const BLOGS_PER_PAGE = 7;

const thaiNumberFormatter = new Intl.NumberFormat("th-TH");
const thaiDateFormatter = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function toPlainText(content) {
  if (!content) return "";
  return String(content)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildExcerpt(content, maxLength = 220) {
  const text = toPlainText(content);
  if (!text) return "เนื้อหาอยู่ระหว่างจัดเตรียม";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

function castToDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
  const date = castToDate(value);
  if (!date) return null;
  try {
    return thaiDateFormatter.format(date);
  } catch (error) {
    console.error("Failed to format date", error);
    return null;
  }
}

function StatBadge({ label, value }) {
  if (!value) return null;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/8 px-4 py-1.5 text-xs sm:text-sm text-white/75">
      <span className="flex h-1.5 w-1.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.7)]" />
      <span className="font-medium text-white/85">
        {label}
        <span className="ml-2 inline-flex items-center rounded-full bg-[#FFD700]/15 px-3 py-0.5 text-[#FFED4E] font-semibold">
          {value}
        </span>
      </span>
    </span>
  );
}

function LatestBadge({ formattedDate }) {
  if (!formattedDate) return null;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5 px-4 py-1.5 text-xs sm:text-sm text-white/70">
      <span className="flex h-1.5 w-1.5 rounded-full bg-[#FFED4E] shadow-[0_0_8px_rgba(255,237,78,0.7)]" />
      <span className="font-medium text-white/80">อัปเดตล่าสุด {formattedDate}</span>
    </span>
  );
}

function FeaturedBlogCard({ blog, showLatestBadge = true }) {
  if (!blog) return null;

  const {
    title = "Untitled story",
    content,
    authorName = "Solva Travel Team",
    createdAt,
  } = blog;

  const collapsedText = useMemo(() => buildExcerpt(content, 260), [content]);
  const fullText = useMemo(() => toPlainText(content), [content]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [collapsedText]);

  const hasContent = Boolean(fullText);
  const displayText = isExpanded && fullText ? fullText : collapsedText;
  const expandedTextClasses = isExpanded ? "max-h-96 overflow-y-auto pr-1" : "";
  const rawDate = castToDate(createdAt);
  const formattedDate = rawDate ? thaiDateFormatter.format(rawDate) : null;

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[#FFD700]/25 bg-gradient-to-br from-[#171106]/90 via-[#0d0903]/92 to-[#080602]/90 px-6 py-8 sm:px-10 sm:py-12 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/12 via-transparent to-[#FFED4E]/10" />
        <div className="absolute -top-24 left-10 h-48 w-48 rounded-full bg-[#FFD700]/15 blur-3xl" />
      </div>

      <div className="relative flex flex-col gap-5 text-left text-white">
        {showLatestBadge ? (
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FFD700]/40 bg-[#FFD700]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.32em] text-[#FFD700]">
            Latest Reviews
          </span>
        ) : null}

        <div className="space-y-4">
          <h3 className="text-2xl sm:text-3xl font-semibold leading-tight text-white">
            {title}
          </h3>
          <p className={`text-sm sm:text-base text-white/80 leading-relaxed whitespace-pre-line break-words ${isExpanded ? "" : "line-clamp-5"} ${expandedTextClasses}`}>
            {displayText}
          </p>
          {hasContent ? (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FFD700]/25 bg-[#FFD700]/8 px-4 py-1.5 text-xs sm:text-sm font-medium text-[#FFED4E] transition-colors hover:bg-[#FFD700]/16 hover:text-[#FFD700]"
            >
              {isExpanded ? (
                <>
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                  <span>ซ่อนรีวิว</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  <span>อ่านรีวิวเต็ม</span>
                </>
              )}
            </button>
          ) : null}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 text-sm text-white/70">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-white/90">
            <UserRound className="h-4 w-4 text-[#FFD700]" aria-hidden="true" />
            <span className="font-medium">{authorName}</span>
          </span>
          {formattedDate ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
              <CalendarDays className="h-4 w-4 text-[#FFD700]" aria-hidden="true" />
              <time dateTime={rawDate.toISOString()}>{formattedDate}</time>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function BlogGrid({ blogs = [], totalBlogs = 0, latestPublishedAt = null }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const normalizedSearch = useMemo(
    () => searchTerm.trim().toLowerCase(),
    [searchTerm]
  );

  const filteredBlogs = useMemo(() => {
    if (!Array.isArray(blogs)) {
      return [];
    }

    if (!normalizedSearch) {
      return blogs;
    }

    return blogs.filter((blog) => {
      if (!blog) {
        return false;
      }

      const fields = [
        typeof blog.title === "string" ? blog.title : "",
        typeof blog.authorName === "string" ? blog.authorName : "",
        toPlainText(blog.content),
      ];

      return fields.some((field) => {
        if (typeof field !== "string" || !field) {
          return false;
        }

        return field.toLowerCase().includes(normalizedSearch);
      });
    });
  }, [blogs, normalizedSearch]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredBlogs]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    return filteredBlogs.slice(startIndex, startIndex + BLOGS_PER_PAGE);
  }, [filteredBlogs, currentPage]);

  const hasAnyBlogs = Array.isArray(blogs) && blogs.length > 0;
  const hasFilteredBlogs = filteredBlogs.length > 0;
  const hasBlogsOnPage = pageBlogs.length > 0;

  const featuredBlog =
    currentPage === 1 && hasBlogsOnPage ? pageBlogs[0] : null;
  const remainingBlogs = currentPage === 1 ? pageBlogs.slice(1) : pageBlogs;

  const formattedTotal = typeof totalBlogs === "number" && totalBlogs > 0
    ? thaiNumberFormatter.format(totalBlogs)
    : null;
  const formattedLatest = formatDate(latestPublishedAt);

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 pb-20">
      <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[36px] border border-[#FFD700]/18 bg-[#080502]/85 px-4 py-10 sm:px-10 sm:py-12 shadow-[0_0_90px_rgba(255,215,0,0.12)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 via-transparent to-[#FFED4E]/6" />
          <div className="absolute bottom-0 left-1/2 h-48 w-[80%] -translate-x-1/2 rounded-full bg-[#FFD700]/8 blur-3xl" />
        </div>

        <div className="relative space-y-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full flex-col sm:w-auto">
              <div className="flex items-center gap-3">
                
                <span className="hidden sm:block h-px flex-1 min-w-[240px] max-w-[504px] bg-gradient-to-r from-[#FFED4E] via-[#FFD700] to-transparent"></span>
              </div>
              <h2 className="relative mt-2 inline-flex text-2xl sm:text-[32px] md:text-[36px] font-semibold text-white">
                <span className="relative inline-flex items-center">
                  <span className="absolute -inset-3 rounded-[28px] bg-[#FFD700]/10 blur-xl"></span>
                  <span className="relative bg-gradient-to-r from-[#FFED4E] via-[#FFD700] to-[#B68B00] bg-clip-text text-transparent drop-shadow-[0_4px_14px_rgba(255,215,0,0.28)]">
                    All Blogs
                  </span>
                </span>
              </h2>
              
            </div>
            <div className="flex flex-col gap-4 w-full sm:w-auto sm:items-end">
              <div className="flex flex-wrap items-center gap-3 justify-start sm:justify-end">
                <StatBadge label="จำนวนบล็อกทั้งหมด" value={formattedTotal} />
                <LatestBadge formattedDate={formattedLatest} />
              </div>
              <div className="relative w-full sm:w-72 sm:self-end">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FFD700]/70" aria-hidden="true" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search your blog posts..."
                  aria-label="Search blog posts"
                  className="w-full rounded-full border border-[#FFD700]/25 bg-black/50 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/40"
                />
              </div>
            </div>
          </div>

          {hasAnyBlogs ? (
            hasFilteredBlogs ? (
              <div className="space-y-8">
                <FeaturedBlogCard
                  blog={featuredBlog}
                  showLatestBadge={currentPage === 1 && !normalizedSearch}
                />

                {remainingBlogs.length > 0 ? (
                  <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 xl:grid-cols-3">
                    {remainingBlogs.map((blog, index) => (
                      <div
                        key={blog.id || index}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 60}ms` }}
                      >
                        <BlogCard blog={blog} />
                      </div>
                    ))}
                  </div>
                ) : null}

                {totalPages > 1 ? (
                  <div className="flex justify-end pt-6">
                    <div className="inline-flex items-center gap-3 rounded-full border border-[#FFD700]/25 bg-black/40 px-3 py-1.5 sm:px-4">
                      <span className="text-xs sm:text-sm text-white/60">
                        Page {currentPage} of {totalPages}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                          disabled={currentPage === 1}
                          className="inline-flex items-center gap-1 rounded-full border border-[#FFD700]/25 bg-[#FFD700]/10 px-2.5 py-1 text-xs font-medium text-[#FFED4E] transition-opacity hover:bg-[#FFD700]/20 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                          Prev
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                          disabled={currentPage === totalPages}
                          className="inline-flex items-center gap-1 rounded-full border border-[#FFD700]/25 bg-[#FFD700]/10 px-2.5 py-1 text-xs font-medium text-[#FFED4E] transition-opacity hover:bg-[#FFD700]/20 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Next page"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="relative mx-auto max-w-3xl rounded-3xl border border-dashed border-[#FFD700]/30 bg-black/60 px-8 py-12 text-center text-white/75">
                No blog posts match your search.
              </div>
            )
          ) : (
            <div className="relative mx-auto max-w-3xl rounded-3xl border border-dashed border-[#FFD700]/30 bg-black/60 px-8 py-12 text-center text-white/75">
              กำลังเตรียมเรื่องราวใหม่ ๆ อยู่ในขณะนี้ โปรดกลับมาเยี่ยมชมอีกครั้งเร็ว ๆ นี้
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

