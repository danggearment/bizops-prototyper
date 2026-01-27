import {
  mappingColor,
  OptionGroupStatusColorsMapping,
} from "@/constants/map-color"
import {
  OptionsCatalogGroupStatus,
  OptionsCatalogGroupType,
} from "@/constants/product"
import { useMutationPod } from "@/services/connect-rpc/transport"
import {
  CatalogOption_Group,
  CatalogOption_Group_Status,
} from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import {
  OptionGroupType,
  useModalOptionGroup,
} from "@/services/modals/modal-option-group"
import { queryClient } from "@/services/react-query"
import {
  staffDeleteCatalogOptionGroup,
  staffListCatalogOption,
  staffListCatalogOptionGroup,
  staffUpdateCatalogOptionGroup,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { Badge, Button, cn, Switch, toast } from "@gearment/ui3"
import { EditIcon, Trash2Icon } from "lucide-react"
import { ActionOptionGroup } from "../-helpers"
import { useOptionManagement } from "../../-option-management-context"

interface Props {
  group: CatalogOption_Group
}

export default function OptionGroupItem({ group }: Props) {
  const {
    selectedOptionGroup,
    setSelectedOptionGroup,
    setSearchCatalogOption,
    catalogOptions,
  } = useOptionManagement()

  const { name, description, status, type, totalOptions, groupId } = group

  const [setOpenConfirm, onClose] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const { actions } = useModalOptionGroup()

  const handleSelectOptionGroup = () => {
    setSelectedOptionGroup(group)
    setSearchCatalogOption("")
  }

  const mutationChangeStatusOptionGroup = useMutationPod(
    staffUpdateCatalogOptionGroup,
    {
      onSuccess: (_, variables) => {
        onClose()
        const isActive =
          variables.status ===
          CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_ACTIVE
        toast({
          variant: "success",
          title: isActive ? "Enable option group" : "Disable option group",
          description: isActive
            ? "Option group and related variants have been re-enabled successfully."
            : "Option group and related variants have been disabled successfully.",
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffListCatalogOptionGroup.service.typeName,
            staffListCatalogOptionGroup.name,
          ],
        })
      },
      onError: (error, variables) => {
        toast({
          variant: "error",
          title:
            variables.status ===
            CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_ACTIVE
              ? "Enable option group"
              : "Disable option group",
          description: error.rawMessage,
        })
      },
    },
  )

  const mutationDeleteOptionGroup = useMutationPod(
    staffDeleteCatalogOptionGroup,
    {
      onSuccess: () => {
        onClose()
        toast({
          variant: "success",
          title: "Delete option group",
          description: "Option group deleted successfully.",
        })
        setSelectedOptionGroup(null)
        setSearchCatalogOption("")
        queryClient.invalidateQueries({
          queryKey: [
            staffListCatalogOptionGroup.service.typeName,
            staffListCatalogOptionGroup.name,
          ],
        })
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Delete option group failed",
          description: error.rawMessage,
        })
      },
    },
  )

  const handleChangeStatusOptionGroup = async (checked: boolean) => {
    setOpenConfirm({
      title: checked ? "Enable option group" : "Disable option group",
      description: checked
        ? "Re-enabling this option group will make all its values available again when creating new variants. Existing variants will remain unchanged"
        : "Disabling this option group will hide all its values when creating new variants. Existing variants are not affected",
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: async () => {
        await mutationChangeStatusOptionGroup.mutateAsync({
          name,
          description,
          type,
          groupId,
          status: checked
            ? CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_ACTIVE
            : CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_INACTIVE,
        })
      },
    })
  }

  const mutationUpdateOptionGroup = useMutationPod(
    staffUpdateCatalogOptionGroup,
    {
      onSuccess: () => {
        actions.onClose()
        onClose()
        toast({
          variant: "success",
          title: "Update option group",
          description: "Option group updated successfully.",
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffListCatalogOptionGroup.service.typeName,
            staffListCatalogOptionGroup.name,
          ],
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffListCatalogOption.service.typeName,
            staffListCatalogOption.name,
          ],
        })
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Update option group failed",
          description: error.rawMessage,
        })
      },
    },
  )

  const disabled =
    mutationChangeStatusOptionGroup.isPending ||
    mutationDeleteOptionGroup.isPending ||
    mutationUpdateOptionGroup.isPending ||
    group.isDefault

  return (
    <button
      className={cn(
        "p-4 border border-stroke rounded-md cursor-pointer w-full text-left",
        "hover:border-primary hover:ring-2 hover:ring-offset-1 hover:ring-primary",
        selectedOptionGroup?.groupId === group.groupId
          ? "border-primary ring-2 ring-offset-1 ring-primary bg-primary/10"
          : "border-stoke ring-2 ring-offset-1 ring-transparent",
      )}
      onClick={handleSelectOptionGroup}
    >
      <div className="flex gap-2 mb-1">
        <div className="w-full">
          <div className="flex gap-2 items-center justify-between">
            <Badge
              variant={mappingColor<CatalogOption_Group_Status>(
                OptionGroupStatusColorsMapping,
                status,
              )}
            >
              {OptionsCatalogGroupStatus[status]}
            </Badge>
            <ActionOptionGroup isDefault={group.isDefault}>
              <div className="flex gap-1 items-center">
                <Switch
                  checked={
                    group.status ===
                    CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_ACTIVE
                  }
                  disabled={disabled}
                  onCheckedChange={handleChangeStatusOptionGroup}
                />
                <Button
                  variant="outline"
                  size="icon"
                  disabled={disabled}
                  onClick={() => {
                    actions.onOpen({
                      title: "Edit option group",
                      description: "Update the option group details below.",
                      confirmText: "Save changes",
                      defaultValues: {
                        groupName: name,
                        description,
                        type,
                        status,
                      },
                      disabledChangeType: !!catalogOptions?.length,
                      onConfirm: async (values: OptionGroupType) => {
                        await mutationUpdateOptionGroup.mutateAsync({
                          groupId,
                          name: values.groupName,
                          description: values.description,
                          type: values.type,
                          status: values.status,
                        })
                      },
                    })
                  }}
                >
                  <EditIcon />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:border-destructive"
                  disabled={disabled}
                  onClick={() => {
                    setOpenConfirm({
                      type: "error",
                      title: "Delete option group",
                      description:
                        "Are you sure you want to delete this option group? This action cannot be undone. All values in this group will also be deleted",
                      confirmText: "Yes",
                      cancelText: "Cancel",
                      onConfirm: async () => {
                        await mutationDeleteOptionGroup.mutateAsync({ groupId })
                      },
                    })
                  }}
                >
                  <Trash2Icon className="text-destructive" />
                </Button>
              </div>
            </ActionOptionGroup>
          </div>

          <p className="text-md font-medium">{name}</p>
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-2 italic">{description}</div>
      <div className="text-gray-500 text-[12px]">
        Type: {OptionsCatalogGroupType[type]} &bull; Values: {totalOptions}
      </div>
    </button>
  )
}
