import { AttributeGroupStatusLabel } from "@/constants/attributes"
import {
  AttributeGroupStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import { AttributeGroupValueSchema } from "@/schemas/schemas/attributes"
import { useMutationPod } from "@/services/connect-rpc/transport"
import {
  ModalAttributeGroup,
  useModalAttributeGroup,
} from "@/services/modals/modal-attribute-group"
import { ModalAttributeValue } from "@/services/modals/modal-attribute-value"
import { ModalExcludeAttributeValue } from "@/services/modals/modal-exclude-attribute-value"
import { useModalExcludeAttributeValue } from "@/services/modals/modal-exclude-attribute-value/modal-exclude-attribute-value-store"
import { queryClient } from "@/services/react-query"
import {
  staffCountGMAttributeValueStatus,
  staffGetGMAttributeGroupDetail,
  staffListGMAttributeGroup,
  staffListGMAttributeValue,
  staffUpdateGMAttributeGroup,
  staffUpdateGMAttributeGroupValues,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import {
  Badge,
  Button,
  formatDateString,
  PageHeader,
  Skeleton,
  toast,
} from "@gearment/ui3"
import {
  createFileRoute,
  Link,
  stripSearchParams,
  useParams,
  useRouterState,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { ArrowLeftIcon, PenLineIcon, PlusIcon } from "lucide-react"
import {
  AttributeGroupValueProvider,
  useAttributeGroupValue,
} from "./-attribute-group-value-context"
import GroupValueAnalytics from "./-components/group-value-analytics"
import GroupValueFilter from "./-components/group-value-filter"
import GroupValueTable from "./-components/group-value-table/table"

export const Route = createFileRoute(
  "/_authorize/product-management/attributes/group/$groupId/",
)({
  beforeLoad: async ({ params: { groupId } }) => {
    return {
      breadcrumb: [
        {
          name: "Product management",
          link: "/product-management",
        },
        {
          name: "Attributes group",
          link: "/product-management/attributes/group",
        },
        {
          name: groupId,
          link: "/product-management/attributes/group/$groupId",
        },
      ],
    }
  },
  validateSearch: zodValidator(AttributeGroupValueSchema),
  search: {
    middlewares: [stripSearchParams(AttributeGroupValueSchema.parse({}))],
  },
  component: () => (
    <AttributeGroupValueProvider>
      <Index />
    </AttributeGroupValueProvider>
  ),
})

function Index() {
  const { attributeGroupDetail, loading } = useAttributeGroupValue()
  const {
    attrName,
    attrDescription,
    status,
    createdAt,
    updatedAt,
    selectionType,
    maxSelection,
    minSelection,
  } = attributeGroupDetail

  const { groupId } = useParams({
    from: "/_authorize/product-management/attributes/group/$groupId/",
  })

  const { actions: actionsExcludeAttributeValue } =
    useModalExcludeAttributeValue()

  const { actions } = useModalAttributeGroup()

  const callbackHistory = useRouterState({
    select: (state) => state.location.state,
  })

  const mutationAddAttributeValueToGroup = useMutationPod(
    staffUpdateGMAttributeGroupValues,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            staffListGMAttributeValue.service.typeName,
            staffListGMAttributeValue.name,
          ],
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffGetGMAttributeGroupDetail.service.typeName,
            staffGetGMAttributeGroupDetail.name,
          ],
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffCountGMAttributeValueStatus.service.typeName,
            staffCountGMAttributeValueStatus.name,
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

  const mutationUpdateAttributeGroup = useMutationPod(
    staffUpdateGMAttributeGroup,
    {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Attribute group updated",
          description: "Attribute group has been updated successfully",
        })
        const keys = [
          staffListGMAttributeGroup,
          staffGetGMAttributeGroupDetail,
          staffCountGMAttributeValueStatus,
        ]
        keys.forEach((key) => {
          queryClient.invalidateQueries({
            queryKey: [key.service.typeName, key.name],
          })
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
          attributeKey: groupId,
          ...values,
        })
      },
    })
  }

  return (
    <>
      <div className="body-small mb-4">
        <Link
          to={callbackHistory.href || "/product-management/attributes/group"}
          className="inline-flex items-center gap-2"
        >
          <Button variant="outline" size="icon" className="p-0">
            <ArrowLeftIcon size={14} />
          </Button>
          <span>Back to attributes group</span>
        </Link>
      </div>
      <div className="space-y-4 pb-4">
        <PageHeader>
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4">
            <div>
              <PageHeader.Title>
                {loading ? (
                  <Skeleton className="w-full h-[20px]" />
                ) : (
                  <div className="flex items-center gap-2">
                    {attrName}
                    <Badge
                      variant={mappingColor(
                        AttributeGroupStatusColorsMapping,
                        status,
                      )}
                    >
                      {AttributeGroupStatusLabel[status]}
                    </Badge>
                  </div>
                )}
              </PageHeader.Title>
              <PageHeader.Description>{attrDescription}</PageHeader.Description>
            </div>
            <PageHeader.Action>
              <Button
                size="sm"
                className="cursor-pointer w-[130px]"
                onClick={() => {
                  actionsExcludeAttributeValue.onOpen({
                    groupId: groupId,
                    onConfirm: async (values) => {
                      await mutationAddAttributeValueToGroup.mutateAsync({
                        attributeKey: groupId,
                        newAttributeValueCodes: values,
                      })
                    },
                  })
                }}
              >
                <PlusIcon size={16} /> Add attribute
              </Button>
              <Button
                size="sm"
                className="cursor-pointer w-[130px]"
                variant="outline"
                onClick={handleEditAttributeGroup}
              >
                <PenLineIcon size={16} /> Edit group
              </Button>
            </PageHeader.Action>
          </div>
        </PageHeader>
        <GroupValueAnalytics />
        <GroupValueFilter />
        <GroupValueTable />
      </div>
      <ModalAttributeValue />
      <ModalExcludeAttributeValue />
      <ModalAttributeGroup />
    </>
  )
}
