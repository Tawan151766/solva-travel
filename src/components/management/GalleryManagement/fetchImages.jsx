export async function fetchImages({ setImages, setLoading }) {
  try {
    setLoading(true);
    const response = await fetch("/api/gallery?limit=100&showAll=true", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setImages(data.data?.images || []);
    }
  } catch (error) {
    console.error("Error fetching images:", error);
  } finally {
    setLoading(false);
  }
}
