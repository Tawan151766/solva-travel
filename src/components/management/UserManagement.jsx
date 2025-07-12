"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Removed Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
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
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
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
  };

  const handleCreate = () => {
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
  };

  const handleSubmit = async (isEdit = false) => {
    try {
      const url = isEdit
        ? `/api/management/users/${selectedUser.id}`
        : "/api/management/users";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${isEdit ? "updated" : "created"} successfully`,
        });
        fetchUsers();
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.message ||
            `Failed to ${isEdit ? "update" : "create"} user`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "create"} user`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/management/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        fetchUsers();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const UserForm = ({ isEdit }) => (
    <form className="space-y-5">
      {/* ...form fields as before... */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            ชื่อจริง
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder="กรอกชื่อจริง"
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
          />
        </div>
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            นามสกุล
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            placeholder="กรอกนามสกุล"
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-[#FFD700] text-sm font-medium mb-2">
          อีเมล
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="กรอกอีเมล"
          className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
        />
      </div>

      <div>
        <label className="block text-[#FFD700] text-sm font-medium mb-2">
          หมายเลขโทรศัพท์
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="กรอกหมายเลขโทรศัพท์"
          className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
        />
      </div>

      {!isEdit && (
        <div>
          <label className="block text-[#FFD700] text-sm font-medium mb-2">
            รหัสผ่าน
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="กรอกรหัสผ่าน"
            className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
          />
        </div>
      )}

      <div>
        <label className="block text-[#FFD700] text-sm font-medium mb-2">
          บทบาท
        </label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full px-4 py-3 bg-black/50 border border-[#FFD700]/30 rounded-xl text-white focus:outline-none focus:border-[#FFD700] focus:bg-black/70 transition-all"
        >
          <option value="USER" className="bg-black text-white">
            ผู้ใช้ทั่วไป
          </option>
          <option value="STAFF" className="bg-black text-white">
            พนักงาน
          </option>
          <option value="OPERATOR" className="bg-black text-white">
            ผู้ดำเนินการ
          </option>
          <option value="ADMIN" className="bg-black text-white">
            ผู้ดูแลระบบ
          </option>
        </select>
      </div>

      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData({ ...formData, isActive: e.target.checked })
          }
          className="mt-1 w-4 h-4 text-[#FFD700] bg-black/50 border-[#FFD700]/30 rounded focus:ring-[#FFD700] focus:ring-2"
        />
        <label className="text-white/80 text-sm">เปิดใช้งานบัญชี</label>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={() => {
            setIsEditModalOpen(false);
            setIsCreateModalOpen(false);
            setSelectedUser(null);
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              role: "USER",
              isActive: true,
              password: "",
            });
          }}
          className="flex-1 py-3 bg-black/50 border border-[#FFD700]/30 text-[#FFD700] font-medium rounded-xl hover:bg-[#FFD700]/10 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all"
        >
          ยกเลิก
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(isEdit)}
          className="flex-1 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black font-semibold rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 transition-all"
        >
          {isEdit ? "อัปเดต" : "สร้าง"}ผู้ใช้
        </button>
      </div>
    </form>
  );

  // Modal component using div
  const Modal = ({ open, onClose, title, subtitle, children }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        {/* Modal Container */}
        <div className="relative z-10 w-full max-w-md mx-4">
          {/* Luxury Background */}
          <div className="relative bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 backdrop-blur-xl rounded-3xl border border-[#FFD700]/20 shadow-2xl shadow-black/50 overflow-hidden">
            {/* Premium Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5"></div>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 bg-gradient-to-br from-[#FFD700]/20 to-[#FFED4E]/20 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 border border-[#FFD700]/30"
            >
              <svg
                className="w-4 h-4 text-[#FFD700]"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
              </svg>
            </button>
            {/* Content */}
            <div className="relative p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent mb-2">
                  {title}
                </h2>
                <p className="text-white/70 text-sm">{subtitle}</p>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8 text-white">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with search and create button */}
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

      {/* Users Table */}
      <div className="border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl shadow-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#FFD700]/20 bg-black/40">
              <TableHead className="text-[#FFD700] font-semibold">
                Name
              </TableHead>
              <TableHead className="text-[#FFD700] font-semibold">
                Email
              </TableHead>
              <TableHead className="text-[#FFD700] font-semibold">
                Phone
              </TableHead>
              <TableHead className="text-[#FFD700] font-semibold">
                Role
              </TableHead>
              <TableHead className="text-[#FFD700] font-semibold">
                Status
              </TableHead>
              <TableHead className="text-[#FFD700] font-semibold">
                Created
              </TableHead>
              <TableHead className="text-[#FFD700] font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                className="border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors duration-200"
              >
                <TableCell className="font-medium text-white">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell className="text-white/90">{user.email}</TableCell>
                <TableCell className="text-white/90">{user.phone}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "ADMIN"
                        ? "destructive"
                        : user.role === "OPERATOR"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-white/90">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors duration-200"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors duration-200"
                      onClick={() => handleDelete(user.id)}
                      disabled={user.role === "ADMIN"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Modal */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="สร้างผู้ใช้ใหม่"
        subtitle="เพิ่มผู้ใช้งานใหม่เข้าสู่ระบบ"
      >
        <UserForm isEdit={false} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="แก้ไขผู้ใช้งาน"
        subtitle="อัปเดตข้อมูลผู้ใช้งาน"
      >
        <UserForm isEdit={true} />
      </Modal>
    </div>
  );
}
