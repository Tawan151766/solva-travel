import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, Trash2 } from "lucide-react";

const BlogTable = ({ blogs, onView, onEdit, onDelete }) => {
  if (!blogs?.length) {
    return (
      <div className="border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl p-12 text-center text-white/70">
        No blog posts found.
      </div>
    );
  }

  return (
    <div className="border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl shadow-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-[#FFD700]/20 bg-black/40">
            <TableHead className="text-[#FFD700] font-semibold">Title</TableHead>
            <TableHead className="text-[#FFD700] font-semibold">Excerpt</TableHead>
            <TableHead className="text-[#FFD700] font-semibold">Author</TableHead>
            <TableHead className="text-[#FFD700] font-semibold">Status</TableHead>
            <TableHead className="text-[#FFD700] font-semibold">Created</TableHead>
            <TableHead className="text-[#FFD700] font-semibold">Updated</TableHead>
            <TableHead className="text-[#FFD700] font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {blogs.map((blog) => {
            const createdAt = blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString()
              : "-";
            const updatedAt = blog.updatedAt
              ? new Date(blog.updatedAt).toLocaleDateString()
              : "-";

            const statusClasses = blog.published
              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30"
              : "bg-yellow-500/10 text-yellow-300 border border-yellow-400/30";

            return (
              <TableRow
                key={blog.id}
                className="border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors duration-200"
              >
                <TableCell className="text-white font-medium">
                  {blog.title}
                </TableCell>

                <TableCell className="text-white/70 text-sm">
                  <p className="line-clamp-2 leading-relaxed">
                    {blog.content || "No content provided."}
                  </p>
                </TableCell>

                <TableCell className="text-white text-sm">
                  {blog.authorName || "-"}
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusClasses}`}
                  >
                    {blog.published ? "PUBLISHED" : "UNPUBLISHED"}
                  </span>
                </TableCell>

                <TableCell className="text-white text-sm">{createdAt}</TableCell>
                <TableCell className="text-white text-sm">{updatedAt}</TableCell>

                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(blog)}
                      className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(blog)}
                      className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(blog.id)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogTable;
