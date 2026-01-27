import { CallLogsSearchType } from "@/schemas/schemas/call-logs"
import { formatDateForCallApi } from "@/utils/format-date"
import type { APICallLogFilter } from "@gearment/nextapi/api/integration/v1/call_log_pb"
import { Paging } from "@gearment/nextapi/common/type/v1/paging_pb"

export function getCallLogFilter(search: CallLogsSearchType): {
  filter: APICallLogFilter | undefined
  paging: Paging
} {
  const paging = new Paging({
    page: search.page,
    limit: search.limit,
  })

  const filterData: Partial<APICallLogFilter> = {}

  if (search.teamIds.length > 0) {
    filterData.teamIds = search.teamIds
  }

  if (search.storeIds.length > 0) {
    filterData.storeIds = search.storeIds
  }

  if (search.statuses.length > 0) {
    filterData.statusCodes = search.statuses.map(Number)
  }

  if (search.search) {
    filterData.searchText = search.search
  }

  if (search.from) {
    filterData.from = formatDateForCallApi(search.from)
  }

  if (search.to) {
    filterData.to = formatDateForCallApi(search.to)
  }

  if (search.clientKey) {
    filterData.clientKey = search.clientKey
  }

  const filter =
    Object.keys(filterData).length > 0
      ? (filterData as APICallLogFilter)
      : undefined

  return {
    filter,
    paging,
  }
}
