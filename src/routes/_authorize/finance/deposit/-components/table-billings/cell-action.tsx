import { useMutationFinance } from "@/services/connect-rpc/transport.tsx"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { queryClient } from "@/services/react-query.ts"
import {
  staffApproveDepositRequest,
  staffListDepositRequest,
  staffRejectDepositRequest,
} from "@gearment/nextapi/api/wallet/v1/wallet_admin-WalletAdminAPI_connectquery.ts"
import {
  DepositRequestStatus,
  DepositRequest_Short,
} from "@gearment/nextapi/api/wallet/v1/wallet_pb.ts"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
  toast,
} from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"
import { EllipsisVerticalIcon } from "lucide-react"
import { useState } from "react"
import ModalReject from "./modal-reject"

export default function CellAction(
  props: CellContext<DepositRequest_Short, any>,
) {
  const [openDropdown, setOpenDropdown] = useState(false)
  const requestID = props.row.original.requestId
  const transactionId = props.row.original.txnId
  const status = props.row.original.status
  const [reasonModalOpen, setReasonModalOpen] = useState(false)
  const [setOpen, onClose] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const mutation = useMutationFinance(staffApproveDepositRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          staffListDepositRequest.service.typeName,
          staffListDepositRequest.name,
        ],
      })
      toast({
        title: "Approve request",
        description: "Approve this request successfully",
      })
    },
    onError: (error) => {
      toast({
        variant: "error",
        title: "Approve request",
        description: error.rawMessage,
      })
    },
    onSettled: () => {
      onClose()
    },
  })

  const handleApprove = async () => {
    setOpenDropdown(false)
    setOpen({
      title: "Confirm Approval",
      description: (
        <>
          Are you sure to approve the request{" "}
          <span className="font-semibold">#{transactionId}</span>?
        </>
      ),
      onConfirm: async () => {
        await mutation.mutateAsync({
          depositId: requestID,
        })
        onClose()
      },
    })
  }

  const mutationReject = useMutationFinance(staffRejectDepositRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          staffListDepositRequest.service.typeName,
          staffListDepositRequest.name,
        ],
      })
      toast({
        title: "Update request",
        description: "Reject this request successfully",
      })
      onClose()
      setReasonModalOpen(false)
    },
  })

  const handleReject = async () => {
    setOpenDropdown(false)
    setReasonModalOpen(true)
  }

  const handleConfirmReject = async (
    reason: string,
    rejectReasonId: string,
  ) => {
    await mutationReject.mutateAsync({
      requestId: requestID,
      reason: reason,
      rejectReasonId: rejectReasonId,
    })
  }

  return (
    <div className="flex gap-3 justify-end ">
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={"sm"}>
            <EllipsisVerticalIcon size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={handleApprove}
            disabled={status !== DepositRequestStatus.REQUESTED}
          >
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleReject}
            className={cn("text-red")}
            disabled={status !== DepositRequestStatus.REQUESTED}
          >
            Reject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalReject
        open={reasonModalOpen}
        onClose={() => setReasonModalOpen(false)}
        onConfirm={handleConfirmReject}
        transactionId={transactionId}
      />
    </div>
  )
}
