import { ProductPriceTierType } from "@/constants/order"
import { useMutationPod } from "@/services/connect-rpc/transport"
import { GMProduct_TeamProductDetail_Variant } from "@/services/connect-rpc/types"
import { formatPrice } from "@/utils/format-currency"
import { staffListProductVariant } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import {
  ProductPriceTierAdmin,
  StaffListProductPriceTierKeyResponse_Key,
  StaffListProductVariantRequest_SortCriterion_SortBy,
  StaffListProductVariantRequest_SortCriterion_SortDirection,
  StaffListProductVariantResponse,
} from "@gearment/nextapi/api/pod/v1/product_admin_pb"
import {
  Button,
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
import { formatShortenText, formatTextMany } from "@gearment/utils"
import {
  Link,
  ParsedLocation,
  useLocation,
  useNavigate,
  useSearch,
} from "@tanstack/react-router"
import { ColumnDef, ExpandedState, Row } from "@tanstack/react-table"
import { ChevronDown, ChevronRight, Tally1 } from "lucide-react"
import { useState } from "react"
import { usePriceTier } from "../price-tier-context"

const shortName = (name: string) => {
  return formatShortenText(name, 20, 10)
}

function generateColumns(
  keys: StaffListProductPriceTierKeyResponse_Key[],
  productPriceTierType: ProductPriceTierType,
  location: ParsedLocation<any>,
): ColumnDef<ProductPriceTierAdmin>[] {
  return [
    {
      header: () => (
        <div>
          <span className="text-base font-medium">Product/Variant</span>
        </div>
      ),
      accessorKey: "productId",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <Button
              disabled={Number(row.original.totalVariants) === 0}
              onClick={() => row.toggleExpanded()}
              variant="ghost"
              size="icon"
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </Button>
            <div>
              <div
                className="font-medium text-base truncate pr-2"
                title={row.original.productName}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>{shortName(row.original.productName)}</span>
                  </TooltipTrigger>
                  <TooltipContent>{row.original.productName}</TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm text-gray-500">
                {formatTextMany("variant", row.original.totalVariants)}
              </p>
            </div>
          </div>
        )
      },
    },
    ...keys.map((key) => ({
      id: key.tierId,
      header: () => (
        <Link
          to="/system/teams"
          search={{
            tierIds: [key.tierId],
          }}
          state={location}
          className="flex items-center justify-center gap-1 min-w-[100px] hover:underline"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: key.color,
            }}
          ></div>
          <span className="truncate text-base font-medium">{key.tierName}</span>
        </Link>
      ),
      accessorKey: key.tierId,
      cell: ({ row }: { row: Row<ProductPriceTierAdmin> }) => {
        const price =
          productPriceTierType === ProductPriceTierType.FBM
            ? row.original?.productPriceTiers?.[key.tierId]?.price
            : row.original?.productPriceTiers?.[key.tierId]?.priceFba
        const formattedPrice = price ? formatPrice(price) : "--"

        return (
          <div className="flex justify-center">
            <div
              className="min-w-[80px] max-w-[120px] text-center px-1 py-0.5 rounded-full font-medium text-sm whitespace-nowrap overflow-hidden"
              style={{
                backgroundColor: key.bgColor,
                color: key.color,
              }}
              title={formattedPrice}
            >
              {formattedPrice}
            </div>
          </div>
        )
      },
    })),
  ]
}

const ProductVariantSubrows = ({
  row,
  keys,
  productPriceTierType,
  variantsData,
  loadingVariants,
  onVariantPageChange,
}: {
  row: Row<ProductPriceTierAdmin>
  keys: StaffListProductPriceTierKeyResponse_Key[]
  productPriceTierType: ProductPriceTierType
  variantsData: Record<string, StaffListProductVariantResponse>
  loadingVariants: Record<string, boolean>
  onVariantPageChange?: (productId: string, page: number, limit: number) => void
}) => {
  const productIdKey = String(row.original.productId)
  const isLoading = loadingVariants[productIdKey]
  const data = variantsData[productIdKey]
  const variants = data?.data || []
  const paging = data?.paging
  const total = Number(paging?.total) || 0
  const page = Number(paging?.page) || 1
  const limit = Number(paging?.limit) || 10
  const totalPage = Number(paging?.totalPage) || 0

  const subTable = useTable({
    columns: [],
    data: variants,
    rowCount: total,
    pageCount: totalPage,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    onPaginationChange: (updater) => {
      if (!onVariantPageChange) return
      const newValue =
        updater instanceof Function
          ? updater({
              pageIndex: page - 1,
              pageSize: limit,
            })
          : updater
      onVariantPageChange(
        productIdKey,
        newValue.pageIndex + 1,
        newValue.pageSize,
      )
    },
  })

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={keys.length + 1}>
          <div className="flex items-center justify-center py-4">
            <LoadingCircle size="sm" />
          </div>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <>
      {variants.map(
        (subRow: GMProduct_TeamProductDetail_Variant, index: number) => (
          <TableRow key={`${productIdKey}-${subRow.variantId || index}`}>
            <TableCell className="bg-background sticky opacity-95 left-0 shadow-[-3px_0_4px_-4px_gray_inset]">
              <div className="ml-4 flex items-center gap-1">
                <span className="text-gray-400 text-sm">
                  <Tally1 className="w-4 h-4" />
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>{shortName(subRow.variantName)}</span>
                  </TooltipTrigger>
                  <TooltipContent>{subRow.variantName}</TooltipContent>
                </Tooltip>
              </div>
            </TableCell>
            {keys.map((key) => {
              const priceInfo = subRow?.priceTiers?.[key.tierId]
              let price =
                productPriceTierType === ProductPriceTierType.FBM
                  ? priceInfo?.priceFbm
                  : priceInfo?.priceFba
              if (!price) {
                price =
                  productPriceTierType === ProductPriceTierType.FBM
                    ? row.original?.productPriceTiers?.[key.tierId]?.price
                    : row.original?.productPriceTiers?.[key.tierId]?.priceFba
              }
              return (
                <TableCell key={key.tierId}>
                  <div className="flex justify-center">
                    <div
                      className="min-w-[80px] max-w-[120px] text-center px-1 py-0.5 rounded-full font-medium text-sm whitespace-nowrap overflow-hidden"
                      style={{
                        backgroundColor: key.bgColor,
                        color: key.color,
                      }}
                    >
                      {price ? formatPrice(price) : "--"}
                    </div>
                  </div>
                </TableCell>
              )
            })}
          </TableRow>
        ),
      )}

      {totalPage > 1 && (
        <TableRow key={`${productIdKey}-pagination`}>
          <TableCell colSpan={keys.length + 1} className="py-2 bg-muted/20">
            <div className="sticky left-0">
              <TablePagination
                table={subTable}
                limitOptions={[10, 20, 50, 100]}
              />
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

export default function PriceTierTable() {
  const search = useSearch({
    from: "/_authorize/global-configuration/tier-management/",
  })
  const navigate = useNavigate({
    from: "/global-configuration/tier-management",
  })
  const location = useLocation()

  const {
    tierPrices,
    rowCount,
    pageCount,
    isLoading,
    priceTierKeys,
    isLoadingKey,
  } = usePriceTier()

  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [variantsData, setVariantsData] = useState<
    Record<string, StaffListProductVariantResponse>
  >({})
  const [loadingVariants, setLoadingVariants] = useState<
    Record<string, boolean>
  >({})
  const [variantPaging, setVariantPaging] = useState<
    Record<string, { page: number; limit: number }>
  >({})

  const getProductDetailMutation = useMutationPod(staffListProductVariant, {
    onSuccess: (data, variables) => {
      const productIdKey = String(variables.filter?.productIds?.[0])
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
      const productIdKey = String(variables.filter?.productIds?.[0])
      setLoadingVariants((prev) => ({
        ...prev,
        [productIdKey]: false,
      }))
    },
  })

  const handleVariantPageChange = (
    productIdKey: string,
    page: number,
    limit: number,
  ) => {
    setVariantPaging((prev) => ({ ...prev, [productIdKey]: { page, limit } }))
    setLoadingVariants((prev) => ({ ...prev, [productIdKey]: true }))
    getProductDetailMutation.mutate({
      filter: { productIds: [productIdKey] },
      paging: { page, limit },
      sortCriterion: [
        {
          sortBy:
            StaffListProductVariantRequest_SortCriterion_SortBy.PRODUCT_OPTION,
          sortDirection:
            StaffListProductVariantRequest_SortCriterion_SortDirection.ASC,
        },
      ],
    })
  }

  const columns = generateColumns(priceTierKeys, search.type, location)

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
        const paging = variantPaging[productIdKey] || { page: 1, limit: 10 }
        getProductDetailMutation.mutate({
          filter: { productIds: [productIdKey] },
          paging: paging,
          sortCriterion: [
            {
              sortBy:
                StaffListProductVariantRequest_SortCriterion_SortBy.PRODUCT_OPTION,
              sortDirection:
                StaffListProductVariantRequest_SortCriterion_SortDirection.ASC,
            },
          ],
        })
      }
    })
  }

  const table = useTable({
    columns: columns,
    data: tierPrices,
    rowCount: rowCount,
    pageCount: pageCount,
    getRowId: (row) => String(row.productId),
    state: {
      columnPinning: {
        left: ["productId"],
      },
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
      expanded,
    },
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
        search: (old) => ({
          ...old,
          page: newValue.pageIndex + 1,
          limit: newValue.pageSize,
        }),
        replace: true,
      })
    },
  })
  if (isLoadingKey || isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingCircle size={"lg"} />
      </div>
    )
  }
  return (
    <div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      <div className="bg-background rounded-lg p-4">
        <DataTable
          sticky
          loading={isLoading}
          table={table}
          renderSubrow={(row) => (
            <ProductVariantSubrows
              row={row}
              keys={priceTierKeys}
              productPriceTierType={search.type}
              variantsData={variantsData}
              loadingVariants={loadingVariants}
              onVariantPageChange={handleVariantPageChange}
            />
          )}
        />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </div>
  )
}
