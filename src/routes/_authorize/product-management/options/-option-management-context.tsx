import {
  useInfiniteCatalogOptions,
  useInfiniteOptionGroups,
} from "@/data-center/products/use-query"
import {
  CatalogOption_Group,
  CatalogOption_Option,
} from "@/services/connect-rpc/types"
import { createContext, useContext, useEffect, useState } from "react"

interface OptionManagementContext {
  optionGroupsObserver: (node: HTMLDivElement) => void
  optionGroups: CatalogOption_Group[]
  loadingOptionGroups: boolean
  selectedOptionGroup: CatalogOption_Group | null
  setSelectedOptionGroup: (optionGroup: CatalogOption_Group | null) => void
  searchCatalogGroup: string
  setSearchCatalogGroup: (search: string) => void
  catalogOptionsObserver: (node: HTMLDivElement) => void
  catalogOptions: CatalogOption_Option[] | undefined
  loadingCatalogOptions: boolean
  searchCatalogOption: string
  setSearchCatalogOption: (search: string) => void
}

const OptionManagementContext = createContext<OptionManagementContext>({
  optionGroupsObserver: () => {},
  optionGroups: [],
  loadingOptionGroups: false,
  selectedOptionGroup: null,
  setSelectedOptionGroup: () => {},
  searchCatalogGroup: "",
  setSearchCatalogGroup: () => {},
  catalogOptionsObserver: () => {},
  catalogOptions: undefined,
  loadingCatalogOptions: false,
  searchCatalogOption: "",
  setSearchCatalogOption: () => {},
})

export const OptionManagementProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [searchCatalogGroup, setSearchCatalogGroup] = useState<string>("")

  const [searchCatalogOption, setSearchCatalogOption] = useState<string>("")

  const [selectedOptionGroup, setSelectedOptionGroup] =
    useState<CatalogOption_Group | null>(null)

  const { optionGroupsObserver, optionGroups, loadingOptionGroups } =
    useInfiniteOptionGroups(searchCatalogGroup)

  const { catalogOptionsObserver, catalogOptions, loadingCatalogOptions } =
    useInfiniteCatalogOptions(selectedOptionGroup?.groupId, searchCatalogOption)

  useEffect(() => {
    if (optionGroups.length > 0 && !selectedOptionGroup) {
      setSelectedOptionGroup(optionGroups[0])
    }
  }, [loadingOptionGroups])

  return (
    <OptionManagementContext.Provider
      value={{
        optionGroupsObserver,
        optionGroups,
        loadingOptionGroups,
        selectedOptionGroup,
        setSelectedOptionGroup,
        searchCatalogGroup,
        setSearchCatalogGroup,
        catalogOptionsObserver,
        catalogOptions,
        loadingCatalogOptions,
        searchCatalogOption,
        setSearchCatalogOption,
      }}
    >
      {children}
    </OptionManagementContext.Provider>
  )
}

export const useOptionManagement = () => {
  const content = useContext(OptionManagementContext)
  if (!content) {
    throw Error("OptionManagementContext is not created")
  }
  return content
}
