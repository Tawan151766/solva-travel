const handleUpdateRequest = async ({
  selectedRequest,
  editFormData,
  toast,
  fetchRequests,
  setIsEditModalOpen,
}) => {
  if (!selectedRequest) {
    return;
  }

  try {
    const response = await fetch(
      `/api/management/custom-tour-requests/${selectedRequest.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editFormData),
      }
    );

    if (response.ok) {
      toast({
        title: "Success",
        description: "Custom tour request updated successfully",
      });
      await fetchRequests();
      setIsEditModalOpen(false);
      return true;
    }

    const errorData = await response.json().catch(() => ({}));
    toast({
      title: "Error",
      description:
        errorData.message || "Failed to update custom tour request",
      variant: "destructive",
    });
    return false;
  } catch (error) {
    console.error("Error updating custom tour request:", error);
    toast({
      title: "Error",
      description: "Failed to update custom tour request",
      variant: "destructive",
    });
    return false;
  }
};

export default handleUpdateRequest;
