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
import { useMutationPod } from "@/services/connect-rpc/transport"
import {
  GMProduct_Admin_Short,
  StaffListProductVariantResponse,
} from "@/services/connect-rpc/types"
import { staffListProductVariant } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import {
  Badge,
  CellHeader,
  DataTable,
  LoadingCircle,
  TableCell,
  TablePagination,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useTable,
} from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import {
  ColumnDef,
  createColumnHelper,
  ExpandedState,
  Row,
} from "@tanstack/react-table"
import { InfoIcon } from "lucide-react"
import { useState } from "react"
import { useProductManagement } from "../../-product-management-context"
import CellActions from "./cell-actions"
import CellExpanded from "./cell-expanded"
import { CellName } from "./cell-name"
import CellRSP from "./cell-rsp"
import RowExpanded from "./row-expanded"

const columnHelper = createColumnHelper<GMProduct_Admin_Short>()

const MAX_VARIANTS_TO_SHOW = 5

export default function ProductTable() {
  const { products, loading, rowCount, pageCount, handleSetFilter } =
    useProductManagement()

  const [expanded, setExpanded] = useState<ExpandedState>({})
  const navigate = useNavigate({
    from: "/product-management/products",
  })
  const [variantsData, setVariantsData] = useState<
    Record<string, StaffListProductVariantResponse>
  >({})
  const [loadingVariants, setLoadingVariants] = useState<
    Record<string, boolean>
  >({})

  const search = useSearch({
    from: "/_authorize/product-management/products/",
  })

  const columns: ColumnDef<GMProduct_Admin_Short, any>[] = [
    columnHelper.display({
      id: "collapsible",
      meta: {
        width: 40,
      },
      cell: ({ row }) => (
        <CellExpanded
          row={row}
          setVariantsData={setVariantsData}
          setLoadingVariants={setLoadingVariants}
          loadingVariants={loadingVariants}
        />
      ),
    }),
    columnHelper.accessor("avatarUrl", {
      header: "Image",
      meta: {
        width: 60,
      },
      cell: ({ row }) => (
        <div className="w-[60px]">
          <Image url={row.original.avatarUrl} width={60} responsive="w" />
        </div>
      ),
    }),
    columnHelper.accessor("productName", {
      header: "Product name",
      meta: {
        width: 300,
      },
      cell: (props) => <CellName {...props} />,
    }),
    columnHelper.accessor("productSku", {
      header: "Product code",
      cell: ({ row }) => <div>{row.original.productSku}</div>,
    }),
    columnHelper.accessor("basePrice", {
      header: "RSP",
      cell: (props) => <CellRSP {...props} />,
    }),
    columnHelper.display({
      id: "vendor",
      header: "Vendor",
      cell: () => <div>--</div>,
    }),
    columnHelper.display({
      id: "fulfillment",
      header: () => (
        <div className="flex items-center gap-1">
          Fulfillment{" "}
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon size={16} className="text-foreground/80" />
            </TooltipTrigger>
            <TooltipContent>
              <p>All: includes both FBM and FBA</p>
              <p>FBM: includes only FBM</p>
              <p>FBA: includes only FBA</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
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
    columnHelper.accessor("totalVariants", {
      header: "Variants",
      cell: ({ row }) => <div>{row.original.totalVariants}</div>,
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
    columnHelper.accessor("createdAt", {
      header: (header) => (
        <CellHeader {...header} sort={false}>
          <p className="whitespace-nowrap">Created at</p>
        </CellHeader>
      ),
      meta: {
        width: 170,
      },
      cell: ({ row }) => (
        <DateTime date={row.original.createdAt?.toDate() || ""} />
      ),
    }),
    columnHelper.accessor("updatedAt", {
      header: (header) => (
        <CellHeader {...header} sort>
          <p className="whitespace-nowrap">Updated at</p>
        </CellHeader>
      ),
      cell: ({ row }) => (
        <DateTime date={row.original.updatedAt?.toDate() || ""} />
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

  const getProductDetailMutation = useMutationPod(staffListProductVariant, {
    onSuccess: (data, variables) => {
      const productIdKey = String(variables?.filter?.productIds?.[0])
      setVariantsData((prev) => ({
        ...prev,
        [productIdKey]: data,
      }))
      setLoadingVariants((prev) => ({
        ...prev,
        [productIdKey]: false,
      }))
    },
    onError: (_error, variables) => {
      const productIdKey = String(variables?.filter?.productIds?.[0])
      setLoadingVariants((prev) => ({
        ...prev,
        [productIdKey]: false,
      }))
    },
  })

  const renderSubrow = (row: Row<GMProduct_Admin_Short>) => {
    const productIdKey = String(row.original.productId)
    const isLoading = loadingVariants[productIdKey]
    const variants = variantsData[productIdKey]?.data || []
    const totalVariants = variantsData[productIdKey]?.paging?.total || 0

    if (isLoading) {
      return (
        <TableRow>
          <TableCell
            colSpan={row.getAllCells().length}
            className="py-6 px-4 bg-gray-100"
          >
            <div className="flex items-center justify-center py-4">
              <LoadingCircle size="sm" />
            </div>
          </TableCell>
        </TableRow>
      )
    }
    return (
      <RowExpanded
        colSpan={row.getAllCells().length}
        variants={variants}
        product={row.original}
        loading={loadingVariants[productIdKey]}
        totalVariants={Number(totalVariants)}
        maxVariantsToShow={MAX_VARIANTS_TO_SHOW}
      />
    )
  }

  const handleExpandedChange = (
    expandedState: ExpandedState | ((old: ExpandedState) => ExpandedState),
  ) => {
    const newExpanded =
      typeof expandedState === "function"
        ? expandedState(expanded)
        : expandedState

    setExpanded(newExpanded)

    const expandedRows = Object.keys(newExpanded).filter(
      (key) =>
        newExpanded[key as keyof ExpandedState] &&
        !expanded[key as keyof ExpandedState],
    )

    expandedRows.forEach((productIdKey) => {
      if (!variantsData[productIdKey] && !loadingVariants[productIdKey]) {
        setLoadingVariants((prev) => ({ ...prev, [productIdKey]: true }))
        getProductDetailMutation.mutate({
          filter: { productIds: [productIdKey] },
          paging: { page: 1, limit: MAX_VARIANTS_TO_SHOW },
        })
      }
    })
  }

  const sorting = (search?.sortBy || []).map((s, i) => ({
    id: s,
    desc: search?.sortDirection ? search?.sortDirection[i] === "desc" : false,
  }))

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
      columnPinning: {
        right: ["actions"],
      },
      expanded,
      sorting,
    },
    getRowId: (row) => row.productId.toString(),
    enableExpanding: true,
    onExpandedChange: handleExpandedChange,
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
    onSortingChange: (updater) => {
      const newValue = updater instanceof Function ? updater(sorting) : updater
      const order = newValue.map((s) => s.id)
      const desc = newValue.map((s) => (s.desc ? "desc" : "asc"))
      handleSetFilter({
        ...search,
        sortBy: order,
        sortDirection: desc,
      })
    },
  })

  return (
    <div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      <div className="bg-background rounded-lg p-4">
        <DataTable
          table={table}
          loading={loading}
          sticky
          renderSubrow={(row) => renderSubrow(row)}
          rowProps={() => ({
            className: "hover:bg-background",
          })}
        />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </div>
  )
}
