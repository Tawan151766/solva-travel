"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import BlogFilters from "./BlogFilters.jsx";
import BlogTable from "./BlogTable.jsx";
import BlogFormModal from "./BlogFormModal.jsx";
import BlogPreviewModal from "./BlogPreviewModal.jsx";
import fetchBlogs from "./fetchBlogs.jsx";
import handleCreateBlog from "./handleCreateBlog.jsx";
import handleUpdateBlog from "./handleUpdateBlog.jsx";
import handleDeleteBlog from "./handleDeleteBlog.jsx";

const defaultFormState = {
  id: "",
  title: "",
  content: "",
  published: false,
  authorId: "",
  authorName: "",
};

const getUserDisplayName = (user) => {
  if (!user) {
    return "";
  }

  if (typeof user.displayName === "string" && user.displayName.trim()) {
    return user.displayName.trim();
  }

  const parts = [user.firstName, user.lastName]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);

  if (parts.length) {
    return parts.join(" ");
  }

  if (typeof user.name === "string" && user.name.trim()) {
    return user.name.trim();
  }

  if (typeof user.email === "string" && user.email.trim()) {
    return user.email.trim();
  }

  return "";
};

const normalizeUser = (user) => {
  if (!user || !user.id) {
    return null;
  }

  const displayName = getUserDisplayName(user) || "Unnamed user";

  return {
    ...user,
    displayName,
  };
};

const BlogManagement = ({ showHeader = false, renderHeader, onStatsChange }) => {
  const { toast } = useToast();

  const [blogs, setBlogs] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [authorsLoading, setAuthorsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formMode, setFormMode] = useState("create");
  const [formData, setFormData] = useState(defaultFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAuthorId, setCurrentAuthorId] = useState("");
  const [currentAuthorLabel, setCurrentAuthorLabel] = useState("");
  const [currentAuthorInfo, setCurrentAuthorInfo] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        return;
      }

      const parsed = JSON.parse(storedUser);
      if (!parsed?.id) {
        return;
      }

      const displayName = getUserDisplayName(parsed) || "Current user";
      setCurrentAuthorInfo({ ...parsed, displayName });
      setCurrentAuthorId(parsed.id);
      setCurrentAuthorLabel(displayName);
    } catch (error) {
      console.error("Failed to parse stored user", error);
    }
  }, []);

  useEffect(() => {
    if (!currentAuthorId) {
      return;
    }

    setFormData((prev) => {
      if (prev.id) {
        return prev;
      }

      if (prev.authorId === currentAuthorId && prev.authorName === currentAuthorLabel) {
        return prev;
      }

      return {
        ...prev,
        authorId: currentAuthorId,
        authorName: currentAuthorLabel,
      };
    });
  }, [currentAuthorId, currentAuthorLabel]);

  const loadAuthors = useCallback(async () => {
    setAuthorsLoading(true);
    try {
      const response = await fetch("/api/management/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load authors");
      }

      const data = await response.json();
      const users = Array.isArray(data?.data) ? data.data : [];
      const normalizedUsers = users
        .map((user) => normalizeUser(user))
        .filter(Boolean);

      let finalUsers = normalizedUsers;

      if (
        currentAuthorId &&
        !normalizedUsers.some((user) => user.id === currentAuthorId)
      ) {
        const fallbackUser = normalizeUser(
          currentAuthorInfo || {
            id: currentAuthorId,
            firstName: "",
            lastName: "",
            email: "",
            displayName: currentAuthorLabel || "Current user",
          }
        );

        if (fallbackUser) {
          finalUsers = [...normalizedUsers, fallbackUser];
        }
      }

      const uniqueUsers = Array.from(
        new Map(finalUsers.map((user) => [user.id, user])).values()
      );

      setAuthors(uniqueUsers);

      if (currentAuthorId) {
        const matchedAuthor = uniqueUsers.find((user) => user.id === currentAuthorId);
        if (matchedAuthor && matchedAuthor.displayName !== currentAuthorLabel) {
          setCurrentAuthorLabel(matchedAuthor.displayName);
        }
      }

      if (!currentAuthorId && uniqueUsers.length) {
        const fallbackAuthor = uniqueUsers[0];
        setCurrentAuthorId(fallbackAuthor.id);
        setCurrentAuthorLabel(fallbackAuthor.displayName);
        setFormData((prev) =>
          prev.id
            ? prev
            : {
                ...prev,
                authorId: fallbackAuthor.id,
                authorName: fallbackAuthor.displayName,
              }
        );
      }
    } catch (error) {
      console.error("Error loading authors:", error);
      setAuthors([]);
      toast?.({
        title: "Error",
        description: "Failed to load authors",
        variant: "destructive",
      });
    } finally {
      setAuthorsLoading(false);
    }
  }, [currentAuthorId, currentAuthorInfo, currentAuthorLabel, toast]);

  const publishedOptions = useMemo(
    () => [
      { value: "ALL", label: "All" },
      { value: "PUBLISHED", label: "Published" },
      { value: "UNPUBLISHED", label: "Unpublished" },
    ],
    []
  );

  useEffect(() => {
    loadAuthors();
  }, [loadAuthors]);

  const loadBlogs = useCallback(() => {
    return fetchBlogs({
      setBlogs,
      setLoading,
      toast,
      searchTerm,
      publishedFilter,
    });
  }, [publishedFilter, searchTerm, toast]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadBlogs();
    }, 250);

    return () => clearTimeout(timeout);
  }, [loadBlogs]);

  useEffect(() => {
    onStatsChange?.({ count: blogs.length, loading });
  }, [blogs.length, loading, onStatsChange]);

  const resetForm = () => {
    setFormData({
      ...defaultFormState,
      authorId: currentAuthorId,
      authorName: currentAuthorLabel,
    });
  };

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedBlog(null);
    setFormData({
      ...defaultFormState,
      authorId: currentAuthorId,
      authorName: currentAuthorLabel,
    });
    setIsFormOpen(true);
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setIsPreviewOpen(true);
  };

  const handleEditBlog = (blog) => {
    setFormMode("edit");
    setSelectedBlog(blog);
    setFormData({
      id: blog.id,
      title: blog.title || "",
      content: blog.content || "",
      published: Boolean(blog.published),
      authorId: blog.authorId || currentAuthorId,
      authorName: blog.authorName || currentAuthorLabel,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (blogId) => {
    if (!blogId) {
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this blog post?");
    if (!confirmed) {
      return;
    }

    const success = await handleDeleteBlog({ blogId, toast });
    if (success) {
      loadBlogs();
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast?.({
        title: "Missing information",
        description: "Enter both a title and content before saving.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.authorId) {
      toast?.({
        title: "Select an author",
        description: "Choose an author for this blog post before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (formMode === "create") {
        const result = await handleCreateBlog({
          formData: {
            title: formData.title.trim(),
            content: formData.content.trim(),
            published: formData.published,
            authorId: formData.authorId,
          },
          toast,
        });

        if (result) {
          setIsFormOpen(false);
          resetForm();
          loadBlogs();
        }
      } else if (formMode === "edit" && formData.id) {
        const result = await handleUpdateBlog({
          formData: {
            id: formData.id,
            title: formData.title.trim(),
            content: formData.content.trim(),
            published: formData.published,
            authorId: formData.authorId,
          },
          toast,
        });

        if (result) {
          setIsFormOpen(false);
          resetForm();
          loadBlogs();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !blogs.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD700]" />
      </div>
    );
  }

  const headerContent = renderHeader
    ? renderHeader({ count: blogs.length, loading, onCreate: handleOpenCreate })
    : showHeader
    ? (
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">Blog Management</h2>
          <p className="text-sm text-white/60">
            Review posts, assign authors, and control publication status.
          </p>
        </div>
      )
    : null;

  return (
    <div className="space-y-6">
      {headerContent}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <BlogFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          publishedFilter={publishedFilter}
          onPublishedFilterChange={setPublishedFilter}
          publishedOptions={publishedOptions}
        />
        <Button
          onClick={handleOpenCreate}
          className="self-start md:self-auto bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black hover:from-[#FFED4E] hover:to-[#FFD700]"
        >
          <Plus className="h-4 w-4 mr-2" /> New Blog
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD700]" />
        </div>
      ) : (
        <BlogTable
          blogs={blogs}
          onView={handleViewBlog}
          onEdit={handleEditBlog}
          onDelete={handleDelete}
        />
      )}

      <BlogFormModal
        isOpen={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) {
            resetForm();
          }
        }}
        mode={formMode}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        authors={authors}
        authorsLoading={authorsLoading}
      />

      <BlogPreviewModal
        isOpen={isPreviewOpen}
        onOpenChange={(open) => {
          setIsPreviewOpen(open);
          if (!open) {
            setSelectedBlog(null);
          }
        }}
        blog={selectedBlog}
      />
    </div>
  );
};

export default BlogManagement;
