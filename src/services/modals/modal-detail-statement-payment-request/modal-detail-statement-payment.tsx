import { DateTime } from "@/components/common/date-time"
import {
  mappingColor,
  StatementPaymentRequestStatusColorsMapping,
} from "@/constants/map-color"
import {
  COMMON_FORMAT_DATETIME_CREDIT,
  StatementPaymentRequestStatusLabel,
} from "@/constants/payment"
import {
  useMutationFinance,
  useQueryFinance,
} from "@/services/connect-rpc/transport"
import {
  CreditStatementPaymentRequestStatus,
  Money,
} from "@/services/connect-rpc/types"
import { queryClient } from "@/services/react-query"
import { formatPrice } from "@/utils/format-currency"
import {
  staffApproveCreditStatement,
  staffCountStatementPaymentRequestStatus,
  staffDownloadCreditAttachment,
  staffGetStatementPaymentRequest,
  staffListStatementPaymentRequest,
} from "@gearment/nextapi/api/credit/v1/credit_admin-CreditAdminAPI_connectquery"
import {
  Badge,
  Button,
  ButtonIconCopy,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  toast,
} from "@gearment/ui3"
import { formatShortenText } from "@gearment/utils"
import { File } from "lucide-react"
import { usePaymentStatementDetailModal } from "./modal-detail-statement-request"

export function ModalDetailStatementPaymentRequest() {
  const { open, onClose, requestId, onConfirm } =
    usePaymentStatementDetailModal()

  const handleClose = () => {
    onClose()
  }

  const { data: request } = useQueryFinance(
    staffGetStatementPaymentRequest,
    {
      requestId,
    },
    {
      select: (data) => data.data,
      enabled: open,
    },
  )

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

  const handleConfirm = async () => {
    await mutation.mutateAsync({
      creditStatementPaymentRequestId: requestId,
      amountReceived: request?.requestAmount,
      statementId: request?.statementId,
      methodCode: request?.methodCode,
    })
    await onConfirm()
  }

  const renderRow = (label: string, value?: React.ReactNode) => (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-sm break-all">{value ?? "--"}</div>
    </div>
  )

  const mutationDownloadFile = useMutationFinance(
    staffDownloadCreditAttachment,
    {
      onSuccess: (res) => {
        window.open(res.mediaUrl, "_blank")
        toast({
          variant: "success",
          title: "Download successful",
          description: "The file has been downloaded successfully.",
        })
      },
      onError: () => {
        toast({
          variant: "error",
          title: "Download failed",
        })
      },
    },
  )

  const handleDownload = async (mediaId: string) => {
    await mutationDownloadFile.mutateAsync({
      mediaId: mediaId,
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              Statement payment request details
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderRow(
              "Request ID",
              <span className="flex items-center gap-2">
                {formatShortenText(request?.requestId || "", 4, 8)}
                <ButtonIconCopy
                  size={"sm"}
                  copyValue={request?.requestId || ""}
                  className="ml-2"
                />
              </span>,
            )}
            {renderRow(
              "Status",
              <Badge
                variant={mappingColor(
                  StatementPaymentRequestStatusColorsMapping,
                  request?.status,
                )}
              >
                {
                  StatementPaymentRequestStatusLabel[
                    request?.status ??
                      CreditStatementPaymentRequestStatus.UNKNOWN
                  ]
                }
              </Badge>,
            )}

            {renderRow("Team name", request?.teamName)}
            {renderRow(
              "Billing period",
              <p className="text-sm font-medium">
                <DateTime
                  date={request?.statementStartDate?.toDate()}
                  format={COMMON_FORMAT_DATETIME_CREDIT}
                />
                -
                <DateTime
                  date={request?.statementEndDate?.toDate()}
                  format={COMMON_FORMAT_DATETIME_CREDIT}
                />
              </p>,
            )}

            {renderRow(
              "Statement date",
              <DateTime
                date={request?.statementEndDate?.toDate()}
                format={COMMON_FORMAT_DATETIME_CREDIT}
              />,
            )}
            {renderRow(
              "Due date",
              <DateTime
                date={request?.dueDate?.toDate()}
                format={COMMON_FORMAT_DATETIME_CREDIT}
              />,
            )}

            {renderRow(
              "Statement amount",
              <Badge variant="default" className="capitalize">
                {request?.statementAmount
                  ? formatPrice(request.statementAmount)
                  : "--"}
              </Badge>,
            )}
            {renderRow(
              "Amount requested",
              <Badge
                variant={mappingColor(
                  StatementPaymentRequestStatusColorsMapping,
                  request?.status,
                )}
              >
                {request?.requestAmount
                  ? formatPrice(request.requestAmount)
                  : "--"}
              </Badge>,
            )}

            {renderRow(
              "Remaining amount",
              <Badge variant="default">
                {request?.remainingAmount
                  ? formatPrice(request?.remainingAmount)
                  : "--"}
              </Badge>,
            )}

            {renderRow(
              "Paid before amount",
              <Badge variant="default">
                {request?.paidBeforeAmount
                  ? formatPrice(request?.paidBeforeAmount)
                  : "--"}
              </Badge>,
            )}

            {renderRow(
              "Overpaid amount",
              <Badge variant="default">
                {formatPrice(
                  request?.overpaidAmount || new Money({ units: 0n, nanos: 0 }),
                )}
              </Badge>,
            )}

            {renderRow(
              "Payment method",
              <div className="flex items-center">
                {request?.methodIconUrls && (
                  <img
                    src={request.methodIconUrls}
                    alt="Payment method"
                    className="h-6 mr-2"
                  />
                )}
              </div>,
            )}
            {renderRow("Requested By", request?.requestedBy || undefined)}

            {renderRow(
              "Requested at",
              <DateTime
                date={request?.requestedAt?.toDate()}
                format={COMMON_FORMAT_DATETIME_CREDIT}
              />,
            )}

            {renderRow("Ref ID", request?.txnRef || undefined)}
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-sm text-muted-foreground">File attachments</p>
            <div className="space-y-1">
              {request?.files?.length ? (
                request.files.map((f) => (
                  <Button
                    onClick={() => handleDownload(f.fileId)}
                    className="cursor-pointer"
                    variant="link"
                    key={f.fileId}
                  >
                    <File className="w-4 h-4" />
                    {f.fileName || "attachment"}
                  </Button>
                ))
              ) : (
                <span className="text-sm">--</span>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            {request?.status ===
              CreditStatementPaymentRequestStatus.REQUESTED && (
              <Button
                loading={mutation.isPending}
                disabled={mutation.isPending}
                variant="default"
                onClick={handleConfirm}
              >
                Approve
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
