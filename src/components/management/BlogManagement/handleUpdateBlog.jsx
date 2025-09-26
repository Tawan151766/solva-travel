const handleUpdateBlog = async ({ formData, toast }) => {
  try {
    const { id, ...payload } = formData;

    const response = await fetch(`/api/blog/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({ id, ...payload }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Failed to update blog");
    }

    toast?.({
      title: "Success",
      description: "Blog post updated successfully.",
    });

    return data?.data?.blog || null;
  } catch (error) {
    console.error("Error updating blog:", error);
    toast?.({
      title: "Error",
      description: error.message || "Failed to update blog post.",
      variant: "destructive",
    });
    return null;
  }
};

export default handleUpdateBlog;
