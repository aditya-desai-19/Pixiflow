import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"
import CropMenu from "./crop-menu"
import CropPreview from "./crop-preview"

interface CropDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CropDialog({ open, onOpenChange }: CropDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[calc(100vh-120px)] md:min-h-[80vh] w-[80vw] max-w-none! p-0! m-0! overflow-hidden">
        <DialogHeader className="px-4 py-2">
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1">
          <div className="w-[60%] bg-gray-100 p-2">
            <CropPreview />
          </div>
          <div className="flex-1 border-l-2">
            <CropMenu />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
