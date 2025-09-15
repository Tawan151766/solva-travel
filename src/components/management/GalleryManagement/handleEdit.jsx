export function handleEdit({ image, setSelectedImage, setFormData, setShowEditModal }) {
  setSelectedImage(image);
  setFormData({
    title: image.title,
    description: image.description || "",
    imageUrl: image.imageUrl,
    category: image.category,
    location: image.location,
    tags: image.tags?.join(", ") || "",
    isActive: image.isActive,
  });
  setShowEditModal(true);
}