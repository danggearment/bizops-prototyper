import { UpdateTeamTierStep } from "@/constants/product-tier"
import {
  UpdateTeamTierSearchSchema,
  UpdateTeamTierSearchType,
} from "@/schemas/schemas/global-configuration"
import { useMutationPod, useQueryPod } from "@/services/connect-rpc/transport"
import {
  staffListProductPriceTierKey,
  staffPreviewTeamTierChanges,
  staffUpdateTeamTiers,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { StaffListProductPriceTierKeyResponse_Key } from "@gearment/nextapi/api/pod/v1/product_admin_pb"
import { Button, toast } from "@gearment/ui3"
import { formatTextMany } from "@gearment/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocation, useNavigate, useSearch } from "@tanstack/react-router"
import { useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { handleHighlightTeamRows } from "../-helper"
import { SelectTierUpdate } from "./select-tier-update"
import { UpdateTeamTierForm } from "./update-team-tier-form"

function UpdateTeamTier() {
  const search = useSearch({
    from: "/_authorize/global-configuration/tier-management/update-team-tier",
  })
  const navigate = useNavigate()
  const beforeLocation = useLocation({
    select: (data) => data.state,
  })

  const handleSetNewSearch = (newSearch: UpdateTeamTierSearchType) => {
    navigate({
      to: "/global-configuration/tier-management/update-team-tier",
      search: newSearch,
      state: beforeLocation,
      replace: true,
    })
  }

  const { data: priceKeys } = useQueryPod(staffListProductPriceTierKey, {})

  const priceKeysOptions = useMemo(() => {
    return (
      priceKeys?.keys?.map((key) => ({
        label: key.tierName,
        value: key.tierId,
      })) || []
    )
  }, [priceKeys])

  const form = useForm<UpdateTeamTierSearchType>({
    defaultValues: {
      teamIds: search.teamIds || [],
      newTier: search.newTier || "",
      selectedTiers: search.selectedTiers || {},
    },
    resolver: zodResolver(UpdateTeamTierSearchSchema),
    mode: "onChange",
  })

  // Preview change tier
  const { data: previewData, refetch: refetchPreview } = useQueryPod(
    staffPreviewTeamTierChanges,
    {
      teamIds: search.teamIds || [],
      newTierId: search.newTier || "",
    },
    {
      enabled: search.step === UpdateTeamTierStep.UpdateTier,
    },
  )

  const tierMapping = useMemo(() => {
    return priceKeys?.keys?.reduce(
      (acc, key) => {
        acc[key.tierId] = key
        return acc
      },
      {} as Record<string, StaffListProductPriceTierKeyResponse_Key>,
    )
  }, [priceKeys?.keys])

  const selectedTiers = form.watch("selectedTiers") || {}

  const onBack = () => {
    handleSetNewSearch({
      ...search,
      step: UpdateTeamTierStep.SelectTeam,
    })
  }

  const handleApplyToAll = () => {
    if (!search.newTier) return

    const newSelectedTiers: Record<string, string> = {}
    ;(previewData?.data || []).forEach((item) => {
      if (item.isValid) {
        newSelectedTiers[item.teamId] = search.newTier
      }
    })
    form.setValue("selectedTiers", newSelectedTiers)
    handleSetNewSearch({
      ...search,
      selectedTiers: newSelectedTiers,
    })
  }

  const mutationApply = useMutationPod(staffUpdateTeamTiers, {
    onSuccess: (data) => {
      refetchPreview()

      const successCount = data.successTeamIds?.length || 0
      const failedCount = data.failedTeamIds?.length || 0

      if (failedCount > 0) {
        const { dismiss } = toast({
          toastLimit: 2,
          variant: "destructive",
          title: "Bulk update incomplete",
          description: `Failed to update ${failedCount} of ${formatTextMany("team", Number(previewData?.total))}`,
          action: (
            <div className="flex gap-3">
              <Button
                className="p-0 h-auto text-red-dark body-small font-semibold"
                size="sm"
                variant="link"
                onClick={() => {
                  handleHighlightTeamRows(data.failedTeamIds || [], false)
                  dismiss()
                }}
              >
                View teams
              </Button>
              <Button
                onClick={() => {
                  dismiss()
                }}
                className="p-0 h-auto text-sm text-white"
                size="sm"
                variant="link"
              >
                Dismiss
              </Button>
            </div>
          ),
        })
      }

      if (successCount > 0) {
        const { dismiss } = toast({
          variant: "success",
          title: "Bulk update complete",
          description: `Successfully updated ${successCount} of ${formatTextMany("team", Number(previewData?.total))}`,
          action: (
            <div className="flex gap-3">
              <Button
                className="p-0 h-auto text-green-700 body-small font-semibold"
                size="sm"
                variant="link"
                onClick={() => {
                  handleHighlightTeamRows(data.successTeamIds || [], true)
                  dismiss()
                }}
              >
                View teams
              </Button>
              <Button
                onClick={() => {
                  dismiss()
                }}
                className="p-0 h-auto body-small text-secondary-text"
                size="sm"
                variant="link"
              >
                Dismiss
              </Button>
            </div>
          ),
        })
      }

      form.setValue("selectedTiers", {})
      handleSetNewSearch({
        ...search,
        selectedTiers: {},
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.rawMessage || "Error applying team tier changes",
      })
    },
  })

  const handleSubmitApply = async () => {
    const data = (previewData?.data || [])
      .filter((item) => item.isValid)
      .map((item) => {
        const desiredTierId = selectedTiers[item.teamId] ?? item.newTierId
        return {
          teamId: item.teamId,
          currentTierId: item.currentTierId,
          newTierId: desiredTierId,
          changed: item.currentTierId !== desiredTierId,
        }
      })
      .filter((x) => x.changed)
      .map(({ changed, ...rest }) => rest)

    await mutationApply.mutateAsync({
      data: data,
    })
  }

  const isDisableUpdateButton = useMemo(() => {
    return mutationApply.isPending
  }, [search.teamIds, search.newTier])

  return (
    <FormProvider {...form}>
      {search.step === UpdateTeamTierStep.SelectTeam && (
        <SelectTierUpdate
          handleSetNewSearch={handleSetNewSearch}
          priceKeysOptions={priceKeysOptions}
        />
      )}

      {search.step === UpdateTeamTierStep.UpdateTier && (
        <UpdateTeamTierForm
          previewData={previewData}
          tierMapping={tierMapping}
          priceKeysOptions={priceKeysOptions}
          handleSetNewSearch={handleSetNewSearch}
          onBack={onBack}
          handleApplyToAll={handleApplyToAll}
          handleSubmitApply={handleSubmitApply}
          isDisableUpdateButton={isDisableUpdateButton}
        />
      )}
    </FormProvider>
  )
}

export default UpdateTeamTier
