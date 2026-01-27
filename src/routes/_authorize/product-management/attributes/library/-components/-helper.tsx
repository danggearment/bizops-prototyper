import {
  GMAttributeValueStatus,
  StaffCountGMAttributeValueStatusResponse_Record,
} from "@/services/connect-rpc/types"

const ATTRIBUTE_LIBRARY_STATUSES = [
  GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_ACTIVE,
  GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_INACTIVE,
]

export const defaultAttributeLibraryAnalytics: StaffCountGMAttributeValueStatusResponse_Record[] =
  ATTRIBUTE_LIBRARY_STATUSES.map(
    (status) =>
      new StaffCountGMAttributeValueStatusResponse_Record({
        status,
        count: BigInt(0),
      }),
  )

export const attributeLibraryStatusAnalytics = (
  data: StaffCountGMAttributeValueStatusResponse_Record[],
) => {
  const status = data.map(
    (record) =>
      new StaffCountGMAttributeValueStatusResponse_Record({
        status: record.status,
        count: record.count,
      }),
  )
  return [
    ...[...defaultAttributeLibraryAnalytics, ...status]
      .reduce((acc, record) => acc.set(record.status, record), new Map())
      .values(),
  ]
}

export const getAttributeCount = (
  analytics: StaffCountGMAttributeValueStatusResponse_Record[],
  status?: GMAttributeValueStatus,
) => {
  if (status === undefined) {
    return analytics.reduce((acc, item) => acc + Number(item.count), 0)
  }
  return analytics.find((item) => item.status === status)?.count || 0
}
