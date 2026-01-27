import { useAuth } from "@/services/auth"
import { useMutationIam } from "@/services/connect-rpc/transport.tsx"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { queryClient } from "@/services/react-query.ts"
import {
  staffActivateInternalStaff,
  staffDeactivateInternalStaff,
} from "@gearment/nextapi/api/iam/v1/staff_account-StaffAccountAPI_connectquery.ts"
import { staffListGMStaffInformation } from "@gearment/nextapi/api/iam/v1/staff_action-StaffActionAPI_connectquery"
import {
  StaffInfo_Short,
  StaffStatus,
} from "@gearment/nextapi/api/iam/v1/staff_action_pb.ts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  toast,
} from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"
import { EllipsisVerticalIcon } from "lucide-react"
import { useMemo, useState } from "react"

export default function CellActions(props: CellContext<StaffInfo_Short, any>) {
  const { user } = useAuth()
  const staffId = props.row.original.staffId
  const status = props.row.original.status
  const [setOpen, onClose] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])
  const [optionDropdown, setOptionDropdown] = useState<boolean>(false)

  const mutationActivate = useMutationIam(staffActivateInternalStaff, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          staffListGMStaffInformation.service.typeName,
          staffListGMStaffInformation.name,
        ],
      })
      toast({
        variant: "success",
        title: "Update request",
        description: "Activate this staff successfully",
      })
    },
  })
  const mutationDeactivate = useMutationIam(staffDeactivateInternalStaff, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          staffListGMStaffInformation.service.typeName,
          staffListGMStaffInformation.name,
        ],
      })
      toast({
        variant: "success",
        title: "Update request",
        description: "Activate this staff successfully",
      })
    },
  })
  const handleActivate = async () => {
    setOptionDropdown(false)
    setOpen({
      title: "Activate User",
      description: "Are you sure to activate this staff?",
      onConfirm: async () => {
        await mutationActivate.mutateAsync({
          staffIds: [staffId],
        })
        onClose()
      },
    })
  }
  const handleDeactivate = async () => {
    setOptionDropdown(false)
    setOpen({
      title: "Deactivate User",
      description: "Are you sure to deactivate this staff?",
      onConfirm: async () => {
        await mutationDeactivate.mutateAsync({
          staffIds: [staffId],
        })
        onClose()
      },
    })
  }

  const enableActivate = useMemo(() => {
    return status === StaffStatus.INACTIVE
  }, [status])

  const enableDeactivate = useMemo(() => {
    return status === StaffStatus.ACTIVE
  }, [status])

  const disableDeactivate = useMemo(() => {
    return user?.staffId === staffId
  }, [user?.staffId, staffId])

  return (
    <>
      <div className="flex items-center justify-end gap-3">
        <DropdownMenu open={optionDropdown} onOpenChange={setOptionDropdown}>
          <DropdownMenuTrigger>
            <EllipsisVerticalIcon size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {enableActivate && (
              <DropdownMenuItem onClick={handleActivate}>
                Activate
              </DropdownMenuItem>
            )}
            {enableDeactivate && (
              <DropdownMenuItem
                variant="destructive"
                onClick={handleDeactivate}
                disabled={disableDeactivate}
              >
                Deactivate
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
