import { useQueryFinance } from "@/services/connect-rpc/transport"
import { DepositRequest_Short } from "@/services/connect-rpc/types"
import { capitalizeFirstLetter } from "@/utils/format-string"
import { staffListRejectReasonDepositRequest } from "@gearment/nextapi/api/wallet/v1/wallet_admin-WalletAdminAPI_connectquery"
import {
  Button,
  ComboboxField,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  TextareaField,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

interface ModalRejectProps {
  open: boolean
  onClose: () => void
  onConfirm: (
    rejectReasonId: string,
    reason: string,
    customReason?: string,
  ) => void
  transactionId: DepositRequest_Short["txnId"]
}

const createRejectSchema = (otherOptionValue: string) =>
  z
    .object({
      reason: z
        .string({
          required_error:
            "Please provide a valid reason (minimum 5 characters) to proceed with the rejection",
        })
        .min(1)
        .max(255),
      customReason: z.string().min(5).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.reason === otherOptionValue && !data.customReason) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Please provide a valid reason (minimum 5 characters) to proceed with the rejection",
          path: ["customReason"],
        })
      }
    })

type RejectFormType = z.infer<ReturnType<typeof createRejectSchema>>

export default function ModalReject({
  open,
  onClose,
  onConfirm,
  transactionId,
}: ModalRejectProps) {
  const [otherOptionValue, setOtherOptionValue] = useState("")

  const rejectSchema = useMemo(
    () => createRejectSchema(otherOptionValue),
    [otherOptionValue],
  )

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<RejectFormType>({
    resolver: zodResolver(rejectSchema),
  })

  const { data: rejectReasons } = useQueryFinance(
    staffListRejectReasonDepositRequest,
    {},
    {
      select: (data) => data.data,
    },
  )

  const rejectReasonOptions = useMemo(() => {
    return (rejectReasons || []).map((rejectReason) => {
      if (rejectReason.isCustom) {
        setOtherOptionValue(rejectReason.rejectReasonId)
      }
      return {
        label: capitalizeFirstLetter(rejectReason.reason),
        value: rejectReason.rejectReasonId,
      }
    })
  }, [rejectReasons])

  const selectedReason = watch("reason")

  const onSubmit = (data: RejectFormType) => {
    const rejectReasonId = data.reason
    const selectedOption = rejectReasonOptions.find(
      (option) => option.value === rejectReasonId,
    )
    let reasonText = selectedOption?.label || ""
    if (otherOptionValue === rejectReasonId) {
      reasonText = data.customReason || ""
    }
    onConfirm(reasonText, rejectReasonId)
    reset()
  }

  const handleCloseModal = () => {
    reset()
    onClose()
  }
  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogTitle className="pb-[18px]">Reject Deposit Request</DialogTitle>
        <p className="mb-4">
          Are you sure to reject the request{" "}
          <span className="font-semibold">#{transactionId}</span>?
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={control}
            name="reason"
            render={({ field }) => {
              return (
                <ComboboxField
                  options={rejectReasonOptions}
                  placeholder="Select reason"
                  {...field}
                  error={errors.reason?.message}
                  modal
                />
              )
            }}
          />
          {selectedReason === otherOptionValue && (
            <Controller
              control={control}
              name="customReason"
              render={({ field }) => {
                return (
                  <TextareaField
                    placeholder="Enter comment for rejection"
                    {...field}
                    error={errors.customReason?.message}
                  />
                )
              }}
            />
          )}
          <DialogFooter className="flex justify-end gap-2">
            <Button onClick={handleCloseModal} variant={"outline"}>
              Cancel
            </Button>
            <Button variant={"destructive"} type="submit">
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
