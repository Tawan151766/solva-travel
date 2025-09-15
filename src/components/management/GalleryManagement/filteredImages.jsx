export function filterImages({ images, searchTerm, selectedCategory }) {
  return images.filter((image) => {
    const matchesSearch =
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "ALL" || image.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
}