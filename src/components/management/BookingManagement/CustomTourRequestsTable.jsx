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

const CustomTourRequestsTable = ({
  requests,
  onViewRequest,
  onEditRequest,
  onDeleteRequest,
  renderStatusBadge,
}) => {
  return (
    <div className="border border-[#FFD700]/20 rounded-lg bg-black/60 backdrop-blur-xl shadow-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-[#FFD700]/20 bg-black/40">
            <TableHead className="text-[#FFD700] font-semibold">
              Tracking Number
            </TableHead>
            <TableHead className="text-[#FFD700] font-semibold">
              Customer
            </TableHead>
            <TableHead className="text-[#FFD700] font-semibold">
              Destination
            </TableHead>
            <TableHead className="text-[#FFD700] font-semibold">
              Travel Date
            </TableHead>
            <TableHead className="text-[#FFD700] font-semibold">
              Travelers
            </TableHead>
            <TableHead className="text-[#FFD700] font-semibold">
              Budget
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
          {requests.map((request) => (
            <TableRow
              key={request.id}
              className="border-[#FFD700]/10 hover:bg-[#FFD700]/5 transition-colors duration-200"
            >
              <TableCell className="font-mono text-sm text-white">
                {request.trackingNumber}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-white">
                    {request.contactName}
                  </div>
                  <div className="text-sm text-white/70">
                    {request.contactEmail}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-white">
                  {request.destination}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="text-sm text-white">
                    {new Date(request.startDate).toLocaleDateString()} -
                  </div>
                  <div className="text-sm text-white">
                    {new Date(request.endDate).toLocaleDateString()}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-white">
                {request.numberOfPeople}
              </TableCell>
              <TableCell className="font-medium text-[#FFD700]">
                THB{request.budget?.toLocaleString() || "N/A"}
              </TableCell>
              <TableCell>{renderStatusBadge(request.status)}</TableCell>
              <TableCell className="text-white">
                {new Date(request.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewRequest(request)}
                    className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditRequest(request)}
                    className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteRequest(request.id)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors duration-200"
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
  );
};

export default CustomTourRequestsTable;
