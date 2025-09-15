export async function handleSubmit({
  isEdit = false,
  selectedUser,
  formData,
  toast,
  onSuccess,
}) {
  try {
    const url = isEdit
      ? `/api/management/users/${selectedUser.id}`
      : "/api/management/users";
    const method = isEdit ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      toast?.({
        title: "Success",
        description: `User ${isEdit ? "updated" : "created"} successfully`,
      });
      onSuccess?.();
    } else {
      const errorData = await response.json();
      toast?.({
        title: "Error",
        description:
          errorData.message || `Failed to ${isEdit ? "update" : "create"} user`,
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    toast?.({
      title: "Error",
      description: `Failed to ${isEdit ? "update" : "create"} user`,
      variant: "destructive",
    });
  }
}

