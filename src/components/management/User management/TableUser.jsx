"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Clock } from "lucide-react";

const formatLastLogin = (lastLoginAt) => {
  if (!lastLoginAt) return "Never";
  
  const date = new Date(lastLoginAt);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks}w ago`;
  } else {
    return date.toLocaleDateString("en-US");
  }
};

export default function TableUser({ users = [], onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-[#FFD700]/20 bg-black/40 hover:bg-black/40">
            <TableHead className="text-[#FFD700] font-semibold text-center w-32">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                Last Login
              </div>
            </TableHead>
            <TableHead className="text-[#FFD700] font-semibold">Name</TableHead>
            <TableHead className="text-[#FFD700] font-semibold">Email</TableHead>
            <TableHead className="text-[#FFD700] font-semibold">Phone</TableHead>
            <TableHead className="text-[#FFD700] font-semibold">Role</TableHead>
            <TableHead className="text-[#FFD700] font-semibold">Status</TableHead>
            <TableHead className="text-[#FFD700] font-semibold">Created</TableHead>
            <TableHead className="text-[#FFD700] font-semibold text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow className="border-[#FFD700]/10">
              <TableCell colSpan="8" className="text-center py-8 text-white/70">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.id}
                className="border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors duration-200"
              >
                <TableCell className="text-center text-white/80 text-sm font-medium">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3 text-[#FFD700]/70" />
                    {formatLastLogin(user.lastLoginAt)}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-white">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell className="text-white/80">{user.email}</TableCell>
                <TableCell className="text-white/80">{user.phone || "-"}</TableCell>
                <TableCell>
                  <Badge
                    className="text-sm px-3 py-1.5 font-medium rounded-lg"
                    variant={
                      user.role === "ADMIN"
                        ? "destructive"
                        : user.role === "OPERATOR"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {user.role === "ADMIN"
                      ? "Admin"
                      : user.role === "OPERATOR"
                      ? "Operator"
                      : user.role === "STAFF"
                      ? "Staff"
                      : "User"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className="text-sm px-3 py-1.5 font-medium rounded-lg"
                    variant={user.isActive ? "default" : "secondary"}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-white/80 text-sm">
                  {new Date(user.createdAt).toLocaleDateString("th-TH")}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit?.(user)}
                      className="border-[#FFD700]/40 text-[#FFD700] hover:bg-[#FFD700]/20 hover:border-[#FFD700]/60 px-4 py-2 transition-all duration-200 font-medium text-sm"
                      title="Edit User"
                    >
                      <Pencil className="h-4 w-4 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/40 text-red-400 hover:bg-red-500/20 hover:border-red-500/60 px-4 py-2 transition-all duration-200 font-medium text-sm"
                      onClick={() => onDelete?.(user.id)}
                      disabled={user.role === "ADMIN"}
                      title={user.role === "ADMIN" ? "Cannot delete admin user" : "Delete User"}
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

