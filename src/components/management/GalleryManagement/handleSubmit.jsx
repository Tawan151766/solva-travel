export async function handleSubmit({
  e,
  formData,
  selectedImage,
  fetchImages,
  handleCloseModal,
}) {
  e.preventDefault();

  try {
    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags: tagsArray,
    };

    const url = selectedImage ? `/api/gallery/${selectedImage.id}` : "/api/gallery";
    const method = selectedImage ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      await fetchImages();
      handleCloseModal();
      alert(selectedImage ? "อัปเดตรูปภาพเรียบร้อยแล้ว" : "เพิ่มรูปภาพเรียบร้อยแล้ว");
    } else {
      const error = await response.json();
      alert(error.message || "เกิดข้อผิดพลาด");
    }
  } catch (error) {
    console.error("Error saving image:", error);
    alert("เกิดข้อผิดพลาดในการบันทึก");
  }
}
