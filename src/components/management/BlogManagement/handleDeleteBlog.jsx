const handleDeleteBlog = async ({ blogId, toast }) => {
  if (!blogId) {
    return false;
  }

  try {
    const response = await fetch(`/api/blog/${blogId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Failed to delete blog");
    }

    toast?.({
      title: "Deleted",
      description: "Blog post deleted successfully.",
    });

    return true;
  } catch (error) {
    console.error("Error deleting blog:", error);
    toast?.({
      title: "Error",
      description: error.message || "Failed to delete blog post.",
      variant: "destructive",
    });
    return false;
  }
};

export default handleDeleteBlog;
