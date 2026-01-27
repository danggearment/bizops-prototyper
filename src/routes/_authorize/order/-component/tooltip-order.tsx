import { AllCreationMethodsLabelAllOrder } from "@/constants/order"
import {
  Order_CreatedMethod,
  OrderDraft_CreatedMethod,
  OrderDraft_Note,
} from "@/services/connect-rpc/types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"
import { CopyPlus } from "lucide-react"

interface Props {
  createdMethod?: OrderDraft_CreatedMethod | Order_CreatedMethod
  isLabelAttached?: boolean
  originOrderId?: string
  notes?: OrderDraft_Note[]
}

export function CreatedMethod({ createdMethod, isLabelAttached }: Props) {
  if (!createdMethod) return null

  const icon = isLabelAttached ? "📦" : "✍️"
  const orderType = isLabelAttached ? "Label" : "Manual"
  const description = `Order Type: ${orderType}, Created via ${AllCreationMethodsLabelAllOrder[createdMethod]}`

  return <TooltipOrder description={description} icon={icon} />
}

export function CreatedDuplicated({ originOrderId }: Props) {
  if (!originOrderId) return null
  return <TooltipOrder description="Duplicate" icon={<CopyPlus />} />
}

export function NotesOrder({ notes }: Props) {
  if (!notes || notes.length === 0) return null
  return <TooltipOrder description="Error" icon={"⚠️"} />
}

function TooltipOrder({
  description,
  icon,
}: {
  description: React.ReactNode
  icon: React.ReactNode
}) {
  return (
    <div className="w-fit">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex text-sm items-center justify-center w-4 h-4 rounded-full">
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">{description}</TooltipContent>
      </Tooltip>
    </div>
  )
}
