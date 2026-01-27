import { DateTime } from "@/components/common/date-time"
import { Timestamp } from "@bufbuild/protobuf"
import { Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"
import { ClockPlusIcon } from "lucide-react"

interface Props {
  createdAt: Timestamp | undefined
}

export default function CellDate({ createdAt }: Props) {
  return (
    <div className="body-small space-y-2">
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <ClockPlusIcon size={16} className="text-foreground/50" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Created at</p>
          </TooltipContent>
        </Tooltip>
        <DateTime date={createdAt?.toDate() || ""} />
      </div>
    </div>
  )
}
