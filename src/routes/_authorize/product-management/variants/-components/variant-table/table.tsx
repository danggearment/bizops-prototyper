import { DateTime } from "@/components/common/date-time"
import Image from "@/components/common/image/image"
import {
  GMProductFulfillmentChannelColorsMapping,
  mappingColor,
  ProductVariantStatusColorsMapping,
} from "@/constants/map-color"
import {
  GMProductFulfillmentChannelLabel,
  OptionsCatalogGroupType,
  ProductVariantStatusLabel,
} from "@/constants/product"
import {
  GMProduct_Admin_Variant_Short,
  GMProductOption_OptionType,
} from "@/services/connect-rpc/types"
import { formatPrice } from "@/utils"
import {
  Badge,
  CellHeader,
  DataTable,
  TablePagination,
  useTable,
} from "@gearment/ui3"
import {
  Link,
  useLocation,
  useNavigate,
  useSearch,
} from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useVariantManagement } from "../../-variant-management-context"
import CellActions from "./cell-actions"
import CellStock from "./cell-stock"

const columnHelper = createColumnHelper<GMProduct_Admin_Variant_Short>()

export default function VariantTable() {
  const location = useLocation()

  const columns: ColumnDef<GMProduct_Admin_Variant_Short, any>[] = [
    columnHelper.accessor("productAvatarUrl", {
      header: "Image",
      meta: {
        width: 60,
      },
      cell: ({ row }) => (
        <div className="w-[60px]">
          <Image
            url={row.original.productAvatarUrl}
            width={60}
            responsive="w"
          />
        </div>
      ),
    }),
    columnHelper.accessor("variantName", {
      header: "Variant name",
      meta: {
        width: 300,
      },
      cell: ({ row }) => (
        <div className="w-[300px] text-wrap">
          <div className="font-medium">{row.original.variantName}</div>
          <div className="text-foreground/50 text-sm">
            Product:{" "}
            <Link
              to={"/product-management/products/$productId"}
              params={{ productId: row.original.productId }}
              state={{
                ...location,
              }}
              className="hover:text-primary hover:underline"
            >
              {row.original.productName}
            </Link>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("variantSku", {
      header: "Variant SKU",
      cell: ({ row }) => <div>{row.original.variantSku}</div>,
    }),
    columnHelper.display({
      id: "option",
      header: "Option",
      cell: ({ row }) => {
        const options = [
          row.original.option1,
          row.original.option2,
          row.original.option3,
        ]
          .filter((option) => option?.value)
          .map((option, idx) => (
            <div
              key={idx}
              className="py-1 px-2 bg-white rounded-full border flex items-center gap-1"
            >
              {option?.type && (
                <>
                  {
                    OptionsCatalogGroupType[
                      option.type as keyof typeof OptionsCatalogGroupType
                    ]
                  }
                  {OptionsCatalogGroupType[
                    option.type as keyof typeof OptionsCatalogGroupType
                  ] && ":"}
                </>
              )}
              <div className="flex items-center gap-1">
                {option?.type === GMProductOption_OptionType.COLOR &&
                  option?.value && (
                    <div
                      className="size-4 border border-border rounded-full"
                      style={{ backgroundColor: `#${option.value}` }}
                    />
                  )}
                {option?.name}
              </div>
            </div>
          ))
        return <div className="flex items-center gap-1">{options}</div>
      },
    }),
    columnHelper.accessor("basePrice", {
      header: "RSP",
      cell: ({ row }) => <div>{formatPrice(row.original.basePrice)}</div>,
    }),
    columnHelper.accessor("stockQuantity", {
      header: "Stock",
      cell: (props) => <CellStock {...props} />,
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
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={mappingColor(
            ProductVariantStatusColorsMapping,
            row.original.status,
          )}
        >
          {ProductVariantStatusLabel[row.original.status]}
        </Badge>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: (header) => (
        <CellHeader {...header}>
          <p className="whitespace-nowrap">Created at</p>
        </CellHeader>
      ),
      cell: ({ row }) => (
        <DateTime date={row.original.createdAt?.toDate() || ""} />
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      meta: {
        width: 70,
      },
      cell: (props) => <CellActions {...props} />,
    }),
  ]

  const search = useSearch({
    from: "/_authorize/product-management/variants/",
  })

  const navigate = useNavigate({
    from: "/product-management/variants",
  })

  const { variants, loading, totalVariants, totalPage } = useVariantManagement()

  const table = useTable({
    columns,
    data: variants,
    rowCount: Number(totalVariants) || 0,
    pageCount: Number(totalPage) || 0,
    state: {
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
      columnPinning: {
        right: ["actions"],
      },
    },
    getRowId: (row) => row.variantId.toString(),
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

  const hasProductFilter = search.productIds && search.productIds.length > 0
  const noDataText = hasProductFilter
    ? "No variants available for this product"
    : "No data"

  return (
    <div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      <div className="bg-background rounded-lg p-4">
        <DataTable
          table={table}
          loading={loading}
          sticky
          noDataText={noDataText}
        />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </div>
  )
}
