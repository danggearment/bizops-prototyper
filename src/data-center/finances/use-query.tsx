import { useQueryFinance } from "@/services/connect-rpc/transport"
import { staffListPaymentMethod } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"

export const useListPaymentMethod = () => {
  const {
    data: listPaymentMethod,
    isRefetching,
    refetch,
  } = useQueryFinance(
    staffListPaymentMethod,
    {},
    {
      select: (response) => response.data || [],
    },
  )
  return {
    listPaymentMethod,
    isRefetching,
    refetch,
  }
}
