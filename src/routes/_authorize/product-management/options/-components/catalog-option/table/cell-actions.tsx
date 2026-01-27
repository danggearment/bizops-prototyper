import { useMutationPod } from "@/services/connect-rpc/transport"
import {
  CatalogOption_Option,
  CatalogOption_Option_Status,
} from "@/services/connect-rpc/types"
import {
  CatalogOptionType,
  useModalCatalogOption,
} from "@/services/modals/modal-catalog-option"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { queryClient } from "@/services/react-query"
import {
  staffListCatalogOption,
  staffListCatalogOptionGroup,
  staffUpdateCatalogOption,
  staffUpdateCatalogOptionStatus,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { Button, toast } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"
import { EditIcon, Trash2Icon } from "lucide-react"
import { useOptionManagement } from "../../../-option-management-context"
import { getOriginalImageUrl } from "./-helper"

export default function CellActions(
  props: CellContext<CatalogOption_Option, any>,
) {
  const {
    type,
    name,
    code,
    status,
    previewImage,
    defaultValue,
    productCount,
    variantCount,
  } = props.row.original
  const { actions } = useModalCatalogOption()
  const { selectedOptionGroup } = useOptionManagement()
  const [setOpenConfirm, onClose] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const mutationUpdateCatalogOption = useMutationPod(staffUpdateCatalogOption, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          staffListCatalogOption.service.typeName,
          staffListCatalogOption.name,
        ],
      })
      actions.onClose()
      onClose()
      toast({
        variant: "success",
        title: "Option value updated",
        description: "Option value updated successfully",
      })
    },
    onError: (error) => {
      toast({
        variant: "error",
        title: "Option value update failed",
        description: error.rawMessage,
      })
    },
  })

  const mutationDeleteCatalogOption = useMutationPod(
    staffUpdateCatalogOptionStatus,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            staffListCatalogOption.service.typeName,
            staffListCatalogOption.name,
          ],
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffListCatalogOptionGroup.service.typeName,
            staffListCatalogOptionGroup.name,
          ],
        })
        onClose()
        toast({
          variant: "success",
          title: "Option value deleted",
          description: "Option value deleted successfully",
        })
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Option value delete failed",
          description: error.rawMessage,
        })
      },
    },
  )

  const handleOpen = async () => {
    const files = await getOriginalImageUrl(previewImage)
    actions.onOpen({
      type,
      title: "Edit option value",
      description: `Update the value for ${selectedOptionGroup?.name}`,
      groupId: selectedOptionGroup?.groupId,
      confirmText: "Save changes",
      defaultValues: {
        name,
        code,
        hexColor: defaultValue,
        previewImage: files ? files : [],
        status,
        previewImageId: previewImage?.fileId,
      },
      previewImageUrl: previewImage?.fileUrl,
      productCount: Number(productCount),
      variantCount: Number(variantCount),
      onConfirm: async (values: CatalogOptionType) => {
        await mutationUpdateCatalogOption.mutateAsync({
          value: values.hexColor ?? values.code,
          name: values.name,
          code: values.code,
          status: values.status,
          previewImageId: values.previewImageId ?? undefined,
        })
      },
    })
  }

  return (
    <div className="flex items-center gap-2 justify-end pr-2">
      <Button variant="outline" size="icon" onClick={handleOpen}>
        <EditIcon />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="text-destructive hover:bg-destructive/10 hover:border-destructive"
        onClick={() =>
          setOpenConfirm({
            title: "Delete option value",
            type: "error",
            description:
              "Deleting this option value will remove it from the list of available choices when creating new variants. Existing variants will remain unchanged.",
            confirmText: "Yes",
            cancelText: "Cancel",
            onConfirm: async () => {
              await mutationDeleteCatalogOption.mutateAsync({
                code,
                status:
                  CatalogOption_Option_Status.CATALOG_OPTION_STATUS_DELETED,
              })
            },
          })
        }
      >
        <Trash2Icon className="text-destructive" />
      </Button>
    </div>
  )
}
