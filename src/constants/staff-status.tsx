import { StaffStatus } from "@gearment/nextapi/api/iam/v1/staff_action_pb.ts"

export const AllStaffStatusLabel = Object.freeze({
  [StaffStatus.ACTIVE]: "Active",
  [StaffStatus.INACTIVE]: "Inactive",
  [StaffStatus.INVITED]: "Invited",
  [StaffStatus.UNSPECIFIED]: "Unspecified",
})

export const AllStaffStatus = Object.freeze(StaffStatus)

export type AllStaffStatusKeys = keyof typeof AllStaffStatus
export type AllStaffStatusValues = (typeof AllStaffStatus)[AllStaffStatusKeys]
