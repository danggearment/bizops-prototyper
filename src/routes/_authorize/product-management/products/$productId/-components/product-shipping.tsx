import { GMProduct_ShippingPolicy } from "@/services/connect-rpc/types"
import { DataTable, useTable } from "@gearment/ui3"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import {
  handleProductShippingFee,
  InternationalShippingServiceCode,
  ShippingServiceCode,
} from "./helper"

interface Props {
  shippingPolicies: GMProduct_ShippingPolicy[]
}
const columnHelper = createColumnHelper<GMProduct_ShippingPolicy>()

export function TableProductShipping({ shippingPolicies }: Props) {
  const columns: ColumnDef<GMProduct_ShippingPolicy, any>[] = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => <span className="capitalize">Shipping for all size</span>,
        cell: ({ getValue }) => (
          <span className="text-base font-semibold text-foreground-dark dark:text-secondary-text">
            {getValue<string>()}
          </span>
        ),
      }),
      columnHelper.group({
        id: "standard",
        header: () => <div className="text-center capitalize">Standard</div>,
        columns: [
          columnHelper.display({
            id: "standardFirstItem",
            header: () => (
              <div className="text-center capitalize">First Item</div>
            ),
            meta: {
              width: 120,
            },
            cell: ({ row }) => {
              const price = handleProductShippingFee(
                row.original.variants,
                ShippingServiceCode.STANDARD,
                false,
                row.original.isInternational,
                InternationalShippingServiceCode.IN_STANDARD,
              )
              return (
                <div className="text-foreground-dark text-center">{price}</div>
              )
            },
          }),
          columnHelper.display({
            id: "standardAdditionalItem",
            header: () => (
              <div className="text-center capitalize">Additional item</div>
            ),
            meta: {
              width: 120,
            },
            cell: ({ row }) => {
              const price = handleProductShippingFee(
                row.original.variants,
                ShippingServiceCode.STANDARD,
                true,
                row.original.isInternational,
                InternationalShippingServiceCode.IN_STANDARD,
              )
              return (
                <div className="text-foreground-dark text-center">{price}</div>
              )
            },
          }),
        ],
      }),
      columnHelper.group({
        id: "ground",
        header: () => <div className="text-center capitalize">Ground</div>,
        columns: [
          columnHelper.display({
            id: "groundFirstItem",
            header: () => (
              <div className="text-center capitalize">First Item</div>
            ),
            meta: {
              width: 120,
            },
            cell: ({ row }) => {
              const price = handleProductShippingFee(
                row.original.variants,
                ShippingServiceCode.GROUND,
                false,
                row.original.isInternational,
              )
              return (
                <div className="text-foreground-dark text-center">{price}</div>
              )
            },
          }),
          columnHelper.display({
            id: "groundAdditionalItem",
            header: () => (
              <div className="text-center capitalize">Additional item</div>
            ),
            meta: {
              width: 120,
            },
            cell: ({ row }) => {
              const price = handleProductShippingFee(
                row.original.variants,
                ShippingServiceCode.GROUND,
                true,
                row.original.isInternational,
              )
              return (
                <div className="text-foreground-dark text-center">{price}</div>
              )
            },
          }),
        ],
      }),
      columnHelper.group({
        id: "2days",
        header: () => <div className="text-center capitalize">2 Days</div>,
        columns: [
          columnHelper.display({
            id: "twoDaysFirstItem",
            header: () => (
              <div className="text-center capitalize">First Item</div>
            ),
            meta: {
              width: 120,
            },
            cell: ({ row }) => {
              const price = handleProductShippingFee(
                row.original.variants,
                ShippingServiceCode.FASTSHIP,
                false,
                row.original.isInternational,
              )
              return (
                <div className="text-foreground-dark text-center">{price}</div>
              )
            },
          }),
          columnHelper.display({
            id: "twoDaysAdditionalItem",
            header: () => (
              <div className="text-center capitalize">Additional item</div>
            ),
            meta: {
              width: 120,
            },
            cell: ({ row }) => {
              const price = handleProductShippingFee(
                row.original.variants,
                ShippingServiceCode.FASTSHIP,
                true,
                row.original.isInternational,
              )
              return (
                <div className="text-foreground-dark text-center">{price}</div>
              )
            },
          }),
        ],
      }),
      columnHelper.group({
        id: "stamp",
        header: () => <div className="text-center capitalize">Stamp</div>,
        columns: [
          columnHelper.display({
            id: "stampFirstItem",
            header: () => (
              <div className="text-center capitalize">First Item</div>
            ),
            meta: {
              width: 120,
            },
            cell: ({ row }) => {
              const price = handleProductShippingFee(
                row.original.variants,
                ShippingServiceCode.STAMP,
                false,
                row.original.isInternational,
                InternationalShippingServiceCode.IN_STAMP,
              )
              return (
                <div className="text-foreground-dark text-center">{price}</div>
              )
            },
          }),
          columnHelper.display({
            id: "stampAdditionalItem",
            header: () => (
              <div className="text-center capitalize">Additional item</div>
            ),
            meta: {
              width: 136,
            },
            cell: ({ row }) => {
              const price = handleProductShippingFee(
                row.original.variants,
                ShippingServiceCode.STAMP,
                true,
                row.original.isInternational,
                InternationalShippingServiceCode.IN_STAMP,
              )
              return (
                <div className="text-foreground-dark text-center">{price}</div>
              )
            },
          }),
        ],
      }),
    ],
    [],
  )

  const table = useTable({
    columns,
    data: shippingPolicies,
  })

  return <DataTable table={table} />
}
