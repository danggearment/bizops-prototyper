import { AllPlatform } from "@/constants/platform"
import {
  CreateProductGroupFormData,
  CreateProductGroupSchema,
} from "@/schemas/schemas/product"
import { useMutationPod, useQueryPod } from "@/services/connect-rpc/transport"
import { ErrorResponse, getBusinessCode } from "@/utils"
import {
  staffCreateRushProductGroup,
  staffDetailRushProductGroup,
  staffListRushProductVariant,
  staffUpdateRushProductGroup,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import {
  RushProductGroupStatus,
  StaffCreateRushProductGroupRequest_RushVariant,
} from "@gearment/nextapi/api/pod/v1/product_admin_pb"
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  LoadingCircle,
  Switch,
  TextareaField,
  toast,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useProductGroupStore } from "./modal-product-group-store"
import Platform from "./platform"
import SelectProduct from "./select-product"
import ProductGroupTable from "./table/table"

const defaultValues = {
  name: "",
  quantity: 100,
  description: "",
  platforms: [AllPlatform.TIKTOKSHOP],
  status: RushProductGroupStatus.INACTIVE,
}

export default function ModalProductGroup() {
  const form = useForm({
    defaultValues,
    resolver: zodResolver(CreateProductGroupSchema),
  })

  const { open, actions, productGroup, callback, productGroupId } =
    useProductGroupStore()

  const { data: rushProducts, refetch } = useQueryPod(
    staffListRushProductVariant,
    undefined,
    {
      select: (data) => {
        return data.data
      },
      enabled: open,
    },
  )

  const isEdit = !!productGroupId

  const { data: productGroupDetail, isPending } = useQueryPod(
    staffDetailRushProductGroup,
    {
      rushProductGroupId: productGroupId,
    },
    {
      enabled: isEdit,
    },
  )

  useEffect(() => {
    if (isEdit) {
      if (productGroupDetail) {
        const productIds = productGroupDetail.data?.listRushProduct.map(
          (item) => item.productId,
        )

        const rushProductsFiltered = rushProducts
          ?.filter((item) => productIds?.includes(item.productId))
          .map((item) => {
            const productSelected =
              productGroupDetail.data?.listRushProduct.find(
                (product) => product.productId === item.productId,
              )

            const productSelectedFromList = rushProducts.find(
              (product) => product.productId === item.productId,
            )

            return {
              ...item,
              listRushVariant: item.listRushVariant.map((variant) => {
                const selected = productSelected?.listRushVariant.some(
                  (product) => product.variantId === variant.variantId,
                )
                const rushProductGroupIdFromList =
                  productSelectedFromList?.listRushVariant.find(
                    (v) => v.variantId === variant.variantId,
                  )?.rushProductGroupId

                const inProductGroup = variant.rushProductGroupId

                // if rushProductGroupIdFromList is not the same as the rushProductGroupId in the productGroupDetail, then the variant is disabled
                const disabled = inProductGroup
                  ? rushProductGroupIdFromList !==
                    productGroupDetail.data?.rushProductGroupInfo
                      ?.rushProductGroupId
                  : false

                return {
                  ...variant,
                  disabled: disabled,
                  selected: Boolean(selected),
                }
              }),
            }
          })

        const productGroupInfo = {
          name: productGroupDetail.data?.rushProductGroupInfo?.name || "",
          quantity: productGroupDetail.data?.rushProductGroupInfo?.quantity
            ? Number(productGroupDetail.data?.rushProductGroupInfo?.quantity)
            : 0,
          description:
            productGroupDetail.data?.rushProductGroupInfo?.description || "",
          platforms: productGroupDetail.data?.rushProductGroupInfo?.platforms,
          status: productGroupDetail.data?.rushProductGroupInfo?.status,
        }

        actions.setProductGroup(rushProductsFiltered || [])
        form.reset(productGroupInfo)
      }
    }
  }, [productGroupDetail, rushProducts, isEdit])

  const handleRefetchAfterError = async (error?: any) => {
    const errorCode = getBusinessCode(error as unknown as ErrorResponse)
    if (errorCode?.code === "103-2403") {
      const data = await refetch()

      if (data.data) {
        const productGroupsNew = productGroup.map((item) => {
          const product = data.data.find(
            (product) => product.productId === item.productId,
          )
          if (!product) {
            return item
          }
          const listRushVariant = product?.listRushVariant?.map((item) => ({
            ...item,
            selected: !item.rushProductGroupId,
            disabled: !!item.rushProductGroupId,
          }))

          return {
            ...item,
            listRushVariant: listRushVariant || [],
          }
        })

        actions.setProductGroup(productGroupsNew)
      }
    }
  }

  const mutationCreateProductGroup = useMutationPod(
    staffCreateRushProductGroup,
    {
      onSuccess: () => {
        handleCancel()
        toast({
          title: "Product group created successfully",
          variant: "success",
        })
        callback?.()
      },
      onError: (error) => {
        handleRefetchAfterError(error)
        toast({
          title: "Creating product group",
          description: error.rawMessage,
          variant: "error",
        })
      },
    },
  )

  const mutationUpdateProductGroup = useMutationPod(
    staffUpdateRushProductGroup,
    {
      onSuccess: () => {
        handleCancel()
        toast({
          title: "Product group updated successfully",
          variant: "success",
        })
        callback?.()
      },
      onError: (error) => {
        handleRefetchAfterError(error)
        toast({
          title: "Updating product group",
          description: error.rawMessage,
          variant: "error",
        })
      },
    },
  )

  const handleSubmit = async (data: CreateProductGroupFormData) => {
    const listRushVariant: StaffCreateRushProductGroupRequest_RushVariant[] =
      productGroup
        .map((item) => {
          return item.listRushVariant
            .filter((variant) => variant.selected)
            .map((variant) => {
              return new StaffCreateRushProductGroupRequest_RushVariant({
                productId: item.productId,
                variantId: variant.variantId,
              })
            })
        })
        .flat()
    if (isEdit) {
      await mutationUpdateProductGroup.mutate({
        rushProductGroupId: productGroupId,
        name: data.name,
        description: data.description,
        quantity: BigInt(data.quantity),
        platforms: data.platforms,
        listRushVariant: listRushVariant,
        status: data.status,
      })
    } else {
      await mutationCreateProductGroup.mutate({
        name: data.name,
        description: data.description,
        quantity: BigInt(data.quantity),
        platforms: data.platforms,
        listRushVariant: listRushVariant,
        status: data.status,
      })
    }
  }
  const handleCancel = () => {
    actions.setOpen(false)
    form.reset(defaultValues)
    actions.setProductGroup([])
    actions.setProductGroupId("")
  }
  const hasVariantSelected = productGroup.some((item) =>
    item.listRushVariant?.some((variant) => variant.selected),
  )
  const disableSave =
    !hasVariantSelected ||
    mutationCreateProductGroup.isPending ||
    form.formState.isSubmitting

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        actions.setOpen(open)
        if (!open) {
          handleCancel()
        }
      }}
    >
      <DialogContent
        className={cn(
          "min-w-screen bg-secondary h-screen rounded-none flex flex-col items-start justify-start ",
        )}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit product group" : "Create product group"}
          </DialogTitle>
        </DialogHeader>
        {isEdit && isPending && (
          <div className="flex items-center justify-center w-full">
            <LoadingCircle />
          </div>
        )}

        <Form {...form}>
          <form
            className="w-full h-full flex flex-col flex-1 overflow-y-auto px-1 b"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="pb-20 space-y-4">
              <div className="bg-background p-4 rounded-lg w-full grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="items-start">
                      <FormLabel required>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Product group name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="items-start">
                      <FormLabel required>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) => {
                            const value = e.target.value
                              ? Number(e.target.value)
                              : ""
                            field.onChange(value)
                          }}
                          placeholder="Quantity"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <TextareaField {...field} placeholder="Description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Status</FormLabel>
                      <FormControl>
                        <Switch
                          checked={
                            field.value === RushProductGroupStatus.ACTIVE
                          }
                          onCheckedChange={(checked) => {
                            field.onChange(
                              checked
                                ? RushProductGroupStatus.ACTIVE
                                : RushProductGroupStatus.INACTIVE,
                            )
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Platform />

              <div className="col-span-2 space-y-4 bg-background p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Product Group</h2>
                    <p className="text-sm text-foreground/50">
                      Product groups are used to group products together.
                    </p>
                  </div>
                  <SelectProduct rushProducts={rushProducts || []} />
                </div>
                <ProductGroupTable form={form} />
              </div>
            </div>
            <DialogFooter className="fixed p-4 left-0 bottom-0 w-full bg-background">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                disabled={disableSave}
                loading={
                  mutationCreateProductGroup.isPending ||
                  form.formState.isSubmitting
                }
                type="submit"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
