import Image from "@/components/common/image/image"
import { OptionsCatalogGroupType } from "@/constants/product"
import { useMutationPod } from "@/services/connect-rpc/transport"
import {
  GMProduct_Admin_Variant_Short,
  GMProductOption_OptionType,
  GMProductVariantStatus,
} from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { queryClient } from "@/services/react-query"
import {
  staffCountProductVariant,
  staffListProductVariant,
  staffUpdateProductVariantStatus,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  toast,
} from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"
import {
  CircleCheckIcon,
  CircleXIcon,
  EllipsisVerticalIcon,
  InfoIcon,
  TrashIcon,
} from "lucide-react"
import { useMemo, useState } from "react"

export default function CellActions(
  props: CellContext<GMProduct_Admin_Variant_Short, unknown>,
) {
  const {
    status,
    productAvatarUrl,
    productName,
    variantSku,
    option1,
    option2,
    option3,
  } = props.row.original

  const [openDropdown, setOpenDropdown] = useState(false)

  const [setOpenConfirm, closeConfirm] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const options = [option1, option2, option3]
    .filter((option) => option?.value)
    .map((option, idx) => (
      <div
        key={idx}
        className="py-1 px-2 bg-white rounded-full border flex items-center gap-1"
      >
        {option?.type && (
          <>
            {
              OptionsCatalogGroupType[
                option.type as keyof typeof OptionsCatalogGroupType
              ]
            }
            {OptionsCatalogGroupType[
              option.type as keyof typeof OptionsCatalogGroupType
            ] && ":"}
          </>
        )}
        <div className="flex items-center gap-1">
          {option?.type === GMProductOption_OptionType.COLOR &&
            option?.value && (
              <div
                className="size-4 border border-border rounded-full"
                style={{ backgroundColor: `#${option.value}` }}
              />
            )}
          {option?.name}
        </div>
      </div>
    ))

  const { hasInactive, hasActive, hasDelete } = useMemo(() => {
    return {
      hasInactive: [
        GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_ACTIVE,
        GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_UNKNOWN,
      ].includes(status),
      hasActive: [
        GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_INACTIVE,
        GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_UNKNOWN,
      ].includes(status),
      hasDelete: [
        GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_ACTIVE,
        GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_INACTIVE,
        GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_UNKNOWN,
      ].includes(status),
    }
  }, [status])

  const mutation = useMutationPod(staffUpdateProductVariantStatus, {
    onSuccess: () => {
      closeConfirm()
      queryClient.invalidateQueries({
        queryKey: [
          staffListProductVariant.service.typeName,
          staffListProductVariant.name,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          staffCountProductVariant.service.typeName,
          staffCountProductVariant.name,
        ],
      })
      toast({
        variant: "success",
        title: "Variant updated",
        description: "Variant updated successfully.",
      })
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Variant updated",
        description: "Variant updated successfully.",
      })
    },
  })

  const handleUpdateStatus = (status: GMProductVariantStatus) => {
    let title = ""
    let descriptionText = ""
    let infoText = <></>

    switch (status) {
      case GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_ACTIVE:
        title = "Activate variant"
        descriptionText =
          "Are you sure you want to activate this variant? It will become available for orders."
        infoText = (
          <p>
            This variant will be visible to customers and available for
            purchase.
          </p>
        )
        break

      case GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_INACTIVE:
        title = "Deactivate variant"
        descriptionText =
          "Are you sure you want to deactivate this variant? It will not be available for orders."
        infoText = (
          <p>
            Customers will not be able to see or purchase this variant once
            deactivated.
          </p>
        )
        break

      case GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_DELETED:
        title = "Delete variant"
        descriptionText =
          "Are you sure you want to delete this variant? This action cannot be undone."
        infoText = (
          <p className="text-error-foreground">This action cannot be undone.</p>
        )
        break
    }

    setOpenDropdown(false)
    setOpenConfirm({
      type: "info",
      title,
      description: (
        <div className="space-y-2">
          <p className="text-sm">{descriptionText}</p>

          <VariantPreview
            image={productAvatarUrl}
            name={productName}
            sku={variantSku}
            options={options}
          />

          <InfoNotice text={infoText} />
        </div>
      ),
      onConfirm: async () => {
        await mutation.mutateAsync({
          variantIds: [props.row.original.variantId],
          status,
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
          {hasActive && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                handleUpdateStatus(
                  GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_ACTIVE,
                )
              }
            >
              <CircleCheckIcon size={14} className="text-success-foreground" />
              <span className="text-success-foreground">Activate</span>
            </DropdownMenuItem>
          )}
          {hasInactive && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                handleUpdateStatus(
                  GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_INACTIVE,
                )
              }
            >
              <CircleXIcon size={14} className="text-warning-foreground" />
              <span className="text-warning-foreground">Deactivate</span>
            </DropdownMenuItem>
          )}
          {hasDelete && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                handleUpdateStatus(
                  GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_DELETED,
                )
              }
            >
              <TrashIcon size={14} className="text-error-foreground" />
              <span className="text-error-foreground">Delete</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function VariantPreview({
  image,
  name,
  sku,
  options,
}: {
  image: string
  name: string
  sku: string
  options: React.ReactNode
}) {
  return (
    <div className="flex gap-3 mt-4">
      <div className="w-16 h-16">
        <Image url={image} className="rounded-md border" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-bold">{name}</p>
        <p className="text-sm">SKU: {sku}</p>

        <div className="flex flex-wrap gap-1">{options}</div>
      </div>
    </div>
  )
}

function InfoNotice({ text }: { text: React.ReactNode }) {
  return (
    <div className="mt-4 flex gap-2 text-sm">
      <InfoIcon size={16} className="mt-0.5" />
      {text}
    </div>
  )
}
