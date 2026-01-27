import { Input } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useCallback, useState } from "react"
import { useOptionManagement } from "../../-option-management-context"

export default function OptionGroupsFilter() {
  const [search, setSearch] = useState("")
  const { setSearchCatalogGroup } = useOptionManagement()

  const debounceSearch = useCallback(
    _debounce((value: string) => {
      setSearchCatalogGroup(value)
    }, 500),
    [setSearchCatalogGroup],
  )

  return (
    <Input
      placeholder="Search option groups by name"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value)
        debounceSearch(e.target.value)
      }}
    />
  )
}
