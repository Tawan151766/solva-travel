export async function handleToggleActive({ imageId, currentStatus, refresh }) {
  try {
    const response = await fetch(`/api/gallery/${imageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ isActive: !currentStatus }),
    });

    if (response.ok) {
      await refresh(); 
    }
  } catch (error) {
    console.error("Error toggling status:", error);
  }
}