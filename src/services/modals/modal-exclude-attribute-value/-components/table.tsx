import { AttributeGroupValueStatusLabel } from "@/constants/attributes"
import {
  AttributeGroupValueStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import { useInfiniteExcludeAttributeValues } from "@/data-center/attributes"
import { GMAttribute_Admin_Value } from "@/services/connect-rpc/types"
import { Badge, DataTable, useTable } from "@gearment/ui3"
import {
  ColumnDef,
  createColumnHelper,
  RowSelectionState,
} from "@tanstack/react-table"
import React from "react"
import CellCheckbox from "./cell-checkbox"
import { CellName } from "./cell-name"
import CellSelect from "./cell-select"

interface Props {
  groupId: string
  search: string
  setSelectedValues: React.Dispatch<React.SetStateAction<RowSelectionState>>
  selectedValues: RowSelectionState
}

const columnHelper = createColumnHelper<GMAttribute_Admin_Value>()

export const ExcludeAttributeValueTable = ({
  groupId,
  search,
  setSelectedValues,
  selectedValues,
}: Props) => {
  const {
    excludeAttributeValues,
    excludeAttributeValuesObserver,
    loadingExcludeAttributeValues,
  } = useInfiniteExcludeAttributeValues(groupId, search)

  const columns: ColumnDef<GMAttribute_Admin_Value, any>[] = [
    {
      id: "select",
      meta: {
        width: 40,
      },
      header: (props) => (
        <CellCheckbox
          {...{
            checked: props.table.getIsAllRowsSelected(),
            onChange: props.table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: (props) => {
        return (
          <CellSelect
            {...props}
            {...{
              error: true,
              checked: props.row.getIsSelected(),
              disabled: !props.row.getCanSelect(),
              onCheckedChange: props.row.getToggleSelectedHandler(),
            }}
          />
        )
      },
    },
    columnHelper.accessor("attrValue", {
      header: "Attribute name",
      cell: ({ row }) => <CellName name={row.original.attrValue} />,
    }),
    columnHelper.accessor("attrCode", {
      header: "Code",
      cell: ({ row }) => <CellName name={row.original.attrCode} />,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={mappingColor(
            AttributeGroupValueStatusColorsMapping,
            row.original.status,
          )}
        >
          {AttributeGroupValueStatusLabel[row.original.status]}
        </Badge>
      ),
    }),
  ]

  const table = useTable<GMAttribute_Admin_Value>({
    columns,
    data: excludeAttributeValues || [],
    state: {
      rowSelection: selectedValues,
    },
    getRowId: (row) => row.attrCode,
    onRowSelectionChange: setSelectedValues,
  })

  const rowProps = (): React.HTMLAttributes<HTMLTableRowElement> & {
    ref?: React.Ref<HTMLTableRowElement>
  } => {
    return {
      ref: (node: HTMLTableRowElement) => {
        excludeAttributeValuesObserver(node)
      },
    }
  }

  return (
    <DataTable
      table={table}
      loading={loadingExcludeAttributeValues}
      rowProps={rowProps}
      sticky
      stickyTop={284}
      containerRefId="exclude-attribute-value-list"
    />
  )
}
