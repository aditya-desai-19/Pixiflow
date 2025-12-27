import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";


export default function PercentageContainer() {
  return (
    <div>
      <Label htmlFor="percentage">{"Percentage"}</Label>
      <Progress id="percentage" value={50} />
    </div>
  )
}