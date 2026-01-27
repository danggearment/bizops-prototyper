import { ShippingPlanStatusLabel } from "@/constants/enum-label"
import {
  mappingColor,
  ShippingPlanStatusColorsMapping,
} from "@/constants/map-color"
import { ShippingPlan_Status } from "@gearment/nextapi/api/ffm/v1/cross_dock_pb"
import {
  Badge,
  ButtonIconCopy,
  Checkbox,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { Link } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { NotepadText } from "lucide-react"
import { FormEvent } from "react"
import CellActions from "./cell-actions"
import CellDate from "./cell-date"

const columnHelper = createColumnHelper<any>()

export const Columns: ColumnDef<any>[] = [
  columnHelper.display({
    id: "select",
    meta: {
      width: 40,
    },
    header: (props) => (
      <div className="flex justify-center">
        <Checkbox
          {...{
            checked: props.table.getIsAllRowsSelected(),
            onCheckedChange: (checked) => {
              const e = {
                target: {
                  checked,
                },
              } as unknown as FormEvent<HTMLButtonElement>
              props.table.getToggleAllRowsSelectedHandler()(e)
            },
          }}
        />
      </div>
    ),
    cell: (props) => {
      return (
        <div className="flex justify-center">
          <Checkbox
            {...props}
            {...{
              checked: props.row.getIsSelected(),
              disabled: !props.row.getCanSelect(),
              onCheckedChange: props.row.getToggleSelectedHandler(),
            }}
          />
        </div>
      )
    },
  }),

  columnHelper.accessor("name", {
    header: "Plan name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          <Link
            to="/fulfillment/shipping-plans/$shippingId"
            params={{ shippingId: row.original.planId }}
          >
            <span className="text-sm hover:text-primary">
              {row.original.planName}
            </span>
          </Link>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            #{row.original.planId}
            <ButtonIconCopy copyValue={row.original.planId} size="sm" />
          </div>
        </div>
      )
    },
  }),
  columnHelper.accessor("shippingRoute", {
    header: () => <span className="whitespace-nowrap">Ship to</span>,
    cell: ({ row }) => {
      const to = row.original.shippingRoute?.destination
      return (
        <div className="flex gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm">{to?.line1}</span>
            <span className="text-sm">{to?.country}</span>
            <span className="text-sm">{to?.phoneNo}</span>
            <span className="text-sm">{to?.email}</span>
            <span className="text-sm">
              {to?.firstName} {to?.lastName}
            </span>
            {to?.note && (
              <div className="text-sm flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger>
                    <NotepadText className="w-4 h-4 text-gray-500" size={16} />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] text-sm">
                    {to?.note}
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      )
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={mappingColor(
            ShippingPlanStatusColorsMapping,
            row.original.status,
          )}
        >
          {ShippingPlanStatusLabel[row.original.status as ShippingPlan_Status]}
        </Badge>
      )
    },
  }),
  columnHelper.accessor("shippingRoute.shipDate", {
    header: "Time line",
    cell: (info) => {
      return (
        <CellDate
          shipDate={info.row.original.shippingRoute?.shipDate}
          eta={info.row.original.shippingRoute?.eta}
        />
      )
    },
  }),
  columnHelper.display({
    id: "action",
    header: "",
    cell: () => {
      return <CellActions />
    },
    meta: {
      width: 100,
    },
  }),
]
