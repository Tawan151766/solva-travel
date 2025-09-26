const fetchBlogs = async ({
  setBlogs,
  setLoading,
  toast,
  searchTerm = "",
  publishedFilter = "ALL",
  page = 1,
}) => {
  try {
    setLoading(true);

    const params = new URLSearchParams({ limit: "100", page: String(page) });

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }

    if (publishedFilter === "PUBLISHED") {
      params.set("published", "true");
    } else if (publishedFilter === "UNPUBLISHED") {
      params.set("published", "false");
    }

    const response = await fetch(`/api/blog?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      toast?.({
        title: "Error",
        description:
          errorData?.message || errorData?.error || "Failed to load blog posts",
        variant: "destructive",
      });
      return [];
    }

    const data = await response.json();
    const blogs = data?.data?.blogs || [];
    setBlogs(blogs);
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    toast?.({
      title: "Error",
      description: "Unable to fetch blog posts. Please try again later.",
      variant: "destructive",
    });
    return [];
  } finally {
    setLoading(false);
  }
};

export default fetchBlogs;
