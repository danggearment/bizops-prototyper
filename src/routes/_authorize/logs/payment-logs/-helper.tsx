import { PaymentLogsSearchType } from "@/schemas/schemas/payment-logs"
import { formatDateForCallApi } from "@/utils/format-date"
import {
  StaffCheckoutRequest_Filter,
  StaffCheckoutRequest_SortCriterion,
  StaffCheckoutRequest_SortCriterion_SortBy,
  StaffCheckoutRequest_SortCriterion_SortDirection,
} from "@gearment/nextapi/api/payment/v1/data_staff_checkout_request_pb"
import { Paging } from "@gearment/nextapi/common/type/v1/paging_pb"

const sortByMapping: Record<string, StaffCheckoutRequest_SortCriterion_SortBy> =
  {
    createdAt: StaffCheckoutRequest_SortCriterion_SortBy.CREATED_AT,
    updatedAt: StaffCheckoutRequest_SortCriterion_SortBy.UPDATED_AT,
    expiredAt: StaffCheckoutRequest_SortCriterion_SortBy.EXPIRED_AT,
  }

const sortDirectionMapping: Record<
  string,
  StaffCheckoutRequest_SortCriterion_SortDirection
> = {
  asc: StaffCheckoutRequest_SortCriterion_SortDirection.ASC,
  desc: StaffCheckoutRequest_SortCriterion_SortDirection.DESC,
}

export function getFilter(search: PaymentLogsSearchType): {
  filter: StaffCheckoutRequest_Filter
  sortCriterion: StaffCheckoutRequest_SortCriterion | undefined
  pagination: Paging
} {
  const pagination = new Paging({
    page: search.page,
    limit: search.limit,
  })
  const filter = new StaffCheckoutRequest_Filter({
    statuses: search.statuses,
    anyOrderIds:
      search.searchKey === "anyOrderIds"
        ? search.search?.length && search.search.length > 0
          ? search.search.split(",")
          : undefined
        : undefined,

    teamIds: search.teamIds,

    types: search.types,
    paymentMethodCodes: search.paymentMethodCodes,
    createdFrom: search.createdFrom
      ? formatDateForCallApi(search.createdFrom)
      : undefined,
    createdTo: search.createdTo
      ? formatDateForCallApi(search.createdTo, "endOfDay")
      : undefined,
    updatedFrom: search.updatedFrom
      ? formatDateForCallApi(search.updatedFrom)
      : undefined,
    updatedTo: search.updatedTo
      ? formatDateForCallApi(search.updatedTo, "endOfDay")
      : undefined,
    expiredFrom: search.expiredFrom
      ? formatDateForCallApi(search.expiredFrom)
      : undefined,
    expiredTo: search.expiredTo
      ? formatDateForCallApi(search.expiredTo, "endOfDay")
      : undefined,
  })
  const sortCriterion = search.sortBy?.length
    ? new StaffCheckoutRequest_SortCriterion({
        sortBy: sortByMapping[search.sortBy[0]],
        sortDirection:
          sortDirectionMapping[search.sortDirection?.[0] ?? "desc"],
      })
    : undefined

  return {
    filter,
    sortCriterion,
    pagination,
  }
}
