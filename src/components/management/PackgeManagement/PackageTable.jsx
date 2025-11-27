"use client";

import { useEffect, useRef } from "react";
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
import { Pencil, Trash2, MapPin, Clock, Users, Tag } from "lucide-react";

const difficultyTone = {
  easy: "bg-emerald-600/20 text-emerald-200 border-emerald-400/30",
  moderate: "bg-blue-600/20 text-blue-200 border-blue-400/30",
  challenging: "bg-orange-600/20 text-orange-200 border-orange-400/30",
};

export function PackageTable({ packages, onEdit, onDelete }) {
  const scrollRef = useRef(null);

  const handleWheel = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.scrollWidth > el.clientWidth) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  };

  const emptyState = (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#FFD700]/30 bg-black/40 p-10 text-center text-white/70">
      <div className="mb-3 text-lg font-semibold text-white">No packages yet</div>
      <p className="max-w-lg text-sm text-white/60">
        Create your first package to showcase destinations, prices and itineraries. Use the button above to get started.
      </p>
    </div>
  );

  if (!packages || packages.length === 0) {
    return emptyState;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#FFD700]/20 bg-black/60 shadow-xl backdrop-blur-xl">
      <div
        ref={scrollRef}
        onWheelCapture={handleWheel}
        className="overflow-x-auto"
        style={{ overscrollBehaviorX: "contain" }}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-[#FFD700]/20 bg-black/40">
              <TableHead className="text-[#FFD700] font-semibold">Package</TableHead>
              <TableHead className="text-[#FFD700] font-semibold">Destination</TableHead>
              <TableHead className="text-[#FFD700] font-semibold">Duration</TableHead>
              <TableHead className="text-[#FFD700] font-semibold">Price</TableHead>
              <TableHead className="text-[#FFD700] font-semibold">Max Guests</TableHead>
              <TableHead className="text-[#FFD700] font-semibold">Difficulty</TableHead>
              <TableHead className="text-[#FFD700] font-semibold">Status</TableHead>
              <TableHead className="text-[#FFD700] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => {
              const durationText = pkg.duration || (pkg.durationDays ? `${pkg.durationDays} days` : "-");
              const priceNumber = pkg.priceNumber ?? (pkg.price ? parseFloat(pkg.price) : undefined);
              const priceText = priceNumber ? `THB ${priceNumber.toLocaleString()}` : pkg.price || "-";
              const maxGuests = pkg.maxCapacity || pkg.maxParticipants || "-";
              const difficulty = (pkg.difficulty || "unknown").toLowerCase();
              const tags = Array.isArray(pkg.tags) ? pkg.tags.slice(0, 2) : [];

              return (
                <TableRow
                  key={pkg.id}
                  className="border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors duration-200"
                >
                  <TableCell className="font-medium text-white">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold">{pkg.title || pkg.name}</span>
                        {pkg.isRecommended && (
                          <Badge className="bg-emerald-600/20 text-emerald-200 border border-emerald-400/30">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-white/70 truncate max-w-xs">{pkg.description || "-"}</div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="border border-black/40 bg-white text-black">
                              <Tag className="mr-1 h-3 w-3 text-black" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-white/90">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-[#FFD700]" />
                      {pkg.destination || pkg.location || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-white/90">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-[#FFD700]" />
                      {durationText}
                    </div>
                  </TableCell>
                  <TableCell className="text-white/90">{priceText}</TableCell>
                  <TableCell className="text-white/90">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-[#FFD700]" />
                      {maxGuests}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border ${
                        difficultyTone[difficulty] || "bg-slate-600/20 text-slate-200 border-slate-400/30"
                      }`}
                    >
                      {pkg.difficulty || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`border ${
                        pkg.isActive
                          ? "bg-emerald-600/20 text-emerald-200 border-emerald-400/30"
                          : "bg-slate-700/40 text-slate-200 border-slate-400/30"
                      }`}
                    >
                      {pkg.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(pkg)}
                        className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/15"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/15"
                        onClick={() => onDelete(pkg.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
