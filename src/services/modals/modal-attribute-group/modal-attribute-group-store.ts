import { GMAttributeSelectionType } from "@/services/connect-rpc/types"
import { create } from "zustand"
import { AttributeGroupType } from "./modal-attribute-group"

interface SetOpen {
  onConfirm: Props["onConfirm"]
  defaultValues?: Props["defaultValues"]
  title?: Props["title"]
  description?: Props["description"]
  confirmText?: Props["confirmText"]
  modifyText?: Props["modifyText"]
}

interface Props {
  open: boolean
  title: string
  description: string
  confirmText: string
  modifyText: string | undefined
  defaultValues: AttributeGroupType
  onConfirm: (values: AttributeGroupType) => Promise<void>
  actions: {
    onOpen: (props: SetOpen) => void
    onClose: () => void
  }
}

export const useModalAttributeGroup = create<Props>((set) => ({
  open: false,
  title: "Add attribute group",
  description: "Create a new attribute group to organize related attributes",
  confirmText: "Create group",
  modifyText: undefined,
  defaultValues: {
    name: "",
    selectionType: GMAttributeSelectionType.GM_ATTRIBUTE_SELECTION_TYPE_SINGLE,
    description: "",
    maxSelection: 3,
    minSelection: 1,
  },
  onConfirm: async () => {},
  actions: {
    onOpen: (props: SetOpen) => set({ open: true, ...props }),
    onClose: () => set({ open: false }),
  },
}))
