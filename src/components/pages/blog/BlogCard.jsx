import { CalendarDays, Quote, UserRound } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat("th-TH", {
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

function buildExcerpt(content, maxLength = 160) {
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

function formatDate(date) {
  if (!date) return null;
  try {
    return dateFormatter.format(date);
  } catch (error) {
    console.error("Failed to format blog date", error);
    return null;
  }
}

export function BlogCard({ blog }) {
  const {
    title = "Untitled story",
    content,
    authorName = "Solva Travel Team",
    createdAt,
  } = blog || {};

  const excerpt = buildExcerpt(content);
  const rawDate = castToDate(createdAt);
  const formattedDate = formatDate(rawDate);

  return (
    <article className="group relative h-full overflow-hidden rounded-3xl border border-[#FFD700]/18 bg-gradient-to-br from-[#141006]/90 via-[#0d0903]/90 to-[#090602]/90 p-px shadow-[0_12px_32px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1 hover:border-[#FFD700]/45">
      <div className="relative flex h-full flex-col gap-5 rounded-[inherit] bg-black/70 px-6 py-7 transition-colors duration-300 group-hover:bg-black/55">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/12 via-transparent to-[#FFED4E]/8 opacity-70" />
          <div className="absolute -top-14 right-10 h-28 w-28 rounded-full bg-[#FFD700]/15 blur-3xl group-hover:bg-[#FFD700]/25" />
        </div>

        <div className="relative flex flex-col gap-4">
          <span className="inline-flex items-center gap-2 text-[#FFED4E]">
            <Quote className="h-4 w-4" aria-hidden="true" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#FFED4E]/90">
              Customer Review
            </span>
          </span>

          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-[#FFD700]">
              {title}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
              {excerpt}
            </p>
          </div>
        </div>

        <div className="relative mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/55">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-white/80">
            <UserRound className="h-4 w-4 text-[#FFED4E]" aria-hidden="true" />
            <span className="font-medium">{authorName}</span>
          </span>
          {formattedDate ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
              <CalendarDays className="h-4 w-4 text-[#FFED4E]" aria-hidden="true" />
              <time dateTime={rawDate.toISOString()}>{formattedDate}</time>
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
