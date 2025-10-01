const fetchCustomTourRequests = async ({
  setCustomTourRequests,
  setLoading,
  toast,
}) => {
  try {
    setLoading(true);
    const response = await fetch("/api/management/custom-tour-requests", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setCustomTourRequests(data.data);
      return data.data;
    }

    toast({
      title: "Error",
      description: "Failed to fetch custom tour requests",
      variant: "destructive",
    });
    return [];
  } catch (error) {
    console.error("Error fetching custom tour requests:", error);
    toast({
      title: "Error",
      description: "Failed to fetch custom tour requests",
      variant: "destructive",
    });
    return [];
  } finally {
    setLoading(false);
  }
};

export default fetchCustomTourRequests;
