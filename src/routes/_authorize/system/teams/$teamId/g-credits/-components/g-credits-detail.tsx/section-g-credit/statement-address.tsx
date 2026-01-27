import { StatementAddressTypeLabel } from "@/constants/enum-label"
import {
  mappingColor,
  StatementAddressTypeColorsMapping,
} from "@/constants/map-color"
import {
  useMutationFinance,
  useQueryFinance,
} from "@/services/connect-rpc/transport"
import { CreditStatementAddressType } from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { queryClient } from "@/services/react-query"
import {
  staffGetCreditStatementAddress,
  staffUpdateCreditStatementAddress,
} from "@gearment/nextapi/api/credit/v1/credit_admin-CreditAdminAPI_connectquery"
import {
  Badge,
  BoxEmpty,
  Button,
  LoadingCircle,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { useParams } from "@tanstack/react-router"
import { Info, ReceiptText } from "lucide-react"
export default function StatementAddress() {
  const { teamId } = useParams({
    from: "/_authorize/system/teams/$teamId/g-credits/",
  })

  const { data, isLoading } = useQueryFinance(
    staffGetCreditStatementAddress,
    {
      teamId: teamId,
    },
    {
      select: (response) => ({
        ...response.data,
        hasInvoice: response.hasInvoice,
        hasLegal: response.hasLegal,
      }),
    },
  )

  const [setOpenConfirm, closeConfirm] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const mutationSwitchSource = useMutationFinance(
    staffUpdateCreditStatementAddress,
    {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Switch source successfully",
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffGetCreditStatementAddress.service.typeName,
            staffGetCreditStatementAddress.name,
          ],
        })
        closeConfirm()
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Switch source failed",
          description: error.rawMessage,
        })
      },
    },
  )

  const handleSwitchSource = () => {
    const currentAddressType = data?.addressType

    const isInvoice = currentAddressType === CreditStatementAddressType.INVOICE
    const isLegal = currentAddressType === CreditStatementAddressType.LEGAL

    if (!isInvoice && !isLegal) {
      return
    }

    const nextAddressType = isInvoice
      ? CreditStatementAddressType.LEGAL
      : CreditStatementAddressType.INVOICE
    const updatedAddressTypeLabel = isInvoice
      ? "legal information"
      : "invoice information"

    setOpenConfirm({
      title: "Switch Source",
      description: (
        <p>
          Are you sure you want to switch source to{" "}
          <b>{updatedAddressTypeLabel}</b>?
        </p>
      ),
      onConfirm: async () => {
        await mutationSwitchSource.mutateAsync({
          teamId: teamId,
          addressType: nextAddressType,
        })
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingCircle size={"lg"} />
      </div>
    )
  }

  if (!data) {
    return <BoxEmpty description="No data available" />
  }

  return (
    <div className="border rounded-lg bg-secondary/10">
      <div className="p-4 space-y-4">
        <div className="w-full flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-muted-foreground" />
            <span className="text-lg font-semibold">Billing Address</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                This billing address will be used for statement generation.
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-1">
              {!(data.hasInvoice && data.hasLegal) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {!data.hasInvoice &&
                      "Cannot switch source to invoice information because you have only legal information."}
                    {!data.hasLegal &&
                      "Cannot switch source to legal information because you have only invoice information."}
                  </TooltipContent>
                </Tooltip>
              )}
              <Button
                onClick={handleSwitchSource}
                disabled={
                  !(data.hasInvoice && data.hasLegal) ||
                  mutationSwitchSource.isPending
                }
                size="sm"
                variant="outline"
                className="cursor-pointer"
                loading={mutationSwitchSource.isPending}
              >
                Switch Source
              </Button>
            </div>
            <Badge
              variant={mappingColor(
                StatementAddressTypeColorsMapping,
                data.addressType,
              )}
            >
              Currently using:{" "}
              {
                StatementAddressTypeLabel[
                  data.addressType ?? CreditStatementAddressType.UNKNOWN
                ]
              }{" "}
              Information
            </Badge>
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-semibold">{data.businessName}</p>
          <p className="text-muted-foreground font-semibold">
            {data.firstName} {data.lastName}
          </p>
          <div className="text-muted-foreground space-y-1 mt-2">
            {data.street1 && <p>{data.street1}</p>}
            {data.street2 && <p>{data.street2}</p>}
            <p>
              {data.city}, {data.state} {data.zipcode}
            </p>
            <p>{data.country}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-border" />

      <div className="p-4 flex flex-wrap items-center gap-2 text-sm">
        {data.email && (
          <a
            href={`mailto:${data.email}`}
            className="text-primary hover:underline break-all"
          >
            {data.email}
          </a>
        )}
        {data.email && data.phone && (
          <div className="border-r border-border h-4" />
        )}
        {data.phone && <p>{data.phone}</p>}
      </div>
    </div>
  )
}
