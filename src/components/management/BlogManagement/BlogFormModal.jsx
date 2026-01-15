import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
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
import { Loader2, UploadCloud } from "lucide-react";

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

  // ??????
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(formData.imageUrl || "");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // reset image preview/file ????????????????????????????????? Blog
  useEffect(() => {
    if (isOpen) {
      setImageFile(null);
      setImagePreview(formData.imageUrl || "");
    }
  }, [isOpen, formData.imageUrl]);

  const applySelectedImage = (file) => {
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, imageFile: file, imageRemoved: false }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    applySelectedImage(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFormData((prev) => ({ ...prev, imageFile: null, imageUrl: "", imageRemoved: true }));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer?.files?.[0];
    applySelectedImage(file);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border border-white/10 bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] p-0 overflow-hidden">
        <DialogHeader className="border-b border-white/10 px-6 py-4">
          <DialogTitle className="text-white/90 text-lg font-semibold tracking-wide">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">
          {/* Image Upload Field */}
          <Field>
            <Field.Label htmlFor="blog-image">
              <span className="border-b border-dashed border-white pb-0.5 text-white">
                เพิ่มรูปภาพ
              </span>
              <span className="text-white/80"> สำหรับ Blog</span>
            </Field.Label>
            {imagePreview ? (
              <div className="mt-3 flex flex-col items-start gap-4">
                <img
                  src={imagePreview}
                  alt="Blog preview"
                  className="h-52 w-52 rounded-2xl border border-[#FFD700]/60 object-cover shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                />
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRemoveImage}
                    className="border-red-400/30 text-red-300 hover:bg-red-500/10"
                  >
                    ลบรูปภาพ
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={openFilePicker}
                    className="border-[#FFD700]/40 text-[#FFD700] hover:bg-[#FFD700]/10"
                  >
                    เลือกรูปภาพใหม่
                  </Button>
                </div>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                aria-label="เพิ่มรูปภาพสำหรับ Blog"
                onClick={openFilePicker}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    openFilePicker()
                  }
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`mt-3 flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/60 ${
                  isDragging
                    ? "border-[#FFD700] bg-[#FFD700]/5 text-[#FFD700]"
                    : "border-white/20 bg-black/30 text-white/70 hover:border-[#FFD700]/80 hover:bg-white/5"
                }`}
              >
                <UploadCloud className="h-12 w-12 text-current" />
                <p className="text-sm font-semibold">ลากและวางรูปภาพที่นี่</p>
                <p className="text-xs text-white/50">หรือคลิกเพื่อเลือกไฟล์จากเครื่อง</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              id="blog-image"
              onChange={handleImageChange}
              className="hidden"
            />
            <Field.Hint>
              รองรับไฟล์ .jpg .png .webp และต้องมีขนาดไม่เกิน 5MB
            </Field.Hint>
          </Field>

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
                <SelectValue
                  placeholder={authorPlaceholder}
                  fallbackDisplay={displayAuthorLabel}
                />
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
            cancel
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





