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
      <DialogContent className="max-w-4xl max-h-[90vh] rounded-2xl border-0 bg-gradient-to-b from-zinc-900 to-black p-0 shadow-2xl overflow-hidden">
        <DialogHeader className="relative px-8 py-6 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-pink-600/5" />
          <DialogTitle className="text-2xl font-bold text-white flex items-start gap-3 relative">
            <FileText className="w-7 h-7 text-blue-400 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{blog?.title || "Untitled blog post"}</span>
          </DialogTitle>
        </DialogHeader>

        {blog ? (
          <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
            <div className="px-8 py-5 bg-zinc-900/30 border-b border-white/5">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-400">Author:</span>
                  <span className="text-white font-medium">{blog.authorName || "Unknown"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                  <span className="text-zinc-400">Status:</span>
                  <span className={`${statusColor} font-medium`}>{statusLabel}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-400">Last updated:</span>
                  <span className="text-white font-medium">{formatDate(blog.updatedAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-400">Created:</span>
                  <span className="text-white font-medium">{formatDate(blog.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="px-8 py-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2">
                  <FileText className="w-5 h-5 text-zinc-400" />
                  <h3 className="text-lg font-semibold text-white">Content</h3>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-xl blur-xl" />
                  <div className="relative bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap text-base">
                        {blog.content || "No content provided."}
                      </p>
                    </div>
                  </div>
                </div>
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
