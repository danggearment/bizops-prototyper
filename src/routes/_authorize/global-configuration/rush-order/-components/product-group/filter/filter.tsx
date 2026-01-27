import FormSearch from "@/components/form-search/form-search"
import { RushOrderSearchSchema } from "@/schemas/schemas/global-configuration"
import { queryClient } from "@/services/react-query"
import { staffListRushProductGroup } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { RushProductGroupStatus } from "@gearment/nextapi/api/pod/v1/product_admin_pb"
import { Button, Combobox } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { RefreshCcwIcon } from "lucide-react"

const listStatusOptions = [
  {
    label: "All",
    value: RushProductGroupStatus.ALL.toString(),
  },
  {
    label: "Active",
    value: RushProductGroupStatus.ACTIVE.toString(),
  },
  {
    label: "Inactive",
    value: RushProductGroupStatus.INACTIVE.toString(),
  },
]
export default function Filter() {
  const navigate = useNavigate({
    from: "/global-configuration/rush-order",
  })
  const search = useSearch({
    from: "/_authorize/global-configuration/rush-order/",
  })

  return (
    <div className="space-y-4 bg-background rounded-lg p-4">
      <div>
        <FormSearch
          placeholder="Search"
          value={search.search}
          onSubmit={(values) => {
            navigate({
              search: (old) => ({
                ...old,
                page: 1,
                search: values.searchText,
              }),
              replace: true,
            })
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="max-w-[200px] w-[200px]">
          <Combobox
            placeholder="Status"
            value={search.status}
            options={listStatusOptions}
            onChange={(values) => {
              navigate({
                search: (old) => ({
                  ...old,
                  page: 1,
                  status: values,
                }),
                replace: true,
              })
            }}
          />
        </div>
        <Button
          variant={"outline"}
          onClick={() => {
            navigate({
              search: () => ({
                ...RushOrderSearchSchema.parse({}),
              }),
            })
          }}
        >
          Reset filter
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: [
                staffListRushProductGroup.service.typeName,
                staffListRushProductGroup.name,
              ],
            })
          }}
        >
          <RefreshCcwIcon />
        </Button>
      </div>
    </div>
  )
}
