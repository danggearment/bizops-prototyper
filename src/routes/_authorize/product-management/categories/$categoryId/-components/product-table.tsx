import { DateTime } from "@/components/common/date-time"
import Image from "@/components/common/image/image"
import {
  GMProductFulfillmentChannelColorsMapping,
  mappingColor,
  ProductStatusColorsMapping,
} from "@/constants/map-color"
import {
  GMProductFulfillmentChannelLabel,
  ProductStatusLabel,
} from "@/constants/product"
import { GMProduct_Admin_Short } from "@/services/connect-rpc/types"
import {
  Badge,
  Button,
  DataTable,
  TablePagination,
  useTable,
} from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { Trash2Icon } from "lucide-react"
import { useCategoryDetail } from "../-category-detail-context"

const columnHelper = createColumnHelper<GMProduct_Admin_Short>()

export function ProductTable() {
  const { products, loading, rowCount, pageCount } = useCategoryDetail()

  const search = useSearch({
    from: "/_authorize/product-management/categories/$categoryId/",
  })

  const navigate = useNavigate({
    from: "/product-management/categories/$categoryId",
  })

  const columns: ColumnDef<GMProduct_Admin_Short, any>[] = [
    columnHelper.accessor("avatarUrl", {
      header: "Thumbnail",
      meta: {
        width: 80,
      },
      cell: ({ row }) => (
        <div className="w-[80px]">
          <Image url={row.original.avatarUrl} width={80} responsive="w" />
        </div>
      ),
    }),
    columnHelper.accessor("productName", {
      header: "Product name",
      meta: {
        width: 200,
      },
      cell: ({ row }) => (
        <div className="w-[200px] text-wrap font-medium">
          {row.original.productName}
        </div>
      ),
    }),
    columnHelper.accessor("productSku", {
      header: "Product code",
      cell: ({ row }) => <div>{row.original.productSku}</div>,
    }),
    columnHelper.accessor("fulfillmentChannel", {
      header: "Fulfillment",
      cell: ({ row }) => (
        <Badge
          variant={mappingColor(
            GMProductFulfillmentChannelColorsMapping,
            row.original.fulfillmentChannel,
          )}
        >
          {GMProductFulfillmentChannelLabel[row.original.fulfillmentChannel]}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: "vendor",
      header: "Vendor",
      cell: () => <div>--</div>,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={mappingColor(
            ProductStatusColorsMapping,
            row.original.status,
          )}
        >
          {ProductStatusLabel[row.original.status]}
        </Badge>
      ),
    }),
    columnHelper.accessor("linkedCategoryAt", {
      header: "Linked at",
      cell: ({ row }) =>
        row.original.linkedCategoryAt ? (
          <DateTime date={row.original.linkedCategoryAt.toDate()} />
        ) : (
          "--"
        ),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      meta: {
        width: 120,
      },
      cell: () => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:border-destructive"
          >
            <Trash2Icon size={14} className="text-destructive" />
          </Button>
        </div>
      ),
    }),
  ]

  const table = useTable({
    columns,
    data: products,
    rowCount: rowCount,
    pageCount: pageCount,
    state: {
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
    },
    onPaginationChange: (updater) => {
      const newValue =
        updater instanceof Function
          ? updater({
              pageIndex: search.page - 1,
              pageSize: search.limit,
            })
          : updater
      navigate({
        search: (old) => {
          return {
            ...old,
            page: newValue.pageIndex + 1,
            limit: newValue.pageSize,
          }
        },
        replace: true,
      })
    },
  })
  return (
    <div>
      <DataTable
        table={table}
        loading={loading}
        noDataText="No products found matching your search criteria."
      />
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </div>
  )
}
