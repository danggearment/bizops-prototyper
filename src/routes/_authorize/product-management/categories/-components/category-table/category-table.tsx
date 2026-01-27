import { useMutationPod } from "@/services/connect-rpc/transport"
import { GMProductCategory_Admin_Short } from "@/services/connect-rpc/types"
import { staffListGMProductCategory } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import {
  DataTable,
  LoadingCircle,
  TableCell,
  TablePagination,
  TableRow,
  useTable,
} from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ExpandedState, Row } from "@tanstack/react-table"
import { useState } from "react"
import { useCategoryManagement } from "../../-category-management-context"
import { createMainTableColumns } from "./columns"
import { RowExpanded } from "./row-expanded"

export function CategoryTable() {
  const { categories, rowCount, pageCount, loading } = useCategoryManagement()

  const [expanded, setExpanded] = useState<ExpandedState>({})

  const [categoriesData, setCategoriesData] = useState<
    Record<string, GMProductCategory_Admin_Short[]>
  >({})
  const [loadingCategories, setLoadingCategories] = useState<
    Record<string, boolean>
  >({})

  const search = useSearch({
    from: "/_authorize/product-management/categories/",
  })

  const navigate = useNavigate({ from: "/product-management/categories" })

  const columns = createMainTableColumns({
    setCategoriesData,
    setLoadingCategories,
    loadingCategories,
  })

  const getChildCategoryMutation = useMutationPod(staffListGMProductCategory, {
    onSuccess: (data, variables) => {
      const categoryIdKey = String(variables.filter?.parentIds?.[0])
      setCategoriesData((prev) => ({
        ...prev,
        [categoryIdKey]: data.data,
      }))
      setLoadingCategories((prev) => ({
        ...prev,
        [categoryIdKey]: false,
      }))
    },
    onError: (_error, variables) => {
      const categoryIdKey = String(variables.filter?.parentIds?.[0])
      setLoadingCategories((prev) => ({
        ...prev,
        [categoryIdKey]: false,
      }))
    },
  })

  const renderSubrow = (row: Row<GMProductCategory_Admin_Short>) => {
    const categoryIdKey = String(row.original.id)
    const isLoading = loadingCategories[categoryIdKey]
    const categories = categoriesData[categoryIdKey] || []

    if (isLoading) {
      return (
        <TableRow>
          <TableCell
            colSpan={row.getAllCells().length}
            className="py-6 bg-gray-100"
          >
            <div className="flex items-center justify-center py-4">
              <LoadingCircle size="sm" />
            </div>
          </TableCell>
        </TableRow>
      )
    }
    return (
      <TableRow>
        <TableCell colSpan={row.getAllCells().length} className="p-0">
          <RowExpanded
            parentCategory={row}
            categories={categories}
            loading={loadingCategories[categoryIdKey]}
          />
        </TableCell>
      </TableRow>
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

    expandedRows.forEach((categoryIdKey) => {
      if (!categoriesData[categoryIdKey] && !loadingCategories[categoryIdKey]) {
        setLoadingCategories((prev) => ({ ...prev, [categoryIdKey]: true }))
        getChildCategoryMutation.mutate({
          filter: { parentIds: [BigInt(categoryIdKey)] },
        })
      }
    })
  }

  const table = useTable({
    data: categories,
    columns: columns,
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
    },
    getRowId: (row) => row.id.toString(),
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
  })

  return (
    <div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      <div className="bg-background rounded-lg p-4">
        <DataTable
          table={table}
          loading={loading}
          renderSubrow={renderSubrow}
          noDataText="No matching categories found."
        />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </div>
  )
}
