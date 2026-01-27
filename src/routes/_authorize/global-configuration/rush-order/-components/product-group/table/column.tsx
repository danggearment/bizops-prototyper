import {
  mappingColor,
  RushProductGroupStatusColorsMapping,
} from "@/constants/map-color"
import { RushProductGroupStatusLabel } from "@/constants/order"
import { AllPlatformLabel } from "@/constants/platform"
import { RushProductGroupData } from "@gearment/nextapi/api/pod/v1/product_admin_pb"
import { Badge } from "@gearment/ui3"
import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import CellGroupName from "./cell-group-name"

export const columns: ColumnDef<RushProductGroupData>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => {
      return <CellGroupName text={row.original.name} />
    },
    meta: {
      width: 500,
    },
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ row }) => {
      return <CellGroupName text={row.original.description} />
    },
    meta: {
      width: 500,
    },
  },
  {
    header: "Platform",
    accessorKey: "platform",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.platforms.map((platform) => (
            <Badge key={platform}>{AllPlatformLabel[platform]}</Badge>
          ))}
        </div>
      )
    },
    meta: {
      width: 200,
    },
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
    meta: {
      width: 200,
    },
  },

  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={mappingColor(
            RushProductGroupStatusColorsMapping,
            row.original.status,
          )}
        >
          {RushProductGroupStatusLabel[row.original.status]}
        </Badge>
      )
    },
    meta: {
      width: 200,
    },
  },
  {
    header: "",
    accessorKey: "action",
    cell: ({ row }) => {
      return <CellAction row={row.original} />
    },
    meta: {
      width: 80,
    },
  },
]
