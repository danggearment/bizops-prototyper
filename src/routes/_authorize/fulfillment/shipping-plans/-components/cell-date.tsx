import { DateTime } from "@/components/common/date-time"
import { Timestamp } from "@bufbuild/protobuf"
import { Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"
import { PlaneLandingIcon, PlaneTakeoff } from "lucide-react"

interface Props {
  shipDate: Timestamp | undefined
  eta: Timestamp | undefined
}

export default function CellDate({ shipDate, eta }: Props) {
  return (
    <div className="body-small space-y-2">
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <PlaneTakeoff size={16} className="text-foreground/50" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Ship date</p>
          </TooltipContent>
        </Tooltip>
        <DateTime date={shipDate?.toDate() || ""} format="YYYY/MM/DD" />
      </div>
      <div className="flex items-center gap-1 ">
        <Tooltip>
          <TooltipTrigger asChild>
            <PlaneLandingIcon size={16} className="text-foreground/50" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Estimated arrival date</p>
          </TooltipContent>
        </Tooltip>
        <DateTime date={eta?.toDate() || ""} format="YYYY/MM/DD" />
      </div>
    </div>
  )
}
