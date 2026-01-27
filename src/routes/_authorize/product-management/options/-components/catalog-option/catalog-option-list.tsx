import { useOptionManagement } from "../../-option-management-context"
import CatalogOptionFilter from "./catalog-option-filter"
import CatalogOptionTable from "./table/table"

export default function CatalogOptionList() {
  const { selectedOptionGroup } = useOptionManagement()
  return (
    <>
      <CatalogOptionFilter group={selectedOptionGroup!} />
      <div
        className="h-[calc(100vh-354px)] overflow-y-auto"
        id="catalog-option-list"
      >
        <CatalogOptionTable />
      </div>
    </>
  )
}
