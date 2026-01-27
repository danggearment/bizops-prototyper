import { AttributesGroupSchema } from "@/schemas/schemas/attributes"
import { useMutationPod } from "@/services/connect-rpc/transport"
import { GMAttributeSelectionType } from "@/services/connect-rpc/types"
import {
  ModalAttributeGroup,
  useModalAttributeGroup,
} from "@/services/modals/modal-attribute-group"
import { ModalAttributeValue } from "@/services/modals/modal-attribute-value"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import {
  ModalExcludeAttributeValue,
  useModalExcludeAttributeValue,
} from "@/services/modals/modal-exclude-attribute-value"
import { queryClient } from "@/services/react-query"
import { ErrorResponse, getBusinessCode } from "@/utils"
import {
  staffCreateGMAttributeGroup,
  staffListGMAttributeGroup,
  staffUpdateGMAttributeGroupValues,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { Button, PageHeader, toast } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { PlusIcon } from "lucide-react"
import { AttributeGroupProvider } from "./-attribute-group-context"
import GroupAnalytics from "./-components/group-analytics"
import GroupFilter from "./-components/group-filter"
import GroupTable from "./-components/table/group-table"

export const Route = createFileRoute(
  "/_authorize/product-management/attributes/group/",
)({
  staticData: {
    breadcrumb: [
      {
        name: "Product management",
        link: "/product-management",
      },
      {
        name: "Attributes group",
        link: "/product-management/attributes/group",
      },
    ],
  },
  validateSearch: zodValidator(AttributesGroupSchema),
  search: {
    middlewares: [stripSearchParams(AttributesGroupSchema.parse({}))],
  },
  component: () => (
    <AttributeGroupProvider>
      <Index />
    </AttributeGroupProvider>
  ),
})

function Index() {
  const actions = useModalAttributeGroup((state) => state.actions)
  const [setOpen, onCloseConfirm] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const { actions: actionsExcludeAttributeValue } =
    useModalExcludeAttributeValue()

  const mutationAddAttributeValueToGroup = useMutationPod(
    staffUpdateGMAttributeGroupValues,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            staffListGMAttributeGroup.service.typeName,
            staffListGMAttributeGroup.name,
          ],
        })
        actionsExcludeAttributeValue.onClose()
        toast({
          variant: "success",
          title: "Attribute value added to group",
          description: "Attribute value has been added to group successfully",
        })
      },
    },
  )

  const mutationCreateAttributeGroup = useMutationPod(
    staffCreateGMAttributeGroup,
    {
      onSuccess: (res, variables) => {
        toast({
          variant: "success",
          title: "Attribute group created",
          description: "Attribute group has been created successfully",
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffListGMAttributeGroup.service.typeName,
            staffListGMAttributeGroup.name,
          ],
        })
        actions.onClose()
        setOpen({
          title: "Add attributes to this group?",
          description: (
            <>
              The group <b>{variables.name}</b> has been created successfully.
              Would you like to add attributes to this group now?
            </>
          ),
          confirmText: "Yes, add now",
          cancelText: "Later",
          onConfirm: () => {
            onCloseConfirm()
            actionsExcludeAttributeValue.onOpen({
              groupId: res.attributeGroupKey,
              onConfirm: async (values) => {
                await mutationAddAttributeValueToGroup.mutateAsync({
                  attributeKey: res.attributeGroupKey,
                  newAttributeValueCodes: values,
                })
              },
            })
          },
        })
      },
      onError: (error) => {
        const businessErrorCode = getBusinessCode(
          error as unknown as ErrorResponse,
        )
        if (businessErrorCode?.code === "103-2101") {
          return
        } else {
          toast({
            variant: "error",
            title: "Attribute group creation failed",
            description: error.rawMessage,
          })
        }
      },
    },
  )
  return (
    <>
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <PageHeader.Title>Attributes group</PageHeader.Title>
            <PageHeader.Description>
              Organize attributes into logical groups for easier management
            </PageHeader.Description>
          </div>
          <PageHeader.Action>
            <Button
              onClick={() =>
                actions.onOpen({
                  defaultValues: {
                    name: "",
                    description: "",
                    selectionType:
                      GMAttributeSelectionType.GM_ATTRIBUTE_SELECTION_TYPE_SINGLE,
                    maxSelection: 3,
                    minSelection: 1,
                  },
                  modifyText: undefined,
                  onConfirm: async (values) => {
                    await mutationCreateAttributeGroup.mutateAsync(values)
                  },
                })
              }
            >
              <PlusIcon size={16} /> Add group
            </Button>
          </PageHeader.Action>
        </div>
      </PageHeader>
      <div className="space-y-4">
        <GroupAnalytics />
        <GroupFilter />
        <GroupTable />
      </div>
      <ModalAttributeValue />
      <ModalExcludeAttributeValue />
      <ModalAttributeGroup />
    </>
  )
}
