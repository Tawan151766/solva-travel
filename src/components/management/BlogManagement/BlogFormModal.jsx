import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

function getAuthorDisplayName(author) {
  if (!author) {
    return "";
  }

  if (author.displayName?.trim()) {
    return author.displayName.trim();
  }

  const parts = [author.firstName, author.lastName]
    .map((part) => part?.trim())
    .filter(Boolean);

  if (parts.length) {
    return parts.join(" ");
  }

  if (author.name?.trim()) {
    return author.name.trim();
  }

  if (author.email?.trim()) {
    return author.email.trim();
  }

  return "Unknown user";
}

export default function BlogFormModal({
  isOpen,
  onOpenChange,
  mode,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  authors = [],
  authorsLoading = false,
}) {
  const title = mode === "edit" ? "Edit Blog Post" : "Create Blog Post";

  const canSubmit =
    !isSubmitting &&
    formData.title?.trim() &&
    formData.content?.trim() &&
    formData.authorId;

  const selectedAuthor = authors.find((author) => author.id === formData.authorId);
  const selectedAuthorLabel = getAuthorDisplayName(selectedAuthor);

  const authorPlaceholder = authorsLoading
    ? "Loading authors..."
    : authors.length
    ? "Select author"
    : "No authors available";

  const displayAuthorLabel =
    selectedAuthorLabel || formData.authorName || (formData.authorId && !authorsLoading ? "Unknown user" : undefined);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border border-white/10 bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] p-0 overflow-hidden">
        <DialogHeader className="border-b border-white/10 px-6 py-4">
          <DialogTitle className="text-white/90 text-lg font-semibold tracking-wide">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">
          <Field>
            <Field.Label htmlFor="blog-title">Title</Field.Label>
            <Input
              id="blog-title"
              value={formData.title}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Enter blog title"
              className="mt-2 bg-black/40 border-white/15 text-white placeholder:text-white/40 focus-visible:ring-[#FFD700]/70 focus-visible:border-[#FFD700]/70 rounded-xl"
            />
          </Field>

          <Field>
            <Field.Label htmlFor="blog-content">Content</Field.Label>
            <Textarea
              id="blog-content"
              value={formData.content}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, content: event.target.value }))
              }
              rows={10}
              placeholder="Write your blog content..."
              className="mt-2 bg-black/40 border-white/15 text-white placeholder:text-white/40 focus-visible:ring-[#FFD700]/70 focus-visible:border-[#FFD700]/70 rounded-xl"
            />
          </Field>

          <Field>
            <Field.Label>Author</Field.Label>
            <Select
              value={formData.authorId || ""}
              onValueChange={(value) => {
                const nextAuthor = authors.find((author) => author.id === value);
                const nextLabel = getAuthorDisplayName(nextAuthor);
                setFormData((prev) => ({
                  ...prev,
                  authorId: value,
                  authorName: nextLabel || prev.authorName || "",
                }));
              }}
            >
              <SelectTrigger className="mt-2 bg-black/40 border-white/15 text-white rounded-xl focus:ring-2 focus:ring-[#FFD700]/60">
                <SelectValue placeholder={authorPlaceholder}>
                  {displayAuthorLabel}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-white/10 text-white">
                {authorsLoading ? (
                  <div className="px-4 py-2 text-sm text-white/60">Loading...</div>
                ) : authors.length ? (
                  authors.map((author) => (
                    <SelectItem
                      key={author.id}
                      value={author.id}
                      className="focus:bg-white/10"
                    >
                      {getAuthorDisplayName(author)}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-white/60">
                    No authors available
                  </div>
                )}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <Field.Label>Status</Field.Label>
            <Select
              value={formData.published ? "PUBLISHED" : "UNPUBLISHED"}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, published: value === "PUBLISHED" }))
              }
            >
              <SelectTrigger className="mt-2 bg-black/40 border-white/15 text-white rounded-xl focus:ring-2 focus:ring-[#FFD700]/60">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 border-white/10 text-white">
                <SelectItem value="PUBLISHED" className="focus:bg-white/10">
                  Published
                </SelectItem>
                <SelectItem value="UNPUBLISHED" className="focus:bg-white/10">
                  Unpublished
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="border-white/20 text-gray-200 hover:bg-white/10 rounded-xl"
          >
            ยกเลิก
          </Button>


          <Button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="rounded-xl bg-[#FFD700] text-black hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </span>
            ) : (
              "Save Blog"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ children }) {
  return <div className="space-y-2">{children}</div>;
}

Field.Label = function FieldLabel({ children, className = "", ...props }) {
  return (
    <Label
      className={`text-sm text-white/80 leading-none ${className}`}
      {...props}
    >
      {children}
    </Label>
  );
};

Field.Hint = function FieldHint({ children }) {
  return (
    <p className="text-xs text-white/45 leading-relaxed pt-1">{children}</p>
  );
};
