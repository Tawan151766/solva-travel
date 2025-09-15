export async function fetchUsers({ setLoading, setUsers, toast }) {
  try {
    setLoading(true);
    const response = await fetch("/api/management/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUsers(data.data);
    } else {
      toast?.({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    toast?.({
      title: "Error",
      description: "Failed to fetch users",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
}

