import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CommonImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  imagePreview: React.ReactNode;
  menu: React.ReactNode;
}

export default function CommonImageDialog({ open, onOpenChange, title, imagePreview, menu }: CommonImageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[calc(100vh-120px)] md:min-h-[80vh] w-[80vw] max-w-none! p-0! m-0! overflow-hidden">
        <DialogHeader className="px-4 py-2">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1">
          <div className="w-[60%] bg-gray-100 p-2">
            {imagePreview}
          </div>
          <div className="flex-1 border-l-2">
            {menu}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}