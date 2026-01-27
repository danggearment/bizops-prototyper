import { DateTime } from "@/components/common/date-time"
import { GMProductCategory_Admin_Short } from "@/services/connect-rpc/types"
import { Badge } from "@gearment/ui3"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { CellActions } from "./cell-actions"
import { CellDescription } from "./cell-description"
import { CellExpanded } from "./cell-expanded"
import CellName from "./cell-name"
import { CellSlug } from "./cell-slug"

const columnHelper = createColumnHelper<GMProductCategory_Admin_Short>()

interface CreateBaseColumnsOptions {
  actionsWidth?: number
  actionsPadding?: string
}

type ColumnDefBase = ColumnDef<GMProductCategory_Admin_Short, any>

function createBaseColumns(
  options: CreateBaseColumnsOptions = {},
): ColumnDefBase[] {
  const { actionsWidth = 86, actionsPadding = "pr-4" } = options

  return [
    columnHelper.accessor("categoryName", {
      header: "Category name",
      meta: {
        width: 140,
      },
      cell: (props) => <CellName {...props} />,
    }),
    columnHelper.accessor("categoryCode", {
      header: "Slug",
      meta: {
        width: 140,
      },
      cell: (props) => <CellSlug {...props} />,
    }),
    columnHelper.accessor("internalCategoryName", {
      header: "Display name",
      meta: {
        width: 100,
      },
      cell: ({ row }) => <div>{row.original.internalCategoryName || "--"}</div>,
    }),
    columnHelper.accessor("displayOrder", {
      header: () => <div className="text-center">Display order</div>,
      meta: {
        width: 100,
      },
      cell: ({ row }) => (
        <div className="text-center w-[100px]">{row.original.displayOrder}</div>
      ),
    }),
    columnHelper.accessor("isActive", {
      header: "Status",
      meta: {
        width: 100,
      },
      cell: ({ row }) => (
        <div className="w-[80px]">
          <Badge variant={row.original.isActive ? "success" : "warning"}>
            {row.original.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      ),
    }),
    columnHelper.display({
      id: "createdBy",
      header: "Created by",
      meta: {
        width: 100,
      },
      cell: () => <div>--</div>,
    }),
    columnHelper.accessor("createdAt", {
      header: "Created at",
      meta: {
        width: 145,
      },
      cell: ({ row }) =>
        row.original.createdAt ? (
          <DateTime date={row.original.createdAt.toDate()} />
        ) : (
          "--"
        ),
    }),
    columnHelper.accessor("updatedAt", {
      header: "Updated at",
      meta: {
        width: 145,
      },
      cell: ({ row }) =>
        row.original.updatedAt ? (
          <DateTime date={row.original.updatedAt.toDate()} />
        ) : (
          "--"
        ),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (props) => <CellDescription {...props} />,
    }),
    columnHelper.display({
      id: "actions",
      header: () => (
        <div className={`text-right ${actionsPadding}`}>Actions</div>
      ),
      meta: {
        width: actionsWidth,
      },
      cell: (props) => (
        <div className={`text-right ${actionsPadding}`}>
          <CellActions {...props} />
        </div>
      ),
    }),
  ]
}

interface CreateMainTableColumnsOptions {
  setCategoriesData: (
    data: React.SetStateAction<Record<string, GMProductCategory_Admin_Short[]>>,
  ) => void
  setLoadingCategories: (
    data: React.SetStateAction<Record<string, boolean>>,
  ) => void
  loadingCategories: Record<string, boolean>
}

export function createMainTableColumns(
  options: CreateMainTableColumnsOptions,
): ColumnDefBase[] {
  const { setCategoriesData, setLoadingCategories, loadingCategories } = options

  return [
    columnHelper.display({
      id: "collapsible",
      meta: {
        width: 40,
      },
      cell: ({ row }) => (
        <div className="w-[40px]">
          <CellExpanded
            row={row}
            setCategoriesData={setCategoriesData}
            setLoadingCategories={setLoadingCategories}
            loadingCategories={loadingCategories}
          />
        </div>
      ),
    }),
    ...createBaseColumns({ actionsWidth: 86, actionsPadding: "pr-4" }),
  ]
}

export function createExpandedRowColumns(): ColumnDefBase[] {
  return createBaseColumns({ actionsWidth: 70, actionsPadding: "" })
}
