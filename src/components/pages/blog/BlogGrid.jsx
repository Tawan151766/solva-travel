"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, UserRound } from "lucide-react";
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

function FeaturedBlogCard({ blog }) {
  if (!blog) return null;

  const {
    title = "Untitled story",
    content,
    authorName = "Solva Travel Team",
    createdAt,
  } = blog;

  const excerpt = buildExcerpt(content, 260);
  const rawDate = castToDate(createdAt);
  const formattedDate = rawDate ? thaiDateFormatter.format(rawDate) : null;

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[#FFD700]/25 bg-gradient-to-br from-[#171106]/90 via-[#0d0903]/92 to-[#080602]/90 px-6 py-8 sm:px-10 sm:py-12 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/12 via-transparent to-[#FFED4E]/10" />
        <div className="absolute -top-24 left-10 h-48 w-48 rounded-full bg-[#FFD700]/15 blur-3xl" />
      </div>

      <div className="relative flex flex-col gap-5 text-left text-white">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FFD700]/40 bg-[#FFD700]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.32em] text-[#FFD700]">
          Latest Reviews
        </span>

        <div className="space-y-4">
          <h3 className="text-2xl sm:text-3xl font-semibold leading-tight text-white">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed">
            {excerpt}
          </p>
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
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil((blogs?.length ?? 0) / BLOGS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [blogs]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    return blogs.slice(startIndex, startIndex + BLOGS_PER_PAGE);
  }, [blogs, currentPage]);

  const hasOverallBlogs = Array.isArray(blogs) && blogs.length > 0;
  const hasBlogsOnPage = pageBlogs.length > 0;

  const featuredBlog = hasBlogsOnPage ? pageBlogs[0] : null;
  const remainingBlogs = hasBlogsOnPage ? pageBlogs.slice(1) : [];

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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Blog ทั้งหมด</h2>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <StatBadge label="จำนวนบล็อกทั้งหมด" value={formattedTotal} />
              <LatestBadge formattedDate={formattedLatest} />
            </div>
          </div>

          {hasOverallBlogs ? (
            <div className="space-y-8">
              <FeaturedBlogCard blog={featuredBlog} />

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
              กำลังเตรียมเรื่องราวใหม่ ๆ อยู่ในขณะนี้ โปรดกลับมาเยี่ยมชมอีกครั้งเร็ว ๆ นี้
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
