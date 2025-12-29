import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { PercentageContainerProps } from "./types"

export default function PercentageContainer({
  percentage,
  onPercentChange,
}: PercentageContainerProps) {
  return (
    <div className="my-8 flex flex-col gap-2 w-full">
      <Label htmlFor="percentage">{"Size"}</Label>
      <div className="border-2 border-surface-tertiary p-4 flex justify-center items-center gap-2 rounded-lg">
        <Slider
          id={"percentage"}
          step={1}
          defaultValue={[percentage]}
          onValueChange={(v) => onPercentChange(v.at(0) ?? 0)}
        />
        <p>{`${percentage * 2}%`}</p>
      </div>
      <p className="text-sm">{`Make my image ${percentage * 2}% of original image in px`}</p>
    </div>
  )
}
