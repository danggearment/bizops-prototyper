import { useMutationPod } from "@/services/connect-rpc/transport"
import {
  GMAttribute_Admin_Short,
  GMAttributeStatus,
} from "@/services/connect-rpc/types"
import { useModalAttributeGroup } from "@/services/modals/modal-attribute-group"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { queryClient } from "@/services/react-query"
import {
  staffCountGMAttributeGroupStatus,
  staffListGMAttributeGroup,
  staffUpdateGMAttributeGroup,
  staffUpdateGMAttributeGroupStatus,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  formatDateString,
  toast,
} from "@gearment/ui3"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { CellContext } from "@tanstack/react-table"
import {
  CircleCheckIcon,
  CircleXIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react"
import { useState } from "react"

export default function CellActions(
  props: CellContext<GMAttribute_Admin_Short, any>,
) {
  const {
    attrKey,
    attrName,
    attrDescription,
    selectionType,
    maxSelection,
    minSelection,
    createdAt,
    updatedAt,
    status,
  } = props.row.original
  const [openDropdown, setOpenDropdown] = useState(false)
  const [setOpenConfirm, onCloseConfirm] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const { actions } = useModalAttributeGroup()

  const navigate = useNavigate()

  const location = useLocation()

  const isActive = status === GMAttributeStatus.GM_ATTRIBUTE_STATUS_ACTIVE

  const mutationUpdateAttributeGroup = useMutationPod(
    staffUpdateGMAttributeGroup,
    {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Attribute group updated",
          description: "Attribute group has been updated successfully",
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffListGMAttributeGroup.service.typeName,
            staffListGMAttributeGroup.name,
          ],
        })
        actions.onClose()
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Attribute group update failed",
          description: error.rawMessage,
        })
      },
    },
  )

  const handleEditAttributeGroup = () => {
    setOpenDropdown(false)
    actions.onOpen({
      title: "Edit attribute group",
      description: "Edit the attribute group to organize related attributes",
      confirmText: "Update group",
      modifyText: `Created on: ${createdAt ? formatDateString(createdAt.toDate(), "LLL d, yyyy h:mm a") : "--"} • Last updated: ${updatedAt ? formatDateString(updatedAt.toDate(), "LLL d, yyyy h:mm a") : "--"}`,
      defaultValues: {
        name: attrName,
        description: attrDescription,
        selectionType: Number(selectionType),
        maxSelection: Number(maxSelection),
        minSelection: Number(minSelection),
      },
      onConfirm: async (values) => {
        await mutationUpdateAttributeGroup.mutateAsync({
          attributeKey: attrKey,
          ...values,
        })
      },
    })
  }

  const handleViewDetails = () => {
    setOpenDropdown(false)
    navigate({
      to: "/product-management/attributes/group/$groupId",
      params: { groupId: attrKey },
      state: location,
    })
  }

  const handleDeleteAttributeGroup = () => {
    setOpenDropdown(false)
    setOpenConfirm({
      title: "Delete this attribute group?",
      description:
        "Are you sure you want to delete this attribute group? This action cannot be undone.",
      confirmText: "Confirm",
      onConfirm: async () => {
        // TODO: implement delete attribute group after Product Owner define delete logic
      },
    })
  }

  const mutationChangeAttributeGroupStatus = useMutationPod(
    staffUpdateGMAttributeGroupStatus,
    {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Attribute group status updated",
          description: "Attribute group status has been updated successfully",
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffListGMAttributeGroup.service.typeName,
            staffListGMAttributeGroup.name,
          ],
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffCountGMAttributeGroupStatus.service.typeName,
            staffCountGMAttributeGroupStatus.name,
          ],
        })
        onCloseConfirm()
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Attribute group status update failed",
          description: error.rawMessage,
        })
      },
    },
  )

  const handleChangeAttributeGroupStatus = () => {
    setOpenDropdown(false)
    setOpenConfirm({
      title: isActive
        ? "Deactivate attribute group"
        : "Activate attribute group",
      description: isActive
        ? "Disabling this attribute group will hide all its attributes when assigning to products. Continue?"
        : "Re-enabling this attribute group will make its attributes available for assignment again. Continue?",
      confirmText: "Confirm",
      onConfirm: async () => {
        await mutationChangeAttributeGroupStatus.mutateAsync({
          attributeGroupKeys: [attrKey],
          updateStatus: isActive
            ? GMAttributeStatus.GM_ATTRIBUTE_STATUS_INACTIVE
            : GMAttributeStatus.GM_ATTRIBUTE_STATUS_ACTIVE,
        })
      },
    })
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button className="cursor-pointer" variant="ghost" size="sm">
            <EllipsisVerticalIcon size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleViewDetails}
          >
            <EyeIcon size={12} /> View details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleEditAttributeGroup}
          >
            <SquarePenIcon size={12} /> Edit
          </DropdownMenuItem>
          {isActive ? (
            <DropdownMenuItem
              onClick={handleChangeAttributeGroupStatus}
              className="text-warning-foreground focus:text-warning-foreground cursor-pointer"
            >
              <CircleXIcon size={12} className="text-warning-foreground" />
              Deactivate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={handleChangeAttributeGroupStatus}
              className="text-success-foreground focus:text-success-foreground cursor-pointer"
            >
              <CircleCheckIcon size={12} className="text-success-foreground" />
              Activate
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={handleDeleteAttributeGroup}
          >
            <Trash2Icon size={12} className="text-destructive" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
