export function handleEdit({
  user,
  setSelectedUser,
  setFormData,
  setIsEditModalOpen,
}) {
  setSelectedUser(user);
  setFormData({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    password: "",
  });
  setIsEditModalOpen(true);
}

