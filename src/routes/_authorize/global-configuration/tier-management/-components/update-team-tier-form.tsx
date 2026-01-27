import { UpdateTeamTierSearchType } from "@/schemas/schemas/global-configuration"
import {
  StaffListProductPriceTierKeyResponse_Key,
  StaffPreviewTeamTierChangesResponse,
} from "@gearment/nextapi/api/pod/v1/product_admin_pb"
import {
  Badge,
  Button,
  ComboboxField,
  Form,
  Option,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gearment/ui3"
import { formatTextMany } from "@gearment/utils"
import { useSearch } from "@tanstack/react-router"
import { ArrowDown, ArrowUp, ChevronLeft, Users } from "lucide-react"
import { useMemo } from "react"
import { useFormContext } from "react-hook-form"

interface UpdateTeamTierFormProps {
  previewData?: StaffPreviewTeamTierChangesResponse
  tierMapping?: Record<string, StaffListProductPriceTierKeyResponse_Key>
  priceKeysOptions: Option[]
  handleSetNewSearch: (newSearch: UpdateTeamTierSearchType) => void
  onBack: () => void
  handleApplyToAll: () => void
  handleSubmitApply: () => void
  isDisableUpdateButton: boolean
}

const renderTierChangeBadge = (
  currentTierLevel: number,
  newTierLevel: number,
  isValid: boolean,
) => {
  switch (true) {
    case !isValid:
      return (
        <div className="flex items-center">
          <Badge variant="error">Invalid</Badge>
        </div>
      )

    case currentTierLevel === newTierLevel:
      return (
        <div className="flex items-center">
          <Badge variant="warning">Already assigned</Badge>
        </div>
      )

    case currentTierLevel < newTierLevel:
      return (
        <div className="flex items-center">
          <Badge variant="success">
            <div className="flex items-center gap-1">
              Upgrade
              <ArrowUp className="w-4 h-4" />
            </div>
          </Badge>
        </div>
      )

    default:
      return (
        <div className="flex items-center">
          <Badge variant="error">
            <div className="flex items-center gap-1">
              Downgrade
              <ArrowDown className="w-4 h-4" />
            </div>
          </Badge>
        </div>
      )
  }
}

export function UpdateTeamTierForm({
  previewData,
  tierMapping,
  priceKeysOptions,
  handleSetNewSearch,
  onBack,
  handleApplyToAll,
  handleSubmitApply,
  isDisableUpdateButton,
}: UpdateTeamTierFormProps) {
  const form = useFormContext<UpdateTeamTierSearchType>()
  const search = useSearch({
    from: "/_authorize/global-configuration/tier-management/update-team-tier",
  })
  const { watch } = form
  const { selectedTiers } = watch()

  const calculateTotalChanges = useMemo(() => {
    if (!previewData?.data) return 0

    return previewData.data.reduce((count, item) => {
      if (!item.isValid) return count

      const currentTierId = item.currentTierId
      const newTierId = selectedTiers[item.teamId] || item.newTierId

      return currentTierId !== newTierId ? count + 1 : count
    }, 0)
  }, [previewData?.data, selectedTiers])

  const handleTierChange = (teamId: string, value: string) => {
    if (value) {
      const newSelectedTiers = { ...selectedTiers, [teamId]: value }
      form.setValue("selectedTiers", newSelectedTiers)
      handleSetNewSearch({
        ...search,
        selectedTiers: newSelectedTiers,
      })
    }
  }

  const getNewTierLevel = (teamId: string, defaultLevel: number) => {
    const selectedTierId = selectedTiers[teamId]
    if (!selectedTierId || selectedTierId === "") return defaultLevel
    const selectedTier = tierMapping?.[selectedTierId]

    return selectedTier?.level || defaultLevel
  }

  return (
    <div className=" bg-background p-4">
      <div className="flex items-center gap-2 text-lg font-bold mb-4">
        <Users className="w-4 h-4" />
        Update Team Tier(s)
      </div>

      <section className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-100 rounded-lg p-4 font-bold text-center">
          <div className="space-y-2">
            <div className="text-lg">{previewData?.total.toString()}</div>
            <div className="font-medium text-muted-foreground">
              <span>Total Teams</span>
            </div>
          </div>
        </div>
        <div className="bg-green-100 rounded-lg p-4 font-bold text-center">
          <div className="space-y-2">
            <div className="text-lg">{calculateTotalChanges.toString()}</div>
            <div className="font-medium text-muted-foreground">
              <span>Will Changes</span>
            </div>
          </div>
        </div>
      </section>

      <Form {...form}>
        <div className="max-h-[52vh] overflow-y-auto relative  my-4">
          <table className=" overflow-y-auto table w-full caption-bottom text-sm relative">
            <TableHeader className="sticky top-0 z-[1] bg-background ">
              <TableRow className="h-12">
                <TableHead className="w-64 text-base font-semibold">
                  Team Email
                </TableHead>
                <TableHead className="w-32 text-base font-semibold">
                  Current Tier
                </TableHead>
                <TableHead className="w-48 text-base font-semibold">
                  New Tier
                </TableHead>
                <TableHead className="w-32 text-base font-semibold">
                  Change
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="static z-0">
              {previewData?.data.map((item) => (
                <TableRow key={item.teamId} id={item.teamId}>
                  <TableCell className="w-64">
                    <div>
                      <p className="font-medium">{item.teamEmail}</p>
                      <p className="text-gray-500">{item.teamName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="w-32">
                    <span
                      className="rounded-full px-2 py-1 font-bold"
                      style={{
                        color: tierMapping?.[item.currentTierId]?.color,
                        backgroundColor:
                          tierMapping?.[item.currentTierId]?.bgColor,
                      }}
                    >
                      {item.currentTierName}
                    </span>
                  </TableCell>
                  <TableCell className="w-40">
                    <ComboboxField
                      options={priceKeysOptions}
                      value={selectedTiers[item.teamId] || item.newTierId}
                      disabled={!item.isValid}
                      onChange={(value) => handleTierChange(item.teamId, value)}
                    />
                  </TableCell>
                  <TableCell className="w-48">
                    {renderTierChangeBadge(
                      item.currentTierLevel,
                      getNewTierLevel(item.teamId, item.newTierLevel),
                      item.isValid,
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              <ChevronLeft className="w-4 h-4" />
              Back to edit
            </Button>
            <Button variant="outline" onClick={handleApplyToAll}>
              Apply {tierMapping?.[search.newTier || ""]?.tierName} to All
            </Button>
          </div>
          <Button
            onClick={form.handleSubmit(handleSubmitApply)}
            type="submit"
            disabled={isDisableUpdateButton || calculateTotalChanges === 0}
          >
            Apply changes ({formatTextMany("team", calculateTotalChanges)} will
            be updated)
          </Button>
        </div>
      </Form>
    </div>
  )
}
