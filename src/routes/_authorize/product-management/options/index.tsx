import { useMutationPod } from "@/services/connect-rpc/transport"
import {
  CatalogOption_Group_Status,
  GMProductOption_OptionType,
} from "@/services/connect-rpc/types"
import { ModalCatalogOption } from "@/services/modals/modal-catalog-option"
import {
  ModalOptionGroup,
  OptionGroupType,
  useModalOptionGroup,
} from "@/services/modals/modal-option-group"
import { queryClient } from "@/services/react-query"
import {
  staffCreateCatalogOptionGroup,
  staffListCatalogOption,
  staffListCatalogOptionGroup,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { Button, PageHeader, toast } from "@gearment/ui3"
import { createFileRoute } from "@tanstack/react-router"
import { Download, Plus, Upload } from "lucide-react"
import OptionGroups from "./-components/option-groups/option-groups"
import { OptionManagementProvider } from "./-option-management-context"

export const Route = createFileRoute("/_authorize/product-management/options/")(
  {
    staticData: {
      breadcrumb: [
        {
          name: "Product management",
          link: "/product-management",
        },
        {
          name: "Options",
          link: "/product-management/options",
        },
      ],
    },
    component: () => (
      <OptionManagementProvider>
        <Index />
      </OptionManagementProvider>
    ),
  },
)

function Index() {
  const { actions } = useModalOptionGroup()

  const mutationCreateOptionGroup = useMutationPod(
    staffCreateCatalogOptionGroup,
    {
      onSuccess: () => {
        actions.onClose()
        toast({
          variant: "success",
          title: "Option group created",
          description: "Option group created successfully",
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
          title: "Option group creation failed",
          description: error.rawMessage,
        })
      },
    },
  )

  return (
    <div>
      <PageHeader>
        <div>
          <PageHeader.Title>Options</PageHeader.Title>
          <PageHeader.Description>
            Manage product options and their values
          </PageHeader.Description>
        </div>
        <div className="space-x-2">
          <Button variant="outline" className="cursor-pointer">
            <Upload />
            Import
          </Button>
          <Button variant="outline" className="cursor-pointer">
            <Download />
            Export
          </Button>
          <Button
            className="cursor-pointer"
            onClick={() => {
              actions.onOpen({
                title: "Add option group",
                description: "Add a new option group",
                confirmText: "Add group",
                defaultValues: {
                  groupName: "",
                  status:
                    CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_ACTIVE,
                  type: GMProductOption_OptionType.COLOR,
                  description: "",
                },
                onConfirm: async (values: OptionGroupType) => {
                  await mutationCreateOptionGroup.mutateAsync({
                    name: values.groupName,
                    description: values.description,
                    type: values.type,
                    status: values.status,
                  })
                },
              })
            }}
          >
            <Plus />
            Add group
          </Button>
        </div>
      </PageHeader>
      <OptionGroups />
      <ModalCatalogOption />
      <ModalOptionGroup />
    </div>
  )
}
