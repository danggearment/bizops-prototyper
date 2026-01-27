import { useMutationPod } from "@/services/connect-rpc/transport"
import {
  GMTeamPriceCustomStatus,
  StaffListPriceCustomRuleResponse_PriceCustomRule,
} from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { queryClient } from "@/services/react-query"
import {
  staffCountPriceCustomRuleStatus,
  staffListPriceCustomRule,
  staffUpdatePriceCustomStatus,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  toast,
} from "@gearment/ui3"
import { useNavigate } from "@tanstack/react-router"
import { CellContext } from "@tanstack/react-table"
import {
  CircleCheck,
  CircleX,
  MoreHorizontal,
  PenLineIcon,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { PricingRuleDetailMode } from "../../-helper"

export default function CellActions(
  props: CellContext<StaffListPriceCustomRuleResponse_PriceCustomRule, unknown>,
) {
  const { customId, status } = props.row.original
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [setOpenConfirm, closeConfirm] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])
  const navigate = useNavigate()

  const mutationUpdateStatus = useMutationPod(staffUpdatePriceCustomStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          staffListPriceCustomRule.service.typeName,
          staffListPriceCustomRule.name,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          staffCountPriceCustomRuleStatus.service.typeName,
          staffCountPriceCustomRuleStatus.name,
        ],
      })
      closeConfirm()
    },
    onError: (error) => {
      toast({
        variant: "error",
        title: "Update pricing rule status",
        description: error.rawMessage,
      })
    },
  })

  const handleDelete = () => {
    setDropdownOpen(false)
    setOpenConfirm({
      title: "Confirm delete pricing rule",
      description:
        "Deleting this rule will remove it permanently. Orders not yet checked out will be updated back to original tier pricing.",
      onConfirm: async () => {
        await mutationUpdateStatus.mutateAsync({
          customIds: [customId],
          updateStatus:
            GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_DELETED,
        })
      },
    })
  }

  const handleDeactivate = () => {
    setDropdownOpen(false)
    setOpenConfirm({
      title: "Confirm deactivate pricing rule",
      description:
        "This rule will no longer be applied to new orders. Existing orders remain unchanged.",
      onConfirm: async () => {
        await mutationUpdateStatus.mutateAsync({
          customIds: [customId],
          updateStatus:
            GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_INACTIVE,
        })
      },
    })
  }

  const handleActivate = () => {
    setDropdownOpen(false)
    setOpenConfirm({
      title: "Confirm activate pricing rule",
      description: "Are you sure you want to activate this pricing rule?",
      onConfirm: async () => {
        await mutationUpdateStatus.mutateAsync({
          customIds: [customId],
          updateStatus:
            GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_ACTIVE,
        })
      },
    })
  }

  const isActive =
    status === GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_ACTIVE ||
    status === GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_PENDING
  const isInactive =
    status === GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_INACTIVE
  const isDeleted =
    status === GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_DELETED

  const handleEdit = () => {
    setDropdownOpen(false)
    navigate({
      to: "/global-configuration/pricing-management/$customId",
      params: { customId },
      search: { mode: PricingRuleDetailMode.UPDATE },
    })
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <PenLineIcon className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>

          {isActive && (
            <DropdownMenuItem
              onClick={handleDeactivate}
              className="text-yellow-500 focus:text-yellow-500"
            >
              <CircleX className="mr-2 size-4 text-yellow-500" />
              Deactivate
            </DropdownMenuItem>
          )}

          {isInactive && (
            <DropdownMenuItem
              onClick={handleActivate}
              className="text-green-500 focus:text-green-500"
            >
              <CircleCheck className="mr-2 size-4 text-green-500" />
              Activate
            </DropdownMenuItem>
          )}

          {!isDeleted && (
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive border-t border-stroke"
            >
              <Trash2 className="mr-2 size-4 text-destructive" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
