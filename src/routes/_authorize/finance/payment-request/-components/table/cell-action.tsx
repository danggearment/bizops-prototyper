import { useMutationFinance } from "@/services/connect-rpc/transport"
import {
  Credit_StatementPaymentRequest_Admin,
  CreditStatementPaymentRequestStatus,
} from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { useRejectReasonStatementModal } from "@/services/modals/modal-reason-reject-statement"
import { queryClient } from "@/services/react-query"
import {
  staffApproveCreditStatement,
  staffCountStatementPaymentRequestStatus,
  staffListStatementPaymentRequest,
  staffRejectCreditStatementPaymentRequest,
} from "@gearment/nextapi/api/credit/v1/credit_admin-CreditAdminAPI_connectquery"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  toast,
} from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"
import { EllipsisVerticalIcon } from "lucide-react"
import { useState } from "react"

export default function CellAction(
  props: CellContext<Credit_StatementPaymentRequest_Admin, any>,
) {
  const [openDropdown, setOpenDropdown] = useState(false)
  const [setOpen, onClose] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const {
    setOpen: openRejectReasonStatementModal,
    onClose: onCloseRejectReasonStatementModal,
  } = useRejectReasonStatementModal()

  const mutation = useMutationFinance(staffApproveCreditStatement, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          staffListStatementPaymentRequest.service.typeName,
          staffListStatementPaymentRequest.name,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          staffCountStatementPaymentRequestStatus.service.typeName,
          staffCountStatementPaymentRequestStatus.name,
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
  })

  const mutationReject = useMutationFinance(
    staffRejectCreditStatementPaymentRequest,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            staffListStatementPaymentRequest.service.typeName,
            staffListStatementPaymentRequest.name,
          ],
        })
        toast({
          title: "Reject request",
          description: "Reject this request successfully",
        })
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Reject request",
          description: error.rawMessage,
        })
      },
    },
  )

  const handleReject = () => {
    setOpenDropdown(false)
    openRejectReasonStatementModal({
      onConfirm: async (values) => {
        if (!props.row.original.requestId) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Request ID not found",
          })
          return
        }
        await mutationReject.mutateAsync({
          requestId: props.row.original.requestId || "",
          reasonId: values.reasonId,
          reason: values.customReason,
        })
        onCloseRejectReasonStatementModal()
      },
    })
  }

  const handleApprove = () => {
    setOpenDropdown(false)
    setOpen({
      title: "Confirm Approval",
      description: (
        <>
          Are you sure to approve the request{" "}
          <span className="font-semibold">#{props.row.original.requestId}</span>
          ?
        </>
      ),
      onConfirm: async () => {
        await mutation.mutateAsync({
          amountReceived: props.row.original.requestAmount,
          creditStatementPaymentRequestId: props.row.original.requestId,
          statementId: props.row.original.statementId,
          methodCode: props.row.original.methodCode,
        })
        onClose()
      },
    })
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button className="cursor-pointer" variant="ghost" size={"sm"}>
            <EllipsisVerticalIcon size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={handleApprove}
            disabled={
              props.row.original.status !==
              CreditStatementPaymentRequestStatus.REQUESTED
            }
          >
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleReject}
            disabled={
              props.row.original.status !==
              CreditStatementPaymentRequestStatus.REQUESTED
            }
          >
            Reject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
