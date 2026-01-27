import LayoutTeam from "@/components/layout-team"
import { useMutationPod, useQueryPod } from "@/services/connect-rpc/transport"
import { LegacyCustomerPrintType } from "@/services/connect-rpc/types"
import {
  staffConfigTeamPrintType,
  staffGetTeamConfigPrintType,
} from "@gearment/nextapi/api/pod/v1/web_setting-SellerSettingAPI_connectquery"
import {
  Button,
  FormField,
  PageHeader,
  RadioGroup,
  RadioGroupItem,
  toast,
} from "@gearment/ui3"
import { createFileRoute, useParams } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
export const Route = createFileRoute(
  "/_authorize/system/teams/$teamId/(config)/print-type/",
)({
  component: RouteComponent,
  beforeLoad: () => ({
    breadcrumb: [
      {
        name: "System",
        link: "/system/teams",
      },
      {
        name: "Teams",
        link: "/system/teams",
      },
      {
        name: "Print Type",
        link: "#",
      },
    ],
  }),
})

const mapLegacyCustomerPrintType = (printType: string) => {
  switch (printType) {
    case "0":
      return LegacyCustomerPrintType.ALL
    case "1":
      return LegacyCustomerPrintType.DTG
    case "2":
      return LegacyCustomerPrintType.DTF
  }
}

function RouteComponent() {
  const params = useParams({
    from: "/_authorize/system/teams/$teamId/(config)/print-type/",
  })

  const { data, refetch } = useQueryPod(
    staffGetTeamConfigPrintType,
    {
      teamId: params.teamId,
    },
    {
      select: (data) =>
        data.data?.printType ?? [
          {
            description: "All",
            name: LegacyCustomerPrintType.ALL,
            title: "Normal",
            value: true,
          },
        ],
    },
  )

  const form = useForm({
    values: {
      printType: data?.find((option) => option.value)?.name ?? "",
    },
  })

  const mutation = useMutationPod(staffConfigTeamPrintType, {
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Print type updated",
        description: "The print type has been updated successfully",
      })
      refetch()
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Print type update failed",
        description: "The print type update failed",
      })
    },
  })

  const handleSubmit = async (values: {
    printType: LegacyCustomerPrintType | string
  }) => {
    await mutation.mutate({
      teamId: params.teamId,
      printType: mapLegacyCustomerPrintType(values.printType as string),
    })
  }

  return (
    <LayoutTeam>
      <PageHeader>
        <div className="space-y-1">
          <PageHeader.Title>Print Type</PageHeader.Title>
          <PageHeader.Description className="text-sm text-gray-500">
            Select the print type for the team.
          </PageHeader.Description>
        </div>
      </PageHeader>
      <div className="bg-background rounded-xl p-4">
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="printType"
            render={({ field }) => (
              <RadioGroup
                value={field.value.toString()}
                onValueChange={(value) => field.onChange(value)}
              >
                <div className="space-y-6">
                  {data?.map((option) => {
                    return (
                      <label
                        className="flex gap-2.5 cursor-pointer items-center"
                        key={option.name}
                      >
                        <RadioGroupItem value={option.name.toString()} />
                        <div className="flex-1">
                          <p className=" body-medium font-semibold">
                            {option.title}
                          </p>
                          <p className="body-small">{option.description}</p>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </RadioGroup>
            )}
          />
          <Button
            type="submit"
            className="mt-4"
            loading={mutation.isPending}
            disabled={mutation.isPending || !form.formState.isDirty}
          >
            Save
          </Button>
        </form>
      </div>
    </LayoutTeam>
  )
}
