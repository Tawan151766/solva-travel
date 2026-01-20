const handleCreateBlog = async ({ formData, toast }) => {
  try {
    let response, data;
    // ถ้ามีไฟล์รูป ส่งแบบ multipart/form-data
    if (formData.imageFile) {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("content", formData.content);
      form.append("published", formData.published);
      form.append("authorId", formData.authorId);
      form.append("image", formData.imageFile);

      response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: form,
      });
    } else {
      response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(formData),
      });
    }

    data = await response.json().catch(() => null);

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
