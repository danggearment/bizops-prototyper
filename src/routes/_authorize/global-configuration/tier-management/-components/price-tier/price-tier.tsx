import { ProductPriceTierType } from "@/constants/order"
import { TierManagementSearchSchemaType } from "@/schemas/schemas/global-configuration"
import { Input, Tabs, TabsList, TabsTrigger } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useCallback, useRef } from "react"
import PriceTierTable from "./table/table"

const tabs = [
  {
    key: ProductPriceTierType.FBM,
    value: ProductPriceTierType.FBM,
  },
  {
    key: ProductPriceTierType.FBA,
    value: ProductPriceTierType.FBA,
  },
]
export default function PriceTier() {
  const navigate = useNavigate({
    from: "/global-configuration/tier-management",
  })
  const search = useSearch({
    from: "/_authorize/global-configuration/tier-management/",
  })
  const handleSelectTab = (v: ProductPriceTierType) => {
    navigate({
      search: (old) => ({
        ...old,
        type: v,
      }),
    })
  }

  const searchRef = useRef<HTMLInputElement>(null)

  const _debouceSubmit = useCallback(
    _debounce((newFilter: TierManagementSearchSchemaType) => {
      navigate({
        search: (old) => ({
          ...old,
          search: newFilter.search,
          page: 1,
        }),
      })
    }, 600),
    [],
  )

  const handleSearchChange = (value: string) => {
    _debouceSubmit({
      ...search,
      search: value,
    })
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="w-full bg-background p-4 rounded-lg">
          <Input
            placeholder="Search by products or variants"
            defaultValue={search.search}
            ref={searchRef}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        value={search.type}
        onValueChange={(v) => handleSelectTab(v as ProductPriceTierType)}
      >
        <TabsList className="bg-sidebar">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.value} className="w-[100px]">
              {tab.value}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <PriceTierTable />
    </div>
  )
}
