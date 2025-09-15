"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { fetchUsers as fetchUsersAction } from "./fetchUsers.jsx";
import { handleEdit as handleEditAction } from "./handleEdit.jsx";
import { handleCreate as handleCreateAction } from "./handleCreate.jsx";
import { handleSubmit as handleSubmitAction } from "./handleSubmit.jsx";
import { handleDelete as handleDeleteAction } from "./handleDelete.jsx";
import { filterUsers } from "./filterUsers.jsx";
import UserForm from "./UserForm";
import Modal from "./Modal";
import TableUser from "./TableUser";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "USER",
    isActive: true,
    password: "",
  });

  const fetchUsers = async () =>
    fetchUsersAction({ setLoading, setUsers, toast });

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) =>
    handleEditAction({
      user,
      setSelectedUser,
      setFormData,
      setIsEditModalOpen,
    });

  const handleCreate = () =>
    handleCreateAction({ setFormData, setIsCreateModalOpen });

  const handleSubmit = async (isEdit = false) =>
    handleSubmitAction({
      isEdit,
      selectedUser,
      formData,
      toast,
      onSuccess: () => {
        fetchUsers();
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
      },
    });

  const handleDelete = async (userId) =>
    handleDeleteAction({
      userId,
      toast,
      onSuccess: () => fetchUsers(),
    });

  const filteredUsers = filterUsers(users, searchTerm);

  if (loading) {
    return <div className="text-center py-8 text-white">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#FFD700]" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
          />
        </div>
        <Button
          className="flex items-center gap-2 bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-medium"
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4" />
          Create User
        </Button>
      </div>

      <div className="border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl shadow-xl overflow-hidden">
        <TableUser users={filteredUsers} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create User"
        subtitle="Fill out the form to create a new user"
      >
        <UserForm
          isEdit={false}
          formData={formData}
          setFormData={setFormData}
          setIsEditModalOpen={setIsEditModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
          onSubmit={(isEdit) => handleSubmit(isEdit)}
        />
      </Modal>

      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        subtitle="Update the selected user's details"
      >
        <UserForm
          isEdit={true}
          formData={formData}
          setFormData={setFormData}
          setIsEditModalOpen={setIsEditModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
          onSubmit={(isEdit) => handleSubmit(isEdit)}
        />
      </Modal>
    </div>
  );
}
