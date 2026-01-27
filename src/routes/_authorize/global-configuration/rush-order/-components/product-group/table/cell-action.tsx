import { useMutationPod } from "@/services/connect-rpc/transport"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { useProductGroupStore } from "@/services/modals/modal-product-group/modal-product-group-store"
import { queryClient } from "@/services/react-query"
import {
  staffDeleteRushProductGroup,
  staffListRushProductGroup,
  staffUpdateRushProductGroupStatus,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import {
  RushProductGroupData,
  RushProductGroupStatus,
} from "@gearment/nextapi/api/pod/v1/product_admin_pb"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@gearment/ui3"
import { EllipsisVerticalIcon } from "lucide-react"
import { useState } from "react"

export default function CellAction({ row }: { row: RushProductGroupData }) {
  const [openDropdown, setOpenDropdown] = useState(false)
  const { actions } = useProductGroupStore()
  const { setOpen, onClose } = useConfirmModal()

  const mutationUpdateProductGroupStatus = useMutationPod(
    staffUpdateRushProductGroupStatus,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            staffListRushProductGroup.service.typeName,
            staffListRushProductGroup.name,
          ],
        })
        onClose()
      },
    },
  )
  const mutationDeleteProductGroup = useMutationPod(
    staffDeleteRushProductGroup,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            staffListRushProductGroup.service.typeName,
            staffListRushProductGroup.name,
          ],
        })
        onClose()
      },
    },
  )
  const handleEdit = () => {
    setOpenDropdown(false)
    actions.setOpen(true, () => {
      queryClient.invalidateQueries({
        queryKey: [
          staffListRushProductGroup.service.typeName,
          staffListRushProductGroup.name,
        ],
      })
    })
    actions.setProductGroupId(row.rushProductGroupId)
  }
  const handleDelete = () => {
    setOpenDropdown(false)
    setOpen({
      type: "error",
      title: "Delete Product Group",
      description: "Are you sure you want to delete this product group?",
      cancelText: "Cancel",
      confirmText: "Delete",
      onConfirm: async () => {
        await mutationDeleteProductGroup.mutateAsync({
          rushProductGroupId: row.rushProductGroupId,
        })
      },
    })
  }
  const handleUpdateProductGroupStatus = () => {
    setOpenDropdown(false)
    const status =
      row.status === RushProductGroupStatus.ACTIVE
        ? RushProductGroupStatus.INACTIVE
        : RushProductGroupStatus.ACTIVE
    setOpen({
      title: "Update Product Group Status",
      description: "Are you sure you want to update the product group status?",
      cancelText: "Cancel",
      confirmText: "Update",
      onConfirm: async () => {
        await mutationUpdateProductGroupStatus.mutateAsync({
          rushProductGroupId: row.rushProductGroupId,
          status: status,
        })
      },
    })
  }
  return (
    <div className="flex items-center gap-2 justify-end">
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={"icon"}>
            <EllipsisVerticalIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleUpdateProductGroupStatus}>
            {row.status === RushProductGroupStatus.ACTIVE
              ? "Inactive"
              : "Active"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
