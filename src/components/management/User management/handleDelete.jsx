export async function handleDelete({ userId, toast, onSuccess }) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const response = await fetch(`/api/management/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      toast?.({
        title: "Success",
        description: "User deleted successfully",
      });
      onSuccess?.();
    } else {
      toast?.({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    toast?.({
      title: "Error",
      description: "Failed to delete user",
      variant: "destructive",
    });
  }
}

