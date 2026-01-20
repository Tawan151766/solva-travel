const handleUpdateBlog = async ({ formData, toast }) => {
  try {
    const { id, ...payload } = formData;
    let response, data;
    // ถ้ามีไฟล์รูป ส่งแบบ multipart/form-data
    if (formData.imageFile) {
      const form = new FormData();
      form.append("id", id);
      form.append("title", payload.title);
      form.append("content", payload.content);
      form.append("published", payload.published);
      form.append("authorId", payload.authorId);
      form.append("image", formData.imageFile);

      response = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: form,
      });
    } else {
      response = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ id, ...payload }),
      });
    }

    data = await response.json().catch(() => null);

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
