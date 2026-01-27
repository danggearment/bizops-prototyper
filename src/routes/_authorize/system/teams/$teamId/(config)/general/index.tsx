import LayoutTeam from "@/components/layout-team"
import {
  useMutationPod,
  useQueryPod,
} from "@/services/connect-rpc/transport.tsx"
import {
  ConfigGeneral,
  ConfigGeneral_Config,
  StaffGetConfigGeneral,
} from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import {
  staffConfigGeneral,
  staffGetTeamConfig,
} from "@gearment/nextapi/api/pod/v1/web_setting-SellerSettingAPI_connectquery.ts"
import { LoadingCircle, PageHeader, Switch, toast } from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, useParams } from "@tanstack/react-router"
import { CogIcon, UserCog2Icon } from "lucide-react"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const TEAM_CONFIG_KEYS = [
  "autoSyncTracking",
  "autoApprove",
  "amazonConfirmShipment",
  "autoPayment",
  "amazonAutoReplaceTracking",
  "receiveTrackingCodeViaEmail",
  "autoMatchOrderByProductSku",
]

const SYSTEM_CONFIG_KEYS = [
  "enableMassPaypal",
  "enableInstantPaypal",
  "enableRushOrder",
  "enableCreditCard",
  "enableLianLianGlobal",
  "enablePayoneer",
  "enablePingPong",
  "enableMassLianlianGlobal",
  "enableMassPayoneer",
  "enableMassPingpong",
]

export const Route = createFileRoute(
  "/_authorize/system/teams/$teamId/(config)/general/",
)({
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
        name: "General configuration",
        link: "#",
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = useParams({
    from: "/_authorize/system/teams/$teamId/(config)/general/",
  })
  const [openConfirmModal, onCloseConfirmModal] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])
  const {
    data: generalSettings,
    isLoading,
    refetch,
  } = useQueryPod(
    staffGetTeamConfig,
    {
      teamId: params.teamId,
    },
    {
      select: (data) => data?.data,
    },
  )

  const UpdateGeneralSettingsSchema = useMemo(() => {
    const schemaFields = Object.keys(generalSettings || {}).reduce(
      (acc, key) => {
        acc[key] = z.boolean()
        return acc
      },
      {} as Record<string, z.ZodBoolean>,
    )
    return z.object(schemaFields)
  }, [generalSettings])

  type UpdateGeneralSettings = z.infer<typeof UpdateGeneralSettingsSchema>

  const mutation = useMutationPod(staffConfigGeneral, {
    onSuccess: () => {
      toast({
        variant: "success",
        title: "General settings",
        description: "Update general settings successfully",
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "General settings",
        description: error.rawMessage || "Failed to update settings",
      })
    },
    onSettled: () => {
      refetch()
    },
  })
  const defaultValues = useMemo(() => {
    if (!generalSettings) return {} as Record<string, boolean>

    return Object.keys(generalSettings).reduce(
      (acc, key) => {
        acc[key] = Boolean(
          (
            generalSettings[
              key as keyof StaffGetConfigGeneral
            ] as ConfigGeneral_Config
          )?.value,
        )
        return acc
      },
      {} as Record<string, boolean>,
    )
  }, [generalSettings])

  const form = useForm<UpdateGeneralSettings>({
    values: defaultValues,
    resolver: zodResolver(UpdateGeneralSettingsSchema),
  })

  const handleUpdateSettings = async (formValues: UpdateGeneralSettings) => {
    await mutation.mutateAsync({
      teamId: params.teamId,
      config: formValues,
    })
  }

  const handleChange = (key: keyof UpdateGeneralSettings, value: boolean) => {
    const settingName = (
      generalSettings?.[
        key as keyof StaffGetConfigGeneral
      ] as ConfigGeneral_Config
    )?.title
    openConfirmModal({
      title: "Update General Settings",
      description: (
        <div>
          Are you sure you want to update{" "}
          <span className="font-semibold text-black">{settingName}</span>?
        </div>
      ),
      onConfirm: async () => {
        form.setValue(key, value)
        await handleUpdateSettings(form.getValues())
        onCloseConfirmModal()
      },
    })
  }

  const [teamConfig, systemConfig] = useMemo(() => {
    if (!generalSettings) return [[], []]
    const teamConfig = Object.entries(generalSettings as ConfigGeneral).filter(
      ([key]) => TEAM_CONFIG_KEYS.includes(key),
    )
    const systemConfig = Object.entries(
      generalSettings as ConfigGeneral,
    ).filter(([key]) => SYSTEM_CONFIG_KEYS.includes(key))
    return [teamConfig, systemConfig]
  }, [generalSettings])

  const disabled = mutation.isPending

  return (
    <LayoutTeam>
      <div className="space-y-6">
        <PageHeader>
          <PageHeader.Title>General configuration</PageHeader.Title>
        </PageHeader>

        {isLoading && (
          <div className="h-48 flex items-center justify-center">
            <LoadingCircle />
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {!isLoading && generalSettings && (
            <div className="space-y-4 bg-background rounded-md p-4">
              <h3 className="text-lg font-semibold flex items-center gap-1">
                <UserCog2Icon className="w-4 h-4" />
                Team
              </h3>
              <div className="space-y-4">
                {teamConfig.map(([key, config]) => (
                  <div
                    key={key}
                    className="p-4 rounded-lg border border-border hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="space-y-1.5">
                        <h3 className="font-semibold ">
                          {(config as ConfigGeneral_Config).title}
                        </h3>
                        <p className="text-sm text-secondary-text">
                          {(config as ConfigGeneral_Config).description}
                        </p>
                      </div>
                      <div className="mt-1">
                        <Switch
                          className="cursor-pointer"
                          disabled={disabled}
                          onCheckedChange={(value) =>
                            handleChange(
                              key as keyof UpdateGeneralSettings,
                              value,
                            )
                          }
                          checked={
                            form.watch(key as keyof UpdateGeneralSettings) ===
                            true
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!isLoading && generalSettings && (
            <div className="space-y-4  bg-background rounded-md p-4">
              <h3 className="text-lg font-semibold flex items-center gap-1">
                <CogIcon className="w-4 h-4" />
                System
              </h3>
              <div className="space-y-4">
                {systemConfig.map(([key, config]) => (
                  <div
                    key={key}
                    className="p-4 rounded-lg border border-border hover:bg-gray-50 dark:hover:bg-dark-3 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="space-y-1.5">
                        <h3 className="font-semibold ">
                          {(config as ConfigGeneral_Config).title}
                        </h3>
                        <p className="text-sm text-secondary-text">
                          {(config as ConfigGeneral_Config).description}
                        </p>
                      </div>
                      <div className="mt-1">
                        <Switch
                          className="cursor-pointer"
                          disabled={disabled}
                          onCheckedChange={(value) =>
                            handleChange(
                              key as keyof UpdateGeneralSettings,
                              value,
                            )
                          }
                          checked={
                            form.watch(key as keyof UpdateGeneralSettings) ===
                            true
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutTeam>
  )
}

export default RouteComponent
