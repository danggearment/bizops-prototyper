import {
  Button,
  cn,
  InputField,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { RefreshCwIcon, SearchIcon } from "lucide-react"
import { useAttributeLibraryDetail } from "../-attribute-library-detail-context"
import { LibraryProductTable } from "./library-product-table/table"

export function ProductUsedLibrary() {
  const { handleRefetchData, isRefetching, attributeLibraryDetail } =
    useAttributeLibraryDetail()

  const search = useSearch({
    from: "/_authorize/product-management/attributes/library/$libraryId/",
  })

  const navigate = useNavigate({
    from: "/product-management/attributes/library/$libraryId",
  })

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-1 lg:col-span-2">
          <p className="font-medium text-lg">Assigned Products</p>
          <div className="text-sm text-muted-foreground">
            Products currently using this attribute (
            {attributeLibraryDetail.productUsageCount})
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex space-x-4">
            <div className="w-full bg-background">
              <InputField
                leftIcon={<SearchIcon size={16} />}
                placeholder="Search by product name, code"
                value={search.searchText}
                onChange={(e) => {
                  navigate({
                    search: (old) => ({
                      ...old,
                      searchText: e.target.value,
                      page: 1,
                    }),
                    replace: true,
                  })
                }}
              />
            </div>
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
      <LibraryProductTable />
    </div>
  )
}
