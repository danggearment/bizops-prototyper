import {
  Button,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { RefreshCwIcon } from "lucide-react"
import { useState } from "react"

export default function RefreshButton({
  handleRefetchData,
}: {
  handleRefetchData: () => Promise<void>
}) {
  const [isRefetching, setRefetching] = useState(false)
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          onClick={async () => {
            setRefetching(true)
            await handleRefetchData()
            setRefetching(false)
          }}
          className="bg-white"
          variant="outline"
        >
          <RefreshCwIcon
            className={cn("", {
              "animate-spin": isRefetching,
            })}
          />
        </Button>
      </TooltipTrigger>

      <TooltipContent color="dark" side="top">
        Refresh data table
      </TooltipContent>
    </Tooltip>
  )
}
