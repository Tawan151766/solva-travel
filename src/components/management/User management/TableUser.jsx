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
import { Pencil, Trash2 } from "lucide-react";

export default function TableUser({ users = [], onEdit, onDelete }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-[#FFD700]/20 bg-black/40">
          <TableHead className="text-[#FFD700] font-semibold">Name</TableHead>
          <TableHead className="text-[#FFD700] font-semibold">Email</TableHead>
          <TableHead className="text-[#FFD700] font-semibold">Phone</TableHead>
          <TableHead className="text-[#FFD700] font-semibold">Role</TableHead>
          <TableHead className="text-[#FFD700] font-semibold">Status</TableHead>
          <TableHead className="text-[#FFD700] font-semibold">Created</TableHead>
          <TableHead className="text-[#FFD700] font-semibold">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
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
                  onClick={() => onEdit?.(user)}
                  className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors duration-200"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors duration-200"
                  onClick={() => onDelete?.(user.id)}
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
  );
}

