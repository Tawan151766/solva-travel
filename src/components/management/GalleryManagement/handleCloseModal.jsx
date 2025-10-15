export function handleCloseModal({ setShowAddModal, setShowEditModal, setSelectedImage, setFormData }) {
   setShowAddModal(false);
        setShowEditModal(false);
        setSelectedImage(null);
        setFormData({
            title: "",
            description: "",
            imageUrl: "",
            category: "BEACH",
            location: "",
            tags: "",
            isActive: true
        });
    };