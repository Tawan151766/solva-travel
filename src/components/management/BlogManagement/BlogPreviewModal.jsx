import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, User, Eye, EyeOff, FileText, Clock } from "lucide-react";

function formatDate(date) {
  if (!date) {
    return "-";
  }

  try {
    return new Date(date).toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Failed to format date", error);
    return "-";
  }
}

const BlogPreviewModal = ({ isOpen, onOpenChange, blog }) => {
  const StatusIcon = blog?.published ? Eye : EyeOff;
  const statusLabel = blog?.published ? "Published" : "Unpublished";
  const statusColor = blog?.published ? "text-emerald-400" : "text-amber-400";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] rounded-2xl border-0 bg-gradient-to-b from-zinc-900 to-black p-0 shadow-2xl overflow-hidden">
        <DialogHeader className="relative px-8 py-6 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-pink-600/5" />
          <DialogTitle className="text-2xl font-bold text-white flex items-start gap-3 relative">
            <FileText className="w-7 h-7 text-blue-400 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{blog?.title || "Untitled blog post"}</span>
          </DialogTitle>
        </DialogHeader>

        {blog ? (
          <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
            <div className="px-8 py-8 bg-zinc-900/30 border-b border-white/5">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-4">
                <div className="w-full lg:flex-[1.15] lg:pr-1">
                  <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-black/70 to-black/40 p-3 shadow-[0_20px_45px_rgba(0,0,0,0.45)] ring-1 ring-white/5">
                    <div className="relative">
                      {blog.imageUrl ? (
                        <img
                          src={blog.imageUrl}
                          alt="Blog cover"
                        className="w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-[1.01] lg:h-[220px]"
                        />
                      ) : (
                        <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/15 text-sm text-white/55">
                          No preview image
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:flex-[0.85]">
                  <div className="rounded-3xl border border-white/15 bg-black/50 p-6 shadow-[0_20px_45px_rgba(0,0,0,0.35)] space-y-5">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <User className="w-4 h-4 text-zinc-500" />
                      <span className="text-zinc-400">Author:</span>
                      <span className="text-white font-semibold">{blog.authorName || "Unknown"}</span>
                    </div>

                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                      <span className="text-zinc-400">Status:</span>
                      <span className={`${statusColor} font-semibold`}>{statusLabel}</span>
                    </div>

                    <div className="flex items-start gap-3 border-b border-white/5 pb-4">
                      <Clock className="w-4 h-4 text-zinc-500 mt-0.5" />
                      <div>
                        <p className="text-zinc-400">Last updated</p>
                        <p className="text-white font-medium">{formatDate(blog.updatedAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-zinc-500 mt-0.5" />
                      <div>
                        <p className="text-zinc-400">Created</p>
                        <p className="text-white font-medium">{formatDate(blog.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Blog Image Preview */}
            <div className="px-8 py-6 space-y-5">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-zinc-400" />
                <h3 className="text-lg font-semibold text-white">Content</h3>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/25 p-5">
                <p className="text-base leading-relaxed text-zinc-200 whitespace-pre-wrap">
                  {blog.content || "No content provided."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <FileText className="w-16 h-16 text-zinc-600 mb-4" />
            <p className="text-zinc-400 text-lg">Select a blog post to preview.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BlogPreviewModal;
