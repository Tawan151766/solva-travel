export async function fetchCustomTourRequests(setCustomTourRequests) {
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
        } else {
            toast({
                title: "Error",
                description: "Failed to fetch custom tour requests",
                variant: "destructive",
            });
        }
    } catch (error) {
        console.error("Error fetching custom tour requests:", error);
        toast({
            title: "Error",
            description: "Failed to fetch custom tour requests",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
};