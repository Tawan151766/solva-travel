import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

const BlogFilters = ({
  searchTerm,
  onSearchChange,
  publishedFilter,
  onPublishedFilterChange,
  publishedOptions,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#FFD700]" />
        <Input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search blog posts..."
          className="pl-10 bg-black/60 border-[#FFD700]/20 text-white placeholder:text-white/50 backdrop-blur-xl"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg bg-black/40 border border-[#FFD700]/20 text-[#FFD700]">
          <Filter className="h-4 w-4" /> Status
        </span>
        <Select value={publishedFilter} onValueChange={onPublishedFilterChange}>
          <SelectTrigger className="w-56 min-w-[15rem] bg-black/60 border-[#FFD700]/20 text-white backdrop-blur-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="min-w-[15rem] bg-black/95 border-[#FFD700]/20 backdrop-blur-xl text-white">
            {publishedOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-white hover:bg-[#FFD700]/20"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BlogFilters;
