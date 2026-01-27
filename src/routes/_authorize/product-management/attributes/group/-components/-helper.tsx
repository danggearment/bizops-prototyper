import {
  GMAttributeStatus,
  StaffCountGMAttributeGroupStatusResponse_Record,
} from "@/services/connect-rpc/types"

const ATTRIBUTE_GROUP_STATUSES = [
  GMAttributeStatus.GM_ATTRIBUTE_STATUS_ACTIVE,
  GMAttributeStatus.GM_ATTRIBUTE_STATUS_INACTIVE,
]

export const defaultAttributeGroupAnalytics: StaffCountGMAttributeGroupStatusResponse_Record[] =
  ATTRIBUTE_GROUP_STATUSES.map(
    (status) =>
      new StaffCountGMAttributeGroupStatusResponse_Record({
        status,
        count: BigInt(0),
      }),
  )

export const attributeGroupStatusAnalytics = (
  data: StaffCountGMAttributeGroupStatusResponse_Record[],
) => {
  const status = data.map(
    (record) =>
      new StaffCountGMAttributeGroupStatusResponse_Record({
        status: record.status,
        count: record.count,
      }),
  )
  return [
    ...[...defaultAttributeGroupAnalytics, ...status]
      .reduce((acc, record) => acc.set(record.status, record), new Map())
      .values(),
  ]
}

export const getAttributeCount = (
  analytics: StaffCountGMAttributeGroupStatusResponse_Record[],
  status?: GMAttributeStatus,
) => {
  if (status === undefined) {
    return analytics.reduce((acc, item) => acc + Number(item.count), 0)
  }
  return analytics.find((item) => item.status === status)?.count || 0
}
