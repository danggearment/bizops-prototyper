import { OpenFeaturesSearchSchema } from "@/schemas/schemas/open-features"
import { useMutationIam } from "@/services/connect-rpc/transport"
import {
  FlagType,
  ModalOpenFeature,
  useOpenFeatureModal,
} from "@/services/modals/modal-open-feature"
import { queryClient } from "@/services/react-query"
import {
  staffCreateFlag,
  staffListFlag,
} from "@gearment/nextapi/api/iam/v1/user_admin-UserAccountAdminAPI_connectquery"
import { Button, PageHeader, toast } from "@gearment/ui3"
import { createFileRoute } from "@tanstack/react-router"
import FlagTable from "./-components/table"

export const Route = createFileRoute("/_authorize/dev/open-features/")({
  component: Index,
  validateSearch: OpenFeaturesSearchSchema,
})

function Index() {
  const [actions] = useOpenFeatureModal((state) => [state.actions])

  const mutation = useMutationIam(staffCreateFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [staffListFlag.service.typeName, staffListFlag.name],
      })
      toast({
        title: "Create flag",
        description: "Create flag successfully",
      })
      actions.onClose()
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Create flag",
        description: error.rawMessage,
      })
    },
  })

  const handleSubmit = async (values: FlagType) => {
    const queryEmail = values.whitelist
      .split(", ")
      .map((email) => `"${email}"`)
      .join(", ")

    await mutation.mutateAsync({
      flag: values.flagName,
      variations: {
        falseVar: {
          enable: values.defaultActive,
          version: values.defaultVersion,
        },
        trueVar: { enable: true, version: values.whitelistVersion },
      },
      targeting: [{ query: `email in [${queryEmail}]`, variation: "trueVar" }],
      defaultRule: { percentage: { falseVar: 100, trueVar: 0 } },
    })
  }

  return (
    <div>
      <PageHeader>
        <PageHeader.Title>Open Features</PageHeader.Title>
        <PageHeader.Action>
          <Button
            onClick={() =>
              actions.onOpen({
                title: "Create flag feature",
                defaultValues: {
                  flagName: "",
                  whitelist: "",
                  defaultActive: false,
                },
                onSave: handleSubmit,
              })
            }
          >
            Add Flag
          </Button>
        </PageHeader.Action>
      </PageHeader>

      <FlagTable />
      <ModalOpenFeature />
    </div>
  )
}
