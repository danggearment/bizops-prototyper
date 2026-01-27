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
import { usePrintTypeDetail } from "../-print-type-detail-context"
import { TypeProductTable } from "./type-product-table/type-product-table"

export function ProductUsedPrintType() {
  const { handleRefetchData, isRefetching, printTypeDetail } =
    usePrintTypeDetail()

  const search = useSearch({
    from: "/_authorize/product-management/prints/type/$typeId/",
  })

  const navigate = useNavigate({
    from: "/product-management/prints/type/$typeId",
  })

  return (
    <div className="space-y-4 p-4 rounded-md bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-1 lg:col-span-2">
          <p className="font-medium text-lg">Products using this type</p>
          <div className="text-sm text-muted-foreground">
            Products configured with this print type{" "}
            {Number(printTypeDetail.usageProductCount || 0)}
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex space-x-4">
            <div className="w-full">
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
      <TypeProductTable />
    </div>
  )
}
