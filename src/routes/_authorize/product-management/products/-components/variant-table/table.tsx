import { DateTime } from "@/components/common/date-time"
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
import { ProductVariantsSearchType } from "@/schemas/schemas/product"
import {
  GMProduct_TeamProductDetail_Variant,
  GMProductOption_OptionType,
} from "@/services/connect-rpc/types"
import { formatPrice } from "@/utils"
import {
  Badge,
  BoxEmpty,
  CellHeader,
  DataTable,
  TablePagination,
  useTable,
} from "@gearment/ui3"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import CellActions from "./cell-actions"
import CellStock from "./cell-stock"

interface Props {
  variants: GMProduct_TeamProductDetail_Variant[]
  loading: boolean
  search?: ProductVariantsSearchType
  handleChangeSearch?: (search: ProductVariantsSearchType) => void
  total?: number
}

const columnHelper = createColumnHelper<GMProduct_TeamProductDetail_Variant>()

export default function VariantTable(props: Props) {
  const { variants, loading, search, handleChangeSearch, total = 0 } = props

  const columns: ColumnDef<GMProduct_TeamProductDetail_Variant, any>[] = [
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
    columnHelper.accessor("updatedAt", {
      header: (header) => (
        <CellHeader {...header} sort={!!search}>
          <p className="whitespace-nowrap">Updated at</p>
        </CellHeader>
      ),
      cell: ({ row }) => (
        <DateTime date={row.original.updatedAt?.toDate() || ""} />
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      meta: {
        width: 70,
      },
      cell: (props) => <CellActions {...props} />,
    }),
  ]

  const sorting = (search?.sortBy || []).map((s, i) => ({
    id: s,
    desc: search?.sortDirection ? search?.sortDirection[i] === "desc" : false,
  }))

  const table = useTable({
    columns,
    data: variants,
    getRowId: (row) => row.variantId,
    rowCount: total,
    state: {
      ...(search
        ? {
            sorting,
            pagination: {
              pageIndex: search.page - 1,
              pageSize: search.limit,
            },
          }
        : {}),
    },
    onSortingChange: (updater) => {
      if (!search || !handleChangeSearch) return
      const newValue = updater instanceof Function ? updater(sorting) : updater
      const order = newValue.map((s) => s.id)
      const desc = newValue.map((s) => (s.desc ? "desc" : "asc"))
      handleChangeSearch({
        ...search,
        sortBy: order,
        sortDirection: desc,
      })
    },
    onPaginationChange: (updater) => {
      if (!search || !handleChangeSearch) return
      const newValue =
        updater instanceof Function
          ? updater({
              pageIndex: search.page - 1,
              pageSize: search.limit,
            })
          : updater
      handleChangeSearch({
        ...search,
        page: newValue.pageIndex + 1,
        limit: newValue.pageSize,
      })
    },
  })

  return (
    <div className="flex flex-col gap-4">
      {search && <TablePagination table={table} />}
      <DataTable
        table={table}
        loading={loading}
        noDataText={
          <BoxEmpty
            title="No data found"
            description="No variants found matching your filters."
          />
        }
      />
      {search && <TablePagination table={table} />}
    </div>
  )
}
