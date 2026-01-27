import { GMProductOption_OptionType } from "@/services/connect-rpc/types"
import { create } from "zustand"
import { CatalogOptionType } from "./modal-catalog-option"

interface SetOpen {
  title: Props["title"]
  description: Props["description"]
  confirmText: Props["confirmText"]
  defaultValues: Props["defaultValues"]
  previewImageUrl: Props["previewImageUrl"]
  onConfirm: Props["onConfirm"]
  type: Props["type"]
  groupId: Props["groupId"]
  productCount?: Props["productCount"]
  variantCount?: Props["variantCount"]
}

interface Props {
  open: boolean
  title: string | undefined
  description: string | undefined
  confirmText: string | undefined
  type: GMProductOption_OptionType
  defaultValues: CatalogOptionType | undefined
  previewImageUrl: string | undefined
  groupId: string | undefined
  productCount: number
  variantCount: number
  onConfirm: (values: CatalogOptionType) => Promise<void>
  actions: {
    onOpen: (props: SetOpen) => void
    onClose: () => void
  }
}

export const useModalCatalogOption = create<Props>((set) => ({
  open: false,
  title: undefined,
  description: undefined,
  confirmText: undefined,
  defaultValues: undefined,
  previewImageUrl: undefined,
  type: GMProductOption_OptionType.UNKNOWN,
  groupId: undefined,
  productCount: 0,
  variantCount: 0,
  onConfirm: async () => {},
  actions: {
    onOpen: (props: SetOpen) => set({ open: true, ...props }),
    onClose: () => set({ open: false }),
  },
}))
