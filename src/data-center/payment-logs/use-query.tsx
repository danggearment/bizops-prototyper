import { useQueryFinance } from "@/services/connect-rpc/transport"
import {
  staffListCheckoutRequest,
  staffListCheckoutRequestFilterCriteria,
} from "@gearment/nextapi/api/payment/v1/api_staff_checkout_request-StaffCheckoutRequestService_connectquery"
import {
  StaffCheckoutRequest_Filter,
  StaffCheckoutRequest_SortCriterion,
} from "@gearment/nextapi/api/payment/v1/data_staff_checkout_request_pb"
import { Paging } from "@gearment/nextapi/common/type/v1/paging_pb"

export const usePaymentLogsQuery = ({
  pagination,
  filter,
  sortCriterion,
}: {
  pagination: Paging
  filter: StaffCheckoutRequest_Filter
  sortCriterion?: StaffCheckoutRequest_SortCriterion
}) => {
  const query = useQueryFinance(staffListCheckoutRequest, {
    pagination,
    filter,
    sortCriterion,
  })
  return query
}

export const usePaymentLogsCriteria = () => {
  const query = useQueryFinance(staffListCheckoutRequestFilterCriteria)
  return query.data
}
