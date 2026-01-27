import { useMutationPod } from "@/services/connect-rpc/transport"
import {
  CatalogOption_Option,
  CatalogOption_Option_Status,
} from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { queryClient } from "@/services/react-query"
import {
  staffListCatalogOption,
  staffUpdateCatalogOptionStatus,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { Switch, toast } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"
import { useState } from "react"
import { ActionOptionGroup } from "../../-helpers"
import { useOptionManagement } from "../../../-option-management-context"

export default function CellStatus(
  props: CellContext<CatalogOption_Option, any>,
) {
  const { status, code } = props.row.original
  const [setOpenConfirm, onClose] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])
  const [optionStatus, setOptionStatus] =
    useState<CatalogOption_Option_Status>(status)

  const { selectedOptionGroup } = useOptionManagement()

  const isActive =
    optionStatus === CatalogOption_Option_Status.CATALOG_OPTION_STATUS_ACTIVE

  const mutationChangeStatusCatalogOption = useMutationPod(
    staffUpdateCatalogOptionStatus,
    {
      onSuccess: () => {
        onClose()
        toast({
          variant: "success",
          title: isActive ? "Disable option value" : "Enable option value",
          description: isActive
            ? "Option value has been disabled successfully."
            : "Option value has been re-enabled successfully.",
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
          title: isActive ? "Disable option value" : "Enable option value",
          description: error.rawMessage,
        })
      },
    },
  )

  const disabled =
    mutationChangeStatusCatalogOption.isPending ||
    selectedOptionGroup?.isDefault

  return (
    <ActionOptionGroup isDefault={selectedOptionGroup?.isDefault ?? false}>
      <Switch
        className="cursor-pointer"
        checked={isActive}
        disabled={disabled}
        onCheckedChange={(checked) => {
          setOpenConfirm({
            type: isActive ? "error" : "info",
            title: isActive ? "Disable option value" : "Enable option value",
            description: isActive
              ? "Disabling this option value will make it unavailable when creating new variants. Existing variants will remain unchanged."
              : "Re-enabling this option value will make it available again when creating new variants. Existing variants will remain unchanged.",
            confirmText: "Yes",
            cancelText: "No",
            onConfirm: async () => {
              const newStatus = checked
                ? CatalogOption_Option_Status.CATALOG_OPTION_STATUS_ACTIVE
                : CatalogOption_Option_Status.CATALOG_OPTION_STATUS_INACTIVE

              setOptionStatus(newStatus)

              await mutationChangeStatusCatalogOption.mutateAsync({
                code,
                status: newStatus,
              })
            },
          })
        }}
      />
    </ActionOptionGroup>
  )
}
