"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pencil,
  Trash2,
  MapPin,
  Clock,
  Users,
} from "lucide-react";

export function PackageTable({ packages, onEdit, onDelete }) {
  return (
    <div className="border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl shadow-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-[#FFD700]/20 bg-black/40">
            <TableHead className="text-[#FFD700] font-semibold">
              Package
            </TableHead>
            <TableHead className="text-[#FFD700] font-semibold">
              Destination
            </TableHead>
            <TableHead className="text-[#FFD700] font-semibold">
              Duration
            </TableHead>
            <TableHead className="text-[#FFD700] font-semibold">
              Price
            </TableHead>
            <TableHead className="text-[#FFD700] font-semibold">
              Max Guests
            </TableHead>
            <TableHead className="text-[#FFD700] font-semibold">
              Difficulty
            </TableHead>
            <TableHead className="text-[#FFD700] font-semibold">
              Status
            </TableHead>
            <TableHead className="text-[#FFD700] font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-white/70 py-8"
              >
                No packages found. Create your first package to get started.
              </TableCell>
            </TableRow>
          ) : (
            packages.map((pkg) => (
              <TableRow
                key={pkg.id}
                className="border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors duration-200"
              >
                <TableCell className="font-medium text-white">
                  <div>
                    <div className="font-semibold">{pkg.title}</div>
                    <div className="text-sm text-white/70 truncate max-w-xs">
                      {pkg.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-white/90">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-[#FFD700]" />
                    {pkg.destination}
                  </div>
                </TableCell>
                <TableCell className="text-white/90">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-[#FFD700]" />
                    {pkg.duration || `${pkg.durationDays} วัน`}
                  </div>
                </TableCell>
                <TableCell className="text-white/90">
                  ฿{pkg.price?.toLocaleString() || pkg.priceNumber?.toLocaleString()}
                </TableCell>
                <TableCell className="text-white/90">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-[#FFD700]" />
                    {pkg.maxCapacity || pkg.maxParticipants}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      pkg.difficulty === "Easy"
                        ? "default"
                        : pkg.difficulty === "Moderate"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {pkg.difficulty}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={pkg.isActive ? "default" : "secondary"}>
                    {pkg.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(pkg)}
                      className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors duration-200"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors duration-200"
                      onClick={() => onDelete(pkg.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
