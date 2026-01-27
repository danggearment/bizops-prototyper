import {
  mappingColor,
  StatementPaymentRequestStatusColorsMapping,
} from "@/constants/map-color"
import {
  Credit_StatementPaymentRequest_Admin,
  CreditStatementPaymentRequestStatus,
} from "@/services/connect-rpc/types"
import { formatPrice, getPrice } from "@/utils/format-currency"
import { Badge, Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"
import { Info } from "lucide-react"

export default function CellAmountRequested(
  props: CellContext<Credit_StatementPaymentRequest_Admin, any>,
) {
  return (
    <span className="flex items-center">
      <Badge
        className="text-sm "
        variant={mappingColor(
          StatementPaymentRequestStatusColorsMapping,
          props.row.original.status,
        )}
      >
        {formatPrice(props.row.original.requestAmount)}
      </Badge>
      {props.row.original.status ===
        CreditStatementPaymentRequestStatus.REQUESTED &&
        getPrice(props.row.original.paidBeforeAmount) > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-foreground/50" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Previously paid:{" "}
                {formatPrice(props.row.original.paidBeforeAmount)}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
    </span>
  )
}
