export function handleCreate({ setFormData, setIsCreateModalOpen }) {
  setFormData({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "USER",
    isActive: true,
    password: "",
  });
  setIsCreateModalOpen(true);
}

