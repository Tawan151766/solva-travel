"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "USER",
      isActive: true,
      password: "",
    });
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

  const handleSubmit = async (isEdit) => {
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
        resetForm();
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
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-[#FFD700] font-medium">
            ชื่อ
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder="กรอกชื่อ"
            className="h-11 bg-gradient-to-r from-black/60 via-[#0a0804]/60 to-black/60 border-[#FFD700]/30 text-white placeholder:text-white/60 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/20 rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-[#FFD700] font-medium">
            นามสกุล
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            placeholder="กรอกนามสกุล"
            className="h-11 bg-gradient-to-r from-black/60 via-[#0a0804]/60 to-black/60 border-[#FFD700]/30 text-white placeholder:text-white/60 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/20 rounded-lg"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#FFD700] font-medium">
          อีเมล
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="กรอกอีเมล"
          className="h-11 bg-gradient-to-r from-black/60 via-[#0a0804]/60 to-black/60 border-[#FFD700]/30 text-white placeholder:text-white/60 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/20 rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-[#FFD700] font-medium">
          เบอร์โทรศัพท์
        </Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="กรอกเบอร์โทรศัพท์"
          className="h-11 bg-gradient-to-r from-black/60 via-[#0a0804]/60 to-black/60 border-[#FFD700]/30 text-white placeholder:text-white/60 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/20 rounded-lg"
        />
      </div>

      {!isEdit && (
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#FFD700] font-medium">
            รหัสผ่าน
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="กรอกรหัสผ่าน"
            className="h-11 bg-gradient-to-r from-black/60 via-[#0a0804]/60 to-black/60 border-[#FFD700]/30 text-white placeholder:text-white/60 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/20 rounded-lg"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="role" className="text-[#FFD700] font-medium">
          บทบาท
        </Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger className="h-11 bg-gradient-to-r from-black/60 via-[#0a0804]/60 to-black/60 border-[#FFD700]/30 text-white rounded-lg">
            <SelectValue placeholder="เลือกบทบาท" />
          </SelectTrigger>
          <SelectContent className="bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 border-[#FFD700]/30 backdrop-blur-xl">
            <SelectItem
              value="USER"
              className="text-white hover:bg-[#FFD700]/20 focus:bg-[#FFD700]/20"
            >
              ผู้ใช้งาน
            </SelectItem>
            <SelectItem
              value="STAFF"
              className="text-white hover:bg-[#FFD700]/20 focus:bg-[#FFD700]/20"
            >
              พนักงาน
            </SelectItem>
            <SelectItem
              value="OPERATOR"
              className="text-white hover:bg-[#FFD700]/20 focus:bg-[#FFD700]/20"
            >
              ผู้ดำเนินการ
            </SelectItem>
            <SelectItem
              value="ADMIN"
              className="text-white hover:bg-[#FFD700]/20 focus:bg-[#FFD700]/20"
            >
              ผู้ดูแลระบบ
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-[#FFD700]/10 via-transparent to-[#FFD700]/10 border border-[#FFD700]/20">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData({ ...formData, isActive: e.target.checked })
          }
          className="w-4 h-4 rounded accent-[#FFD700] bg-black/50 border-[#FFD700]/30"
        />
        <Label
          htmlFor="isActive"
          className="text-[#FFD700] font-medium cursor-pointer"
        >
          เปิดใช้งาน
        </Label>
      </div>

      <DialogFooter className="gap-3 pt-6">
        <DialogClose asChild>
          <Button
            variant="outline"
            className="px-6 py-3 border-[#FFD700]/40 text-[#FFD700] hover:bg-[#FFD700]/20 hover:border-[#FFD700]/60 transition-all duration-300 rounded-lg"
          >
            ยกเลิก
          </Button>
        </DialogClose>
        <Button
          onClick={() => handleSubmit(isEdit)}
          className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-semibold hover:from-[#FFA500] hover:to-[#FFD700] transition-all duration-300 shadow-lg shadow-[#FFD700]/20 rounded-lg"
        >
          {isEdit ? "อัปเดต" : "สร้าง"}ผู้ใช้งาน
        </Button>
      </DialogFooter>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700]"></div>
        <span className="ml-3 text-white/80">กำลังโหลดข้อมูลผู้ใช้งาน...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Header with search and create button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#FFD700]/60" />
          <Input
            placeholder="ค้นหาผู้ใช้งาน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-gradient-to-r from-black/60 via-[#0a0804]/60 to-black/60 border-[#FFD700]/30 text-white placeholder:text-white/60 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/20 backdrop-blur-sm rounded-xl"
          />
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-3 px-6 py-3 h-12 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-semibold hover:from-[#FFA500] hover:to-[#FFD700] transition-all duration-300 shadow-lg shadow-[#FFD700]/20 rounded-xl">
              <Plus className="h-5 w-5" />
              สร้างผู้ใช้งานใหม่
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl border border-[#FFD700]/30 rounded-xl p-6 bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Gradient background layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 via-transparent to-[#FFD700]/10 opacity-60 pointer-events-none rounded-xl" />

            <div className="relative z-10 space-y-6">
              {/* Header */}
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent">
                  สร้างผู้ใช้งานใหม่
                </DialogTitle>
                <p className="text-[#cdc08e] text-sm">
                  กรอกข้อมูลเพื่อเพิ่มบัญชีผู้ใช้งานใหม่เข้าสู่ระบบ
                </p>
              </DialogHeader>

              {/* แบบฟอร์มสร้างผู้ใช้งาน */}
              <UserForm isEdit={false} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Premium Users Table */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 via-transparent to-[#FFD700]/5 opacity-50 rounded-xl"></div>
        <div className="relative border border-[#FFD700]/30 rounded-xl bg-gradient-to-br from-black/60 via-[#0a0804]/60 to-black/60 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-[#FFD700]/20 bg-gradient-to-r from-[#FFD700]/10 via-transparent to-[#FFD700]/10">
                <TableHead className="text-[#FFD700] font-semibold py-4">
                  ชื่อ
                </TableHead>
                <TableHead className="text-[#FFD700] font-semibold py-4">
                  อีเมล
                </TableHead>
                <TableHead className="text-[#FFD700] font-semibold py-4">
                  เบอร์โทร
                </TableHead>
                <TableHead className="text-[#FFD700] font-semibold py-4">
                  บทบาท
                </TableHead>
                <TableHead className="text-[#FFD700] font-semibold py-4">
                  สถานะ
                </TableHead>
                <TableHead className="text-[#FFD700] font-semibold py-4">
                  วันที่สร้าง
                </TableHead>
                <TableHead className="text-[#FFD700] font-semibold py-4 text-center">
                  การจัดการ
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-[#FFD700]/10 hover:bg-gradient-to-r hover:from-[#FFD700]/5 hover:to-transparent transition-all duration-300 group"
                >
                  <TableCell className="font-medium text-white/90 py-4">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell className="text-white/80 py-4">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-white/80 py-4">
                    {user.phone}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant={
                        user.role === "ADMIN"
                          ? "destructive"
                          : user.role === "OPERATOR"
                          ? "default"
                          : "secondary"
                      }
                      className={`${
                        user.role === "ADMIN"
                          ? "bg-red-500/20 text-red-300 border-red-500/30"
                          : user.role === "OPERATOR"
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                          : "bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30"
                      } px-3 py-1`}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant={user.isActive ? "default" : "secondary"}
                      className={`${
                        user.isActive
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      } px-3 py-1`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/80 py-4">
                    {new Date(user.createdAt).toLocaleDateString("th-TH")}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="border-[#FFD700]/40 text-[#FFD700] hover:bg-[#FFD700]/20 hover:border-[#FFD700]/60 transition-all duration-300 h-9 w-9 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/40 text-red-400 hover:bg-red-500/20 hover:border-red-500/60 transition-all duration-300 h-9 w-9 p-0"
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
      </div>

      {/* Premium Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 border border-[#FFD700]/30 backdrop-blur-xl shadow-2xl shadow-black/50 rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 via-transparent to-[#FFD700]/5 opacity-50 rounded-xl"></div>
          <div className="relative">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent">
                แก้ไขข้อมูลผู้ใช้งาน
              </DialogTitle>
            </DialogHeader>
            <UserForm isEdit={true} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
