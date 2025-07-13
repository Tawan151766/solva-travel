"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

export function PackageSearchHeader({ searchTerm, onSearchChange, onCreateClick }) {
  return (
    <div className="flex justify-between items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#FFD700]" />
        <Input
          placeholder="Search packages..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-black/60 border-[#FFD700]/20 text-white placeholder:text-white/50 backdrop-blur-xl"
        />
      </div>
      <Button
        className="flex items-center gap-2 bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-medium"
        onClick={onCreateClick}
      >
        <Plus className="h-4 w-4" />
        Create Package
      </Button>
    </div>
  );
}
