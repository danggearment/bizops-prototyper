import { DateTime } from "@/components/common/date-time"
import {
  CatalogOption_Option,
  GMProductOption_OptionType,
} from "@/services/connect-rpc/types"
import {
  BoxEmpty,
  DataTable,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useTable,
} from "@gearment/ui3"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { InfoIcon } from "lucide-react"
import { useMemo } from "react"
import { useOptionManagement } from "../../../-option-management-context"
import CellActions from "./cell-actions"
import CellCode from "./cell-code"
import CellColor from "./cell-color"
import CellHexColor from "./cell-hex-color"
import CellMaterial from "./cell-material"
import CellName from "./cell-name"
import CellStatus from "./cell-status"

const columnHelper = createColumnHelper<CatalogOption_Option>()

export default function CatalogOptionTable() {
  const {
    catalogOptions,
    loadingCatalogOptions,
    catalogOptionsObserver,
    selectedOptionGroup,
  } = useOptionManagement()

  const columns: ColumnDef<CatalogOption_Option, any>[] = useMemo(
    () => [
      columnHelper.display({
        id: "color",
        header: "Color",
        meta: {
          width: 80,
        },
        cell: (props) => <CellColor {...props} />,
      }),

      columnHelper.display({
        id: "hex",
        header: "Hex color",
        meta: {
          width: 80,
        },
        cell: (props) => <CellHexColor {...props} />,
      }),

      columnHelper.display({
        id: "material",
        header: () => <div className="text-center">Image</div>,
        meta: {
          width: 80,
        },
        cell: (props) => <CellMaterial {...props} />,
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (props) => <CellName {...props} />,
      }),
      columnHelper.accessor("code", {
        header: () => (
          <div className="flex items-center gap-1">
            <span>Code</span>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon size={14} className="text-foreground/80" />
              </TooltipTrigger>
              <TooltipContent>
                Unique code used for variant generation.
              </TooltipContent>
            </Tooltip>
          </div>
        ),
        cell: (props) => <CellCode {...props} />,
      }),
      columnHelper.accessor("variantCount", {
        header: "Used by",
        meta: {
          width: 80,
        },
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        meta: {
          width: 60,
        },
        cell: (props) => <CellStatus {...props} />,
      }),
      columnHelper.accessor("createdAt", {
        header: "Created at",
        meta: {
          width: 130,
        },
        cell: (info) => {
          const createdAt = info.row.original.createdAt
          return createdAt ? <DateTime date={createdAt.toDate()} /> : "--"
        },
      }),
      columnHelper.accessor("updatedAt", {
        header: "Updated at",
        meta: {
          width: 130,
        },
        cell: (info) => {
          const updatedAt = info.row.original.updatedAt
          return updatedAt ? <DateTime date={updatedAt.toDate()} /> : "--"
        },
      }),
      columnHelper.display({
        id: "actions",
        header: () => <div className="text-right pr-2">Actions</div>,
        meta: {
          width: 100,
        },
        cell: (props) => <CellActions {...props} />,
      }),
    ],
    [selectedOptionGroup],
  )

  const table = useTable<CatalogOption_Option>({
    columns,
    data: catalogOptions || [],
    getRowId: (row) => row.code,
    state: {
      columnVisibility: {
        color: selectedOptionGroup?.type === GMProductOption_OptionType.COLOR,
        hex: selectedOptionGroup?.type === GMProductOption_OptionType.COLOR,
        material:
          selectedOptionGroup?.type === GMProductOption_OptionType.MATERIAL,
        actions: !selectedOptionGroup?.isDefault,
      },
    },
  })

  const rowProps = (): React.HTMLAttributes<HTMLTableRowElement> & {
    ref?: React.Ref<HTMLTableRowElement>
  } => {
    return {
      ref: (node: HTMLTableRowElement) => {
        catalogOptionsObserver(node)
      },
    }
  }

  return (
    <DataTable
      table={table}
      loading={loadingCatalogOptions}
      rowProps={rowProps}
      sticky
      stickyTop={284}
      containerRefId="catalog-option-list"
      noDataText={
        <BoxEmpty title="No data found" description="No values found" />
      }
    />
  )
}
