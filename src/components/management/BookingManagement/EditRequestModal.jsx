import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const EditRequestModal = ({
  isOpen,
  onOpenChange,
  statusOptions,
  editFormData,
  setEditFormData,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-black/95 backdrop-blur-xl border border-[#FFD700]/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle>Edit Custom Tour Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={editFormData.status}
              onValueChange={(value) =>
                setEditFormData({ ...editFormData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="estimatedCost">Estimated Cost (THB)</Label>
            <Input
              id="estimatedCost"
              type="number"
              value={editFormData.estimatedCost}
              onChange={(event) =>
                setEditFormData({
                  ...editFormData,
                  estimatedCost: event.target.value,
                })
              }
              placeholder="Enter estimated cost..."
            />
          </div>

          <div>
            <Label htmlFor="responseNotes">Response Notes</Label>
            <textarea
              id="responseNotes"
              value={editFormData.responseNotes}
              onChange={(event) =>
                setEditFormData({
                  ...editFormData,
                  responseNotes: event.target.value,
                })
              }
              placeholder="Add notes about this request..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit}>Update Request</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditRequestModal;
