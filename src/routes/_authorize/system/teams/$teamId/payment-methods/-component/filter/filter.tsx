import {
  AllLinkedPaymentMethodStatus,
  LinkedPaymentMethodStatusLabel,
} from "@/constants/payment"
import { TeamLinkedPaymentMethodType } from "@/schemas/schemas/payment"
import { useQueryFinance } from "@/services/connect-rpc/transport"
import { staffListPaymentMethod } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import { Combobox } from "@gearment/ui3"
import { useSearch } from "@tanstack/react-router"
import { useMemo } from "react"

const StoreStatusOption = [
  {
    value: `${AllLinkedPaymentMethodStatus.UNSPECIFIED}`,
    label:
      LinkedPaymentMethodStatusLabel[AllLinkedPaymentMethodStatus.UNSPECIFIED],
  },
  {
    value: `${AllLinkedPaymentMethodStatus.INACTIVE}`,
    label:
      LinkedPaymentMethodStatusLabel[AllLinkedPaymentMethodStatus.INACTIVE],
  },
  {
    value: `${AllLinkedPaymentMethodStatus.ACTIVE}`,
    label: LinkedPaymentMethodStatusLabel[AllLinkedPaymentMethodStatus.ACTIVE],
  },
]

interface Props {
  handleChangeSearch: (search: TeamLinkedPaymentMethodType) => void
}

export default function Filter({ handleChangeSearch }: Props) {
  const search = useSearch({
    from: "/_authorize/system/teams/$teamId/payment-methods/",
  })

  const { data: listPaymentMethod } = useQueryFinance(
    staffListPaymentMethod,
    {},
    {
      select: (response) => response.data || [],
    },
  )
  const listPaymentMethodOptions = useMemo(() => {
    if (!listPaymentMethod) {
      return []
    }
    return listPaymentMethod.map((method) => ({
      label: method.name,
      value: method.methodCode,
    }))
  }, [listPaymentMethod])

  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="w-[200px]">
        <Combobox
          placeholder="Status"
          value={search.status ? `${search.status}` : undefined}
          options={StoreStatusOption}
          onChange={(value) => {
            handleChangeSearch({
              ...search,
              status: value ? [Number(value)] : [],
            })
          }}
        />
      </div>

      <div className="w-[200px]">
        <Combobox
          placeholder="Payment method"
          value={
            search.payment_methods ? `${search.payment_methods}` : undefined
          }
          options={listPaymentMethodOptions}
          onChange={(value) => {
            handleChangeSearch({
              ...search,
              payment_methods: value ? [value] : [],
            })
          }}
        />
      </div>
    </div>
  )
}
