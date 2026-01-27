import { useMutationPod } from "@/services/connect-rpc/transport"
import {
  GMAttribute_Admin_Value,
  GMAttributeValueStatus,
} from "@/services/connect-rpc/types"
import { useModalAttributeValue } from "@/services/modals/modal-attribute-value"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { queryClient } from "@/services/react-query"
import {
  staffListGMAttributeValue,
  staffUpdateGMAttributeValue,
  staffUpdateGMAttributeValueStatus,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  props: CellContext<GMAttribute_Admin_Value, any>,
) {
  const { status, attrCode, attrValue, groups, description } =
    props.row.original

  const [openDropdown, setOpenDropdown] = useState(false)

  const [setOpenConfirm, onCloseConfirm] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])
  const { actions: actionsModalAttributeValue } = useModalAttributeValue()

  const navigate = useNavigate()

  const location = useLocation()

  const isActive =
    status === GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_ACTIVE

  const mutationUpdateAttributeValue = useMutationPod(
    staffUpdateGMAttributeValue,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            staffListGMAttributeValue.service.typeName,
            staffListGMAttributeValue.name,
          ],
        })
        actionsModalAttributeValue.onClose()
        onCloseConfirm()
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

  const handleEditAttributeLibrary = () => {
    setOpenDropdown(false)
    actionsModalAttributeValue.onOpen({
      defaultValues: {
        value: attrValue,
        attributeGroupKeys: groups ? groups.map((group) => group.attrKey) : [],
        code: attrCode,
        description: description,
      },
      title: "Edit attribute library",
      submitText: "Update attribute",
      onConfirm: async (values) => {
        const removeKeys =
          Array.isArray(values.attributeGroupKeys) && groups
            ? groups
                .map((group) => group.attrKey)
                .filter(
                  (groupKey) => !values.attributeGroupKeys!.includes(groupKey),
                )
            : []

        await mutationUpdateAttributeValue.mutateAsync({
          attributeCode: attrCode,
          description: values.description,
          newAttributeGroupKeys: values.attributeGroupKeys,
          removeAttributeGroupKeys: removeKeys,
        })
      },
    })
  }

  const handleViewDetails = () => {
    setOpenDropdown(false)
    navigate({
      to: "/product-management/attributes/library/$libraryId",
      params: { libraryId: attrCode },
      state: location,
    })
  }

  const handleDeleteAttributeLibrary = () => {
    setOpenDropdown(false)
    setOpenConfirm({
      type: "error",
      title: "Delete this attribute library?",
      description:
        "Are you sure you want to delete this attribute library? This action cannot be undone.",
      confirmText: "Delete attribute",
      onConfirm: async () => {
        // TODO: implement delete attribute group after Product Owner define delete logic
        toast({
          variant: "warning",
          title: "Not implemented",
          description:
            "This feature is not implemented yet. Please contact support.",
        })
      },
    })
  }

  const mutationChangeAttributeLibraryStatus = useMutationPod(
    staffUpdateGMAttributeValueStatus,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            staffListGMAttributeValue.service.typeName,
            staffListGMAttributeValue.name,
          ],
        })
        toast({
          variant: "success",
          title: "Attribute library status updated",
          description: "Attribute library status has been updated successfully",
        })
        onCloseConfirm()
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Attribute library status update failed",
          description: error.rawMessage,
        })
      },
    },
  )

  const handleChangeAttributeLibraryStatus = () => {
    setOpenDropdown(false)
    setOpenConfirm({
      title: isActive
        ? "Deactivate attribute library"
        : "Activate attribute library",
      description: isActive
        ? `Are you sure you want to deactivate ${attrValue}? This attribute will no longer be available for assignment to products, but existing assignments will remain intact.`
        : `Are you sure you want to activate ${attrValue}? This attribute will be available for assignment to products. Continue?`,
      confirmText: "Confirm",
      onConfirm: async () => {
        await mutationChangeAttributeLibraryStatus.mutateAsync({
          attributeCodes: [attrCode],
          updateStatus: isActive
            ? GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_INACTIVE
            : GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_ACTIVE,
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
            onClick={handleEditAttributeLibrary}
          >
            <SquarePenIcon size={12} /> Edit
          </DropdownMenuItem>
          {isActive ? (
            <DropdownMenuItem
              onClick={handleChangeAttributeLibraryStatus}
              className="text-warning-foreground focus:text-warning-foreground cursor-pointer"
            >
              <CircleXIcon size={12} className="text-warning-foreground" />
              Deactivate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={handleChangeAttributeLibraryStatus}
              className="text-success-foreground focus:text-success-foreground cursor-pointer"
            >
              <CircleCheckIcon size={12} className="text-success-foreground" />
              Activate
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={handleDeleteAttributeLibrary}
          >
            <Trash2Icon size={12} className="text-destructive" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
