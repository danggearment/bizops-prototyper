import { create } from "zustand"
import { AttributeValueType } from "./modal-attribute-value"

interface SetOpen {
  onConfirm: Props["onConfirm"]
  defaultValues: Props["defaultValues"]
  title?: Props["title"]
  submitText?: Props["submitText"]
  hasCreateNewAttributeGroup?: Props["hasCreateNewAttributeGroup"]
}

interface Props {
  open: boolean
  defaultValues: AttributeValueType
  onConfirm: (values: AttributeValueType) => Promise<void>
  title: string
  submitText: string
  hasCreateNewAttributeGroup?: boolean
  actions: {
    onOpen: (props: SetOpen) => void
    onClose: () => void
  }
}

export const useModalAttributeValue = create<Props>((set) => ({
  open: false,
  defaultValues: {
    value: "",
    attributeGroupKeys: [],
    code: "",
    description: "",
  },
  hasCreateNewAttributeGroup: false,
  onConfirm: async () => {},
  title: "Add attribute library",
  submitText: "Add attribute",
  actions: {
    onOpen: (props: SetOpen) => set({ open: true, ...props }),
    onClose: () => set({ open: false }),
  },
}))
