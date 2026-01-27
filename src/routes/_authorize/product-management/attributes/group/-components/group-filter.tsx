import { AttributeGroupStatusOptions } from "@/constants/attributes"
import { AttributesGroupSchema } from "@/schemas/schemas/attributes"
import {
  Button,
  cn,
  ComboboxMulti,
  InputField,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { RefreshCwIcon, SearchIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { useAttributeGroup } from "../-attribute-group-context"

export default function GroupFilter() {
  const { handleSetFilter, handleRefetchData, isRefetching } =
    useAttributeGroup()
  const search = useSearch({
    from: "/_authorize/product-management/attributes/group/",
  })
  const [searchText, setSearchText] = useState(search.searchText)
  const navigate = useNavigate()

  const debouncedHandleSearch = useCallback(
    _debounce((value: string) => {
      handleSetFilter({
        ...search,
        page: 1,
        searchText: value,
      })
    }, 300),
    [],
  )

  const handleSearch = (value: string) => {
    setSearchText(value)
    debouncedHandleSearch(value)
  }

  const handleResetFilter = () => {
    setSearchText("")
    navigate({
      to: "/product-management/attributes/group",
      search: AttributesGroupSchema.parse({}),
      replace: true,
    })
  }

  return (
    <div className="bg-background p-4 rounded-lg">
      <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
        <div className="w-full flex-auto">
          <InputField
            leftIcon={<SearchIcon size={14} className="text-gray-500" />}
            placeholder="Search by attribute group name or description"
            value={searchText}
            onChange={(value) => handleSearch(value.target.value)}
          />
        </div>
        <div className="flex-auto flex lg:items-center gap-4">
          <ComboboxMulti
            value={search.statuses?.map((v) => String(v))}
            placeholder="All status"
            options={AttributeGroupStatusOptions}
            allowClear
            modal
            onChange={(value) => {
              handleSetFilter({
                ...search,
                page: 1,
                statuses: value.map((v) => Number(v)),
              })
            }}
            className="w-[180px]"
          />
          <Button variant="outline" onClick={handleResetFilter}>
            Reset filter
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleRefetchData} variant="outline">
                <RefreshCwIcon
                  className={cn({ "animate-spin": isRefetching })}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Refresh data table</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
