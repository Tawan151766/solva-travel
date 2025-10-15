export async function handleDelete({ imageId, refresh }) {
  if (!confirm("คุณแน่ใจหรือไม่ที่จะลบรูปภาพนี้?")) return;

  try {
    const response = await fetch(`/api/gallery/${imageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      await refresh(); 
      alert("ลบรูปภาพเรียบร้อยแล้ว");
    } else {
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    alert("เกิดข้อผิดพลาดในการลบ");
  }
}