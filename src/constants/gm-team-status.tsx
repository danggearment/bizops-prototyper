import {
  TeamMemberStatus,
  TeamStatus,
} from "@gearment/nextapi/api/iam/v1/team_pb.ts"
import { TeamRushOrder } from "@gearment/nextapi/common/option/v1/enum_pb"

export const AllGMTeamStatusLabel = Object.freeze({
  [TeamStatus.UNKNOWN]: "Unknown",
  [TeamStatus.INACTIVE]: "Inactive",
  [TeamStatus.ACTIVE]: "Active",
  [TeamStatus.BLOCKED]: "Blocked",
})

export const AllGMTeamStatus = Object.freeze(TeamStatus)

export type AllGMTeamStatusKeys = keyof typeof AllGMTeamStatus
export type AllGMTeamStatusValues =
  (typeof AllGMTeamStatus)[AllGMTeamStatusKeys]

export const AllGMTeamMemberStatusLabel = Object.freeze({
  [TeamMemberStatus.UNKNOWN]: "Unknown",
  [TeamMemberStatus.INACTIVE]: "Inactive",
  [TeamMemberStatus.ACTIVE]: "Active",
})

export const AllTeamRushOrderLabel = Object.freeze({
  [TeamRushOrder.UNKNOWN]: "All",
  [TeamRushOrder.TRUE]: "Rush team",
  [TeamRushOrder.FALSE]: "Normal team",
})

export const AllTeamRushOrder = Object.freeze(TeamRushOrder)
