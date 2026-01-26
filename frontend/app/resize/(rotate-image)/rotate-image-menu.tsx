import { Button } from "@/components/ui/button";
import { RotateCcw, RotateCw } from "lucide-react";

interface RotateButtonProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

interface RotateImageMenuProps {
  onRotateClockwise: () => void;
  onRotateAntiClockwise: () => void;
}

export default function RotateImageMenu({ onRotateClockwise, onRotateAntiClockwise }: RotateImageMenuProps) {
  const rotateButtons: Array<RotateButtonProps> = [
    {
      icon: <RotateCw />,
      title: "Rotate Clockwise",
      onClick: onRotateClockwise,
    },
    {
      icon: <RotateCcw />,
      title: "Rotate Anti-Clockwise",
      onClick: onRotateAntiClockwise,
    },
  ]

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex gap-4">
      {rotateButtons.map((button, index) => (
        <Button
          key={index}
          variant={"outline"}
          onClick={button.onClick}
          className="flex flex-col justify-center items-center h-auto px-6 py-4"
        >
          {button.icon}
          {button.title}
        </Button>
      ))}
      </div>
    </div>
  )
}