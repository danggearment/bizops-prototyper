import {
  GiftMessageType,
  OrderDraft_GiftMessageType,
} from "@/services/connect-rpc/types"

export type AllGiftMessageType = GiftMessageType | OrderDraft_GiftMessageType

export const AllGiftMessageTypeLabel = Object.freeze({
  [GiftMessageType.UNKNOWN]: "Unknown",
  [GiftMessageType.CUSTOM_IMAGE]: "Custom image",
  [GiftMessageType.UPLOAD_IMAGE]: "Upload image",
})
