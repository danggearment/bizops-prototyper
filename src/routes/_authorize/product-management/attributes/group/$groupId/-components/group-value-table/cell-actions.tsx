import { useMutationPod } from "@/services/connect-rpc/transport"
import { GMAttribute_Admin_Value } from "@/services/connect-rpc/types"
import { useModalAttributeValue } from "@/services/modals/modal-attribute-value"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { queryClient } from "@/services/react-query"
import {
  staffCountGMAttributeValueStatus,
  staffGetGMAttributeGroupDetail,
  staffListGMAttributeValue,
  staffUpdateGMAttributeValue,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  toast,
} from "@gearment/ui3"
import { useParams } from "@tanstack/react-router"
import { CellContext } from "@tanstack/react-table"
import { EllipsisVerticalIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"

export default function CellActions(
  props: CellContext<GMAttribute_Admin_Value, any>,
) {
  const { actions: actionsModalAttributeValue } = useModalAttributeValue()
  const { attrCode } = props.row.original

  const { groupId } = useParams({
    from: "/_authorize/product-management/attributes/group/$groupId/",
  })

  const [openDropdown, setOpenDropdown] = useState(false)
  const [setOpenConfirm, onCloseConfirm] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const mutationUpdateAttributeValue = useMutationPod(
    staffUpdateGMAttributeValue,
    {
      onSuccess: () => {
        const keys = [
          staffListGMAttributeValue,
          staffCountGMAttributeValueStatus,
          staffGetGMAttributeGroupDetail,
        ]
        keys.forEach((key) => {
          queryClient.invalidateQueries({
            queryKey: [key.service.typeName, key.name],
          })
        })
        onCloseConfirm()
        actionsModalAttributeValue.onClose()
        toast({
          variant: "success",
          title: "Attribute value updated",
          description: "Attribute value has been updated successfully",
        })
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Attribute value update failed",
          description: error.rawMessage,
        })
      },
    },
  )

  const handleRemoveAttributeFromGroup = () => {
    setOpenDropdown(false)
    setOpenConfirm({
      type: "error",
      title: "Remove attribute from group?",
      description:
        "Are you sure you want to remove this attribute from the group?",
      confirmText: "Remove attribute",
      onConfirm: async () => {
        await mutationUpdateAttributeValue.mutateAsync({
          attributeCode: attrCode,
          removeAttributeGroupKeys: [groupId],
        })
      },
    })
  }

  return (
    <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <EllipsisVerticalIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={handleRemoveAttributeFromGroup}
        >
          <Trash2Icon className="text-destructive" size={12} /> Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
