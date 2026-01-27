import { ShippingBoxStatusLabel, UnitLabel } from "@/constants/enum-label"
import {
  mappingColor,
  ShippingBoxStatusColorsMapping,
} from "@/constants/map-color"
import {
  ShippingBox,
  ShippingPlan,
} from "@gearment/nextapi/api/ffm/v1/cross_dock_pb"
import { Unit } from "@gearment/nextapi/common/type/v1/measure_pb"
import { Badge, DataTable, useTable } from "@gearment/ui3"
import {
  ColumnDef,
  createColumnHelper,
  getExpandedRowModel,
} from "@tanstack/react-table"

const getText = (value?: string) => {
  return value ? value : "--"
}

const columnHelper = createColumnHelper<ShippingBox>()

const columns: ColumnDef<ShippingBox, any>[] = [
  columnHelper.accessor("boxId", {
    header: "Box ID",
    cell: ({ row }) => {
      return <div>#{row.original.boxId}</div>
    },
  }),

  columnHelper.accessor("weight", {
    header: "Dimension",
    cell: ({ row }) => {
      const dimension = row.original.dimension
      const weight = row.original.weight

      const weightValue = getText(weight?.value)
      const weightUnit = UnitLabel[weight?.unit ?? Unit.UNSPECIFIED]

      const width = getText(dimension?.width?.value)
      const widthUnit = UnitLabel[dimension?.width?.unit ?? Unit.UNSPECIFIED]
      const height = getText(dimension?.height?.value)
      const heightUnit = UnitLabel[dimension?.height?.unit ?? Unit.UNSPECIFIED]
      const length = getText(dimension?.length?.value)
      const lengthUnit = UnitLabel[dimension?.length?.unit ?? Unit.UNSPECIFIED]
      const weightText =
        weightValue !== "--" ? `${weightValue}${weightUnit}` : "--"
      const dimensionText =
        width !== "--"
          ? `${width}${widthUnit} x ${height}${heightUnit} x ${length}${lengthUnit} (WxHxL)`
          : "--"

      return (
        <div>
          {weightText}
          <br />
          {dimensionText}
        </div>
      )
    },
  }),

  columnHelper.accessor("parcels", {
    header: "Parcels count",
    cell: ({ row }) => {
      return <div>{row.original.parcels.length}</div>
    },
  }),

  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={mappingColor(
            ShippingBoxStatusColorsMapping,
            row.original.status,
          )}
        >
          {ShippingBoxStatusLabel[row.original.status]}
        </Badge>
      )
    },
  }),
]

export default function BoxList({
  shippingPlan,
}: {
  shippingPlan: ShippingPlan
}) {
  const shippingBoxes = shippingPlan.shippingBoxes

  const table = useTable({
    columns,
    data: shippingBoxes,
    getRowId: (row) => row.boxId,
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <div>
      <DataTable table={table} />
    </div>
  )
}
