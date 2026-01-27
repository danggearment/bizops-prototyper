import { BoxEmpty, LoadingCircle } from "@gearment/ui3"
import { useOptionManagement } from "../../-option-management-context"
import CatalogOptionList from "../catalog-option/catalog-option-list"
import OptionGroupItem from "./option-group-item"
import OptionGroupsFilter from "./option-groups-filter"

export default function OptionGroups() {
  const {
    optionGroupsObserver,
    optionGroups,
    loadingOptionGroups,
    catalogOptions,
    selectedOptionGroup,
  } = useOptionManagement()

  return (
    <div className="grid grid-cols-[20rem_minmax(0,1fr)] gap-4">
      <div className="bg-background rounded-lg">
        <p className="text-lg font-medium mb-2 pt-4 px-4">Option groups</p>
        <div className="p-4">
          <OptionGroupsFilter />
        </div>
        <div className="h-[calc(100vh-340px)] overflow-y-auto">
          {loadingOptionGroups && (
            <div className="flex items-center justify-center">
              <LoadingCircle size="lg" />
            </div>
          )}
          <div className="space-y-3 p-4 pt-2">
            {optionGroups.map((group) => (
              <div key={group.groupId} ref={optionGroupsObserver}>
                <OptionGroupItem group={group} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-background rounded-lg">
        <div className="h-[calc(100vh-300px)] p-4">
          {!selectedOptionGroup && !catalogOptions && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <BoxEmpty
                title="No option group selected"
                description="Select an option group to view and manage its values"
              />
            </div>
          )}
          {selectedOptionGroup && <CatalogOptionList />}
        </div>
      </div>
    </div>
  )
}
