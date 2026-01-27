import FormSearch from "@/components/form-search/form-search"
import { ShippingPlanStatusLabel } from "@/constants/enum-label"
import { UserListShippingPlanRequestSchema } from "@/schemas/schemas/shipping-plan"
import { appTimezone } from "@/utils"
import { ShippingPlan_Status } from "@gearment/nextapi/api/ffm/v1/cross_dock_pb"
import {
  Button,
  ComboboxMulti,
  DateRangeDatePicker,
  formatDateRangeForSearching,
  SelectDateRange,
  toast,
} from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import dayjs from "dayjs"
import { RefreshCcwIcon } from "lucide-react"
const statusOptions = [
  {
    label: ShippingPlanStatusLabel[ShippingPlan_Status.NEW],
    value: ShippingPlan_Status.NEW,
  },
  {
    label: ShippingPlanStatusLabel[ShippingPlan_Status.UNDER_REVIEW],
    value: ShippingPlan_Status.UNDER_REVIEW,
  },
  {
    label: ShippingPlanStatusLabel[ShippingPlan_Status.PROCESSING],
    value: ShippingPlan_Status.PROCESSING,
  },
  {
    label: ShippingPlanStatusLabel[ShippingPlan_Status.AWAITING_PACKING],
    value: ShippingPlan_Status.AWAITING_PACKING,
  },
  {
    label: ShippingPlanStatusLabel[ShippingPlan_Status.READY_FOR_SHIPPING],
    value: ShippingPlan_Status.READY_FOR_SHIPPING,
  },
  {
    label: ShippingPlanStatusLabel[ShippingPlan_Status.SHIPPED],
    value: ShippingPlan_Status.SHIPPED,
  },
  {
    label: ShippingPlanStatusLabel[ShippingPlan_Status.RECEIVED],
    value: ShippingPlan_Status.RECEIVED,
  },
  {
    label: ShippingPlanStatusLabel[ShippingPlan_Status.CANCELED],
    value: ShippingPlan_Status.CANCELED,
  },
  {
    label: ShippingPlanStatusLabel[ShippingPlan_Status.EXCEPTION],
    value: ShippingPlan_Status.EXCEPTION,
  },
]

interface Props {
  refetch: () => void
}

export default function Filter({ refetch }: Props) {
  const search = useSearch({
    from: "/_authorize/fulfillment/shipping-plans/",
  })
  const navigate = useNavigate({
    from: "/fulfillment/shipping-plans",
  })

  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    navigate({
      to: "/fulfillment/shipping-plans",
      search: (prev) => {
        return {
          ...prev,
          page: 1,
          fromDate: fromTo.from,
          toDate: fromTo.to,
        }
      },
      replace: true,
    })
  }

  return (
    <div className="bg-background rounded-lg p-4 space-y-4">
      <FormSearch
        onSubmit={(value) => {
          navigate({
            to: "/fulfillment/shipping-plans",
            search: (prev) => {
              return {
                ...prev,
                page: 1,
                searchText: value.searchText,
              }
            },
            replace: true,
          })
        }}
        placeholder="Search by shipping plan"
      />
      <div className="flex gap-2">
        <div className="w-[200px]">
          <SelectDateRange
            from={
              search.fromDate
                ? dayjs(search.fromDate).startOf("D").toDate()
                : undefined
            }
            to={
              search.toDate
                ? dayjs(search.toDate).endOf("D").toDate()
                : undefined
            }
            onChange={(value) => handleSetDate(value)}
            timezone={appTimezone.getTimezone()}
          />
        </div>
        <div className="w-[200px]">
          <ComboboxMulti
            options={statusOptions.map((item) => ({
              label: item.label,
              value: item.value.toString(),
            }))}
            onChange={(value) => {
              navigate({
                to: "/fulfillment/shipping-plans",
                search: (prev) => {
                  return {
                    ...prev,
                    page: 1,
                    status: value.map((item) => Number(item)),
                  }
                },
                replace: true,
              })
            }}
            placeholder="Select status"
            value={search.status?.map((item) => item.toString())}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigate({
              to: "/fulfillment/shipping-plans",
              search: UserListShippingPlanRequestSchema.parse({}),
              replace: true,
            })
          }}
        >
          Reset filter
        </Button>
        <Button
          onClick={async () => {
            await refetch()
            toast({
              title: "Refetching data",
              description: "Refetching data successfully",
            })
          }}
          variant="outline"
          size="sm"
        >
          <RefreshCcwIcon />
        </Button>
      </div>
    </div>
  )
}
