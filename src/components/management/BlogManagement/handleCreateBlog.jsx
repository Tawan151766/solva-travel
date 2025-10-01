const handleCreateBlog = async ({ formData, toast }) => {
  try {
    const response = await fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Failed to create blog");
    }

    toast?.({
      title: "Success",
      description: "Blog post created successfully.",
    });

    return data?.data?.blog || null;
  } catch (error) {
    console.error("Error creating blog:", error);
    toast?.({
      title: "Error",
      description: error.message || "Failed to create blog post.",
      variant: "destructive",
    });
    return null;
  }
};

export default handleCreateBlog;
