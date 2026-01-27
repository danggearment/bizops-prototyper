import {
  ShippingParcelShippingServiceLabel,
  ShippingParcelStatusLabel,
  UnitLabel,
} from "@/constants/enum-label"
import {
  mappingColor,
  ShippingParcelShippingServiceColorsMapping,
  ShippingParcelStatusColorsMapping,
} from "@/constants/map-color"
import { ShippingParcel } from "@gearment/nextapi/api/ffm/v1/cross_dock_pb"
import { Unit } from "@gearment/nextapi/common/type/v1/measure_pb"
import { Badge, Button } from "@gearment/ui3"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"
import CellActions from "./cell-actions"
import CellTrackingNumber from "./cell-tracking-number"

export interface ShippingParcelWithBoxId extends ShippingParcel {
  boxId: string
}

const columnHelper = createColumnHelper<ShippingParcelWithBoxId>()

export const columns: ColumnDef<ShippingParcelWithBoxId, any>[] = [
  columnHelper.accessor("parcelId", {
    header: "Parcel ID",
    cell: ({ row }) => {
      const isExpanded = row.getIsExpanded()
      const enableExpand = row.original.items?.length > 0
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => row.toggleExpanded()}
            disabled={!enableExpand}
          >
            {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </Button>
          <ul>
            <li>Parcel: #{row.original.parcelId}</li>
            <li className="text-muted-foreground">
              Box: #{row.original.boxId}
            </li>
          </ul>
        </div>
      )
    },
  }),
  columnHelper.accessor("volumetricWeight", {
    header: "Volumetric weight",
    cell: ({ row }) => {
      const volumetricWeight = row.original.volumetricWeight
      if (!volumetricWeight) return null

      const weightValue = volumetricWeight?.value
      const weightUnit = UnitLabel[volumetricWeight?.unit ?? Unit.UNSPECIFIED]

      const weightText = `${weightValue} ${weightUnit}`

      return <div>{weightText}</div>
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={mappingColor(
            ShippingParcelStatusColorsMapping,
            row.original.status,
          )}
        >
          {ShippingParcelStatusLabel[row.original.status]}
        </Badge>
      )
    },
  }),
  columnHelper.display({
    id: "trackingNumber",
    header: "Tracking information",
    cell: ({ row }) => {
      return <CellTrackingNumber row={row} />
    },
  }),

  columnHelper.accessor("shippingService", {
    header: "Shipping service",
    cell: ({ row }) => {
      return (
        <Badge
          variant={mappingColor(
            ShippingParcelShippingServiceColorsMapping,
            row.original.shippingService,
          )}
        >
          {ShippingParcelShippingServiceLabel[row.original.shippingService]}
        </Badge>
      )
    },
  }),
  columnHelper.display({
    id: "action",
    header: "",
    cell: ({ row }) => {
      return <CellActions row={row} />
    },
    meta: {
      width: 80,
    },
  }),
]
