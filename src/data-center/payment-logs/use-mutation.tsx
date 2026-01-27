import { useMutationFinance } from "@/services/connect-rpc/transport"
import {
  staffCountCheckoutRequestForExport,
  staffExportCheckoutRequest,
} from "@gearment/nextapi/api/payment/v1/api_staff_checkout_request-StaffCheckoutRequestService_connectquery"

export const useCountPaymentLogsCriteriaMutation = () => {
  const mutation = useMutationFinance(staffCountCheckoutRequestForExport)
  return mutation
}
export const useExportPaymentLogsCriteriaMutation = () => {
  const mutation = useMutationFinance(staffExportCheckoutRequest)
  return mutation
}
