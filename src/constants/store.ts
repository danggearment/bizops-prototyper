import { StoreStatus } from "@gearment/nextapi/api/store/v1/data_store_pb.ts"

export const StoreStatusLabel = Object.freeze({
  [StoreStatus.ALL]: "All",
  [StoreStatus.UNKNOWN]: "Unknown",
  [StoreStatus.INACTIVE]: "Deactivate",
  [StoreStatus.ACTIVE]: "Activate",
})

export const AllStoreStatus = Object.freeze(StoreStatus)

export type AllStoreStatusKeys = keyof typeof AllStoreStatus
export type AllStoreStatusValue = (typeof AllStoreStatus)[AllStoreStatusKeys]
