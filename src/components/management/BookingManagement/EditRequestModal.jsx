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
      
      <DialogContent className="max-w-md bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 backdrop-blur-xl border border-[#FFD700]/30 shadow-2xl shadow-[#FFD700]/20 p-6">
        <DialogHeader>
          
          <DialogTitle className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-transparent">
              Edit Custom Tour Request
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div>
            
            <Label htmlFor="status" className="text-white font-bold text-sm">
              Status
            </Label>
            <div className="mt-2">
              <Select
                value={editFormData.status}
                onValueChange={(value) =>
                  setEditFormData({ ...editFormData, status: value })
                }
              >
                
                <SelectTrigger className="bg-black/50 border-[#FFD700]/20 text-white focus:ring-[#FFD700]/50">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#FFD700]/20 text-white">
                  {statusOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="focus:bg-[#FFD700]/20 focus:text-white cursor-pointer"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="estimatedCost" className="text-white font-bold text-sm">
              Estimated Cost (THB)
            </Label>
            <div className="mt-2">
              
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
                className="bg-black/50 border-[#FFD700]/20 text-white placeholder:text-gray-500 focus:border-[#FFD700]/50 focus:ring-[#FFD700]/20"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="responseNotes" className="text-white font-bold text-sm">
              Response Notes
            </Label>
            <div className="mt-2">
              
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
                className="w-full px-3 py-2 bg-black/50 border border-[#FFD700]/20 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="bg-[#FFD700] text-black hover:bg-[#FFED4E] font-semibold"
            >
              Cancel
            </Button>
            
            <Button 
              onClick={onSubmit}
              className="bg-[#FFD700] text-black hover:bg-[#FFED4E] font-semibold"
            >
              Update Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditRequestModal;