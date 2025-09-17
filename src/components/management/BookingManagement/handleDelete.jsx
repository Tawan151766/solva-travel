const handleDelete = async ({ requestId, toast, fetchRequests }) => {
  if (!requestId) {
    return false;
  }

  const isConfirmed = confirm(
    "Are you sure you want to delete this custom tour request?"
  );

  if (!isConfirmed) {
    return false;
  }

  try {
    const response = await fetch(
      `/api/management/custom-tour-requests/${requestId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.ok) {
      toast({
        title: "Success",
        description: "Custom tour request deleted successfully",
      });
      await fetchRequests();
      return true;
    }

    toast({
      title: "Error",
      description: "Failed to delete custom tour request",
      variant: "destructive",
    });
    return false;
  } catch (error) {
    console.error("Error deleting custom tour request:", error);
    toast({
      title: "Error",
      description: "Failed to delete custom tour request",
      variant: "destructive",
    });
    return false;
  }
};

export default handleDelete;
