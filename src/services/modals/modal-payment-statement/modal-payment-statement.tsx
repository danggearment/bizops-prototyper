import {
  AllTransactionType,
  COMMON_FORMAT_DATETIME_CREDIT,
  G_CREDIT_METHOD_CODE,
  StatementPaymentLabel,
} from "@/constants/payment"
import {
  ApproveCreditStatementSchema,
  ApproveCreditStatementType,
} from "@/schemas/schemas/payment"
import {
  useMutationFinance,
  useMutationStudio,
  useQueryFinance,
} from "@/services/connect-rpc/transport"
import {
  Credit_Attachment,
  CreditStatementPaymentStatus,
  CreditStatementStatus,
  MediaType,
  Money,
} from "@/services/connect-rpc/types"
import { FileType, staffFormatUploadData } from "@/utils"
import { formatPrice, getPrice } from "@/utils/format-currency"
import { formatDateString } from "@/utils/format-date"
import {
  staffApproveCreditStatement,
  staffGetCreditOverview,
  staffGetCreditStatement,
  staffGetGCreditDashboard,
  staffListStatementHistory,
  staffRejectCreditStatementPaymentRequest,
} from "@gearment/nextapi/api/credit/v1/credit_admin-CreditAdminAPI_connectquery"
import {
  staffListPaymentMethod,
  staffListTransaction,
} from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import {
  staffDeleteTeamMedias,
  staffDownloadTeamMedia,
  staffUploadTeamDocument,
  staffUploadTeamMedia,
} from "@gearment/nextapi/api/studio/v1/media_admin-MediaAdminManagement_connectquery"
import {
  Alert,
  AlertDescription,
  Badge,
  BoxEmpty,
  Button,
  ComboboxField,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputMaskField,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import {
  formatShortenText,
  getDecimalPart,
  getNumberFromInputMask,
} from "@gearment/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  BadgeDollarSign,
  Building2,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  ExternalLinkIcon,
  Eye,
  File,
  FileText,
  FileTextIcon,
  ImageIcon,
  Info,
  TriangleAlert,
  UploadIcon,
} from "lucide-react"
import { useEffect, useId, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { usePaymentStatementModal } from "./modal-payment-statement-store"

import FileUploader from "@/components/common/file-uploader/file-uploader"
import Image from "@/components/common/image/image"
import { ACCEPT_FILE_IMAGE_PDF } from "@/constants/accept-file"
import {
  CreditStatementPaymentStatusColorsMapping,
  mappingColor,
  TeamTransactionTypeColorMapping,
} from "@/constants/map-color"
import type { TransactionListFilter } from "@/services/modals/modal-transaction-list"
import { useModalTransactionListStore } from "@/services/modals/modal-transaction-list"
import { queryClient } from "@/services/react-query"
import { MyUppyFile, uploader } from "@/services/uploader/uppy"
import { File as ProtoFile } from "@gearment/nextapi/common/type/v1/file_pb"
import { useNotificationModal } from "../modal-notification"
import { useRejectReasonStatementModal } from "../modal-reason-reject-statement"

const createMoneyAmount = (amountString: string): Money => {
  const amountNumber = getNumberFromInputMask(amountString)
  return new Money({
    units: BigInt(Math.floor(amountNumber)),
    nanos: getDecimalPart(amountNumber),
  })
}

export function ModalPaymentStatement() {
  const { open, onClose, statementId, onConfirm, viewOnly } =
    usePaymentStatementModal()
  const [files, setFiles] = useState<MyUppyFile[] | undefined>()
  const uppyId = useId()
  const uppy = useMemo(() => uploader.getOrCreateUppy(uppyId), [uppyId])
  const mediaIds = useRef<string[]>([])
  const { actions: modalTransactionActions } = useModalTransactionListStore()
  const { setOpen: openNotificationModal, onClose: onCloseNotificationModal } =
    useNotificationModal()
  const {
    setOpen: openRejectReasonStatementModal,
    onClose: onCloseRejectReasonStatementModal,
  } = useRejectReasonStatementModal()
  const mutation = useMutationFinance(staffApproveCreditStatement, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          staffListStatementHistory.service.typeName,
          staffListStatementHistory.name,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          staffGetCreditStatement.service.typeName,
          staffGetCreditStatement.name,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          staffGetCreditOverview.service.typeName,
          staffGetCreditOverview.name,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          staffGetGCreditDashboard.service.typeName,
          staffGetGCreditDashboard.name,
        ],
      })
      toast({
        title: "Approve statement",
        description: "Approve this statement successfully",
      })
    },
    onError: (error) => {
      toast({
        variant: "error",
        title: "Approve statement",
        description: error.rawMessage,
      })
    },
  })
  const { data } = useQueryFinance(
    staffGetCreditStatement,
    {
      statementId,
    },
    {
      select: (data) => data.data,
      enabled: !!statementId && open,
    },
  )
  const isPaid =
    data?.statement?.paymentStatus === CreditStatementPaymentStatus.PAID ||
    viewOnly

  const isRequestPayment = !!data?.statementPaymentRequest
  const { data: listPaymentMethod } = useQueryFinance(
    staffListPaymentMethod,
    {
      isCreditStatementAllowed: true,
    },
    {
      select: (response) => response.data || [],
      enabled: open,
    },
  )

  const uploadTeamMediaMutation = useMutationStudio(staffUploadTeamMedia, {
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.rawMessage,
      })
    },
  })
  const mutationDeleteTeamMedias = useMutationStudio(staffDeleteTeamMedias)

  const uploadTeamDocumentMutation = useMutationStudio(
    staffUploadTeamDocument,
    {
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: error.rawMessage,
        })
      },
    },
  )

  const form = useForm<ApproveCreditStatementType>({
    resolver: zodResolver(ApproveCreditStatementSchema),
    mode: "onChange",
    defaultValues: {
      statementId: statementId || "",
      amountReceived: formatPrice(
        isRequestPayment
          ? data?.statementPaymentRequest?.amount
          : data?.statement?.remainingAmount,
      ),
      methodCode: "",
      files: [],
    },
  })

  const listPaymentMethodOptions = useMemo(() => {
    if (!listPaymentMethod) {
      return []
    }
    return listPaymentMethod.map((method) => ({
      label: method.name,
      value: method.methodCode,
    }))
  }, [listPaymentMethod])

  useEffect(() => {
    if (open && statementId) {
      form.reset({
        statementId: statementId,
        amountReceived: formatPrice(
          isRequestPayment
            ? data?.statementPaymentRequest?.amount
            : data?.statement?.remainingAmount,
        ),
        methodCode: isRequestPayment
          ? data?.statementPaymentRequest?.methodCode
          : "",
        files: [],
        creditStatementPaymentRequestId: isRequestPayment
          ? data?.statementPaymentRequest?.requestId
          : undefined,
      })
      form.clearErrors()
      setFiles(undefined)
    }
  }, [open, statementId, form, data, isRequestPayment])

  const isContinuePayment =
    data?.statement?.paymentStatus === CreditStatementPaymentStatus.PARTIAL_PAID

  const mutationRejectStatement = useMutationFinance(
    staffRejectCreditStatementPaymentRequest,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            staffListStatementHistory.service.typeName,
            staffListStatementHistory.name,
          ],
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffGetCreditStatement.service.typeName,
            staffGetCreditStatement.name,
          ],
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffGetCreditOverview.service.typeName,
            staffGetCreditOverview.name,
          ],
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffGetGCreditDashboard.service.typeName,
            staffGetGCreditDashboard.name,
          ],
        })
        toast({
          title: "Reject statement",
          description: "Reject this statement successfully",
        })
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Reject statement",
          description: error.rawMessage,
        })
      },
    },
  )
  const handleOpenRejectReasonStatementModal = () => {
    openRejectReasonStatementModal({
      onConfirm: async (values) => {
        if (!data?.statementPaymentRequest?.requestId) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Request ID not found",
          })
          return
        }
        await mutationRejectStatement.mutateAsync({
          requestId: data?.statementPaymentRequest?.requestId || "",
          reasonId: values.reasonId,
          reason: values.customReason,
        })
        onCloseRejectReasonStatementModal()
      },
    })
  }

  const handleClose = () => {
    form.reset({
      statementId: "",
      amountReceived: "",
      methodCode: "",
      files: [],
    })
    form.clearErrors()
    setFiles(undefined)
    onCloseRejectReasonStatementModal()
    onClose()
  }

  const handleUploadFilesToCloud = async (): Promise<ProtoFile[]> => {
    const formFiles: ProtoFile[] = []
    mediaIds.current = []
    const uppyFiles = uppy.getFiles()

    if (!uppyFiles?.length) return formFiles

    const uploadPromises = uppyFiles.map(async (file) => {
      const fileType: FileType =
        file.type === "application/pdf" ? "document" : "media"
      const uploadData = staffFormatUploadData(
        file,
        "payment",
        fileType,
        data?.teamId || "",
      )

      try {
        let protoFile: ProtoFile | null = null
        let mediaId: string | null = null
        let uploadUrl: string
        let method: string

        if (fileType === "media") {
          const response = await uploadTeamMediaMutation.mutateAsync(uploadData)
          uploadUrl = response.uploadUrl
          method = response.method || "POST"

          if (response.mediaFile) {
            protoFile = response.mediaFile
            mediaId = response.mediaId
          }
        } else {
          const response =
            await uploadTeamDocumentMutation.mutateAsync(uploadData)
          uploadUrl = response.uploadUrl
          method = response.method || "POST"

          if (response.documentFile) {
            protoFile = response.documentFile
            mediaId = response.documentUrl
          }
        }

        if (protoFile && mediaId) {
          formFiles.push(protoFile)
          mediaIds.current.push(mediaId)
        }

        uppy.setFileState(file.id, {
          xhrUpload: {
            method,
            endpoint: uploadUrl,
            formData: false,
          },
        })

        return { success: true, file: file.name }
      } catch (error) {
        console.error(`Failed to prepare upload for file ${file.name}:`, error)
        throw new Error(`Failed to prepare upload for file ${file.name}`)
      }
    })

    try {
      await Promise.all(uploadPromises)
      return formFiles
    } catch (error) {
      throw new Error("Failed to prepare file uploads")
    }
  }

  const handleSubmit = async (values: ApproveCreditStatementType) => {
    try {
      let uploadedFiles: ProtoFile[] = []

      if (files?.length) {
        toast({
          title: "Uploading files...",
          description: "Please wait while we upload your files.",
        })

        try {
          uploadedFiles = await handleUploadFilesToCloud()
          await uppy.upload()
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: "Failed to upload files. Please try again.",
          })
          return
        }
      }

      try {
        await mutation.mutateAsync({
          statementId: values.statementId,
          amountReceived: createMoneyAmount(values.amountReceived),
          methodCode: values.methodCode,
          files: uploadedFiles,
          creditStatementPaymentRequestId:
            values.creditStatementPaymentRequestId,
        })

        toast({
          title: "Success",
          description: isContinuePayment
            ? "Payment has been continued successfully"
            : "Payment has been approved successfully",
        })

        await onConfirm("")
        handleClose()
      } catch (error) {
        if (mediaIds.current.length > 0) {
          try {
            await mutationDeleteTeamMedias.mutateAsync({
              mediaIds: mediaIds.current,
              teamId: data?.teamId || "",
            })
          } catch (deleteError) {
            console.error("Failed to delete uploaded files:", deleteError)
          }
        }

        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to process payment. Please try again.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment. Please try again.",
      })
    }
  }

  const LimitTransaction = 3
  const { data: listTransaction } = useQueryFinance(
    staffListTransaction,
    {
      filter: {
        teamId: [data?.teamId || ""],
        from: data?.billingCycle?.statementStartDate,
        to: data?.billingCycle?.statementEndDate,
        methodCode: [G_CREDIT_METHOD_CODE],
      },
      page: 1,
      limit: LimitTransaction,
    },
    {
      select: (data) => data,
    },
  )

  const handleViewImage = (file: Credit_Attachment) => {
    openNotificationModal({
      title: "",
      OK: "Close",
      description: (
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <div key={file.fileUrl} className="mx-auto">
            <Image responsive="h" url={file.fileUrl} />
          </div>
        </div>
      ),
      onConfirm: () => {
        onCloseNotificationModal()
      },
    })
  }

  const mutationDownloadFile = useMutationStudio(staffDownloadTeamMedia, {
    onSuccess: (res) => {
      window.open(res.mediaUrl, "_blank")
      toast({
        variant: "success",
        title: "Download import order failed",
        description: `Download import order failed successfully`,
      })
    },
    onError: () => {
      toast({
        variant: "error",
        title: "Download import order failed",
      })
    },
  })

  const handleDownload = async (key: string) => {
    await mutationDownloadFile.mutateAsync({
      mediaKey: key,
    })
  }

  const handleDeleteFiles = () => {
    form.setValue("files", [])
    setFiles(undefined)
    form.trigger("files")
  }

  // Update form field when files change
  useEffect(() => {
    if (files && files.length > 0) {
      form.setValue(
        "files",
        files.map(() => "uploaded"),
      )
      form.trigger("files")
    } else {
      form.setValue("files", [])
      form.trigger("files")
    }
  }, [files, form])

  const handleOpenModal = () => {
    const filter: TransactionListFilter = {
      teamId: [data?.teamId || ""],
      from: data?.billingCycle?.statementStartDate?.toDate(),
      to: data?.billingCycle?.statementEndDate?.toDate(),
      methodCode: [G_CREDIT_METHOD_CODE],
    }

    modalTransactionActions.onOpen(filter)
  }

  function truncateFileName(fileName: string, startLength = 6, endLength = 8) {
    if (fileName.length <= startLength + endLength + 3) return fileName
    const start = fileName.slice(0, startLength)
    const end = fileName.slice(-endLength)
    return `${start}...${end}`
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="w-fit max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {isPaid ? (
                <>
                  <FileText className="w-4 h-4" />
                  Billing Cycle Detail
                </>
              ) : (
                <>
                  <DollarSign className="w-5 h-5 font-bold" />
                  {isContinuePayment ? "Continue Payment" : "Approve Payment"}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            {data?.statement?.status === CreditStatementStatus.OVERDUE &&
              data?.statement?.paymentStatus ===
                CreditStatementPaymentStatus.AWAITING_PAYMENT && (
                <Alert className="bg-red-50 border-red-200 text-red-600">
                  <TriangleAlert className="h-4 w-4" />
                  <AlertDescription className="font-medium text-red-600">
                    This billing cycle is overdue. Please resolve as soon as
                    possible.
                  </AlertDescription>
                </Alert>
              )}

            {isPaid ? (
              <>
                <div className="space-y-2 border p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <p className="font-medium">Date Information</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      <span className="text-muted-foreground">
                        Billing Period:{" "}
                      </span>
                      <span>
                        {formatDateString(
                          data?.billingCycle?.statementStartDate?.toDate() ||
                            new Date(),
                          COMMON_FORMAT_DATETIME_CREDIT,
                        )}{" "}
                        -{" "}
                        {formatDateString(
                          data?.billingCycle?.statementEndDate?.toDate() ||
                            new Date(),
                          COMMON_FORMAT_DATETIME_CREDIT,
                        )}
                      </span>
                    </div>

                    <div className="text-sm font-medium">
                      <span className="text-muted-foreground">
                        Statement Date:{" "}
                      </span>
                      <span>
                        {formatDateString(
                          data?.billingCycle?.statementEndDate?.toDate() ||
                            new Date(),
                          COMMON_FORMAT_DATETIME_CREDIT,
                        )}
                      </span>
                    </div>

                    <div className="text-sm font-medium">
                      <span className="text-muted-foreground">Due Date: </span>
                      <span>
                        {formatDateString(
                          data?.billingCycle?.dueDate?.toDate() || new Date(),
                          COMMON_FORMAT_DATETIME_CREDIT,
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <p className="font-medium">Status & Financials</p>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-sm font-medium text-center space-y-2">
                      <div className="text-muted-foreground">Status</div>
                      <Badge
                        className="p-0"
                        variant={mappingColor(
                          CreditStatementPaymentStatusColorsMapping,
                          data?.statement?.paymentStatus,
                        )}
                      >
                        {
                          StatementPaymentLabel[
                            data?.statement?.paymentStatus || 0
                          ]
                        }
                      </Badge>
                    </div>

                    <div className="text-sm font-medium text-center space-y-2">
                      <div className="text-muted-foreground">
                        Total Credit Used
                      </div>
                      <p className="font-bold">
                        {formatPrice(data?.statement?.totalAmount)}
                      </p>
                    </div>

                    <div className="text-sm font-medium text-center space-y-2">
                      <div className="text-muted-foreground">Amount Paid</div>
                      <p className="font-bold text-orange-600">
                        {formatPrice(data?.statement?.paidAmount)}
                      </p>
                    </div>

                    <div className="text-sm font-medium text-center space-y-2">
                      <div className="text-muted-foreground">
                        Outstanding Amount
                      </div>
                      <p className="font-bold text-green-500">
                        {formatPrice(data?.statement?.remainingAmount)}
                      </p>
                    </div>
                  </div>

                  {data?.statement?.approvalBy && (
                    <div className="text-sm text-muted-foreground border-t border-gray-200 mt-4 pt-2">
                      Approved by {data?.statement?.approvalBy} on{" "}
                      {formatDateString(
                        data?.statement?.approvalAt?.toDate() || new Date(),
                        COMMON_FORMAT_DATETIME_CREDIT,
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2 border p-4 rounded-lg max-h-[240px] overflow-y-auto">
                  <div className="flex items-center gap-2">
                    <UploadIcon className="w-4 h-4" />
                    <p className="font-medium">Payment Proof</p>
                  </div>

                  {data?.statement?.files &&
                  data.statement.files?.length > 0 ? (
                    <div className="space-y-2 overflow-y-auto">
                      {data.statement.files.map((file) => (
                        <div
                          key={file.fileId}
                          className="flex items-center gap-2 border p-2 rounded-lg bg-primary/10 justify-between"
                        >
                          <FileTextIcon className="w-4 h-4" />
                          <div className="text-sm text-primary">
                            <div>
                              {file.fileName.length > 20 ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="font-bold w-fit">
                                      {formatShortenText(file.fileName, 12, 8)}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {file.fileName}
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <div className="font-bold">{file.fileName}</div>
                              )}
                            </div>
                            <p className="text-wrap">
                              Upload by <strong>{file.createdBy}</strong> on{" "}
                              {formatDateString(
                                file.createdAt?.toDate() || new Date(),
                                COMMON_FORMAT_DATETIME_CREDIT,
                              )}
                            </p>
                          </div>
                          <div className="space-y-2 w-[120px]">
                            {file.fileType === MediaType.IMAGE && (
                              <Button
                                onClick={() => handleViewImage(file)}
                                variant="outline"
                                className="w-full"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </Button>
                            )}

                            <Button
                              onClick={() => handleDownload(file.filePath)}
                              variant="outline"
                              className="w-full"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <BoxEmpty title="No payment proof" description="" />
                  )}
                </div>

                <div className="space-y-2 border p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <BadgeDollarSign className="w-4 h-4" />
                    <p className="font-medium">Recent Transactions</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    {listTransaction?.data &&
                    listTransaction?.data?.length > 0 ? (
                      <div>
                        {listTransaction?.data?.map((txn) => (
                          <div
                            key={txn.txnId}
                            className="flex items-center justify-between gap-2"
                          >
                            <div>
                              <p className="font-medium">{txn.txnId}</p>
                              <p className="text-muted-foreground">
                                {formatDateString(
                                  txn.createdAt?.toDate() || new Date(),
                                  COMMON_FORMAT_DATETIME_CREDIT,
                                )}
                              </p>
                            </div>
                            <Badge
                              variant={mappingColor(
                                TeamTransactionTypeColorMapping,
                                txn.type,
                              )}
                            >
                              {AllTransactionType[txn.type]}
                            </Badge>

                            <Badge
                              className="text-sm "
                              variant={
                                getPrice(txn.amount) < 0 ? "error" : "success"
                              }
                            >
                              {formatPrice(txn.amount)}
                            </Badge>
                          </div>
                        ))}

                        {listTransaction?.total > LimitTransaction && (
                          <Button
                            variant={"outline"}
                            className="w-full mt-2"
                            onClick={handleOpenModal}
                          >
                            <ExternalLinkIcon className="w-4 h-4 text-muted-foreground" />
                            View all transactions
                          </Button>
                        )}
                      </div>
                    ) : (
                      <BoxEmpty title="No transaction" description="" />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Alert className="bg-primary/10 border-primary/20">
                  <Building2 className="h-4 w-4" />
                  <AlertDescription className="font-medium">
                    {data?.teamName}
                  </AlertDescription>
                </Alert>

                <Alert className="bg-blue-50 border-blue-200">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 font-medium">
                    <div className="space-y-1">
                      <div>
                        <span className="font-semibold">Billing Period:</span>{" "}
                        {formatDateString(
                          data?.billingCycle?.statementStartDate?.toDate() ??
                            new Date(),
                          COMMON_FORMAT_DATETIME_CREDIT,
                        )}{" "}
                        -{" "}
                        {formatDateString(
                          data?.billingCycle?.statementEndDate?.toDate() ??
                            new Date(),
                          COMMON_FORMAT_DATETIME_CREDIT,
                        )}
                      </div>
                      <div>
                        <span className="font-semibold">Statement Amount:</span>{" "}
                        {formatPrice(data?.statement?.totalAmount)}
                      </div>
                      <div>
                        <span className="font-semibold">Due Date:</span>{" "}
                        {formatDateString(
                          data?.billingCycle?.dueDate?.toDate() ?? new Date(),
                          COMMON_FORMAT_DATETIME_CREDIT,
                        )}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                  >
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Statement Amount
                      </FormLabel>
                      <FormControl>
                        <InputMaskField
                          value={formatPrice(data?.statement?.totalAmount)}
                          disabled
                          className="bg-gray-50 cursor-not-allowed"
                        />
                      </FormControl>
                    </FormItem>

                    <FormField
                      control={form.control}
                      name="amountReceived"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Amount Received
                            <span className="text-red-500">*</span>
                            {isRequestPayment && (
                              <Tooltip>
                                <TooltipTrigger type="button">
                                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[300px]">
                                  This field is pre-filled from the payment
                                  request and cannot be modified during
                                  approval.
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </FormLabel>
                          <FormControl>
                            <InputMaskField
                              {...field}
                              readOnly={isRequestPayment}
                              placeholder="Enter amount received"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="methodCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4" /> Payment Method
                            <span className="text-red-500">*</span>
                            {isRequestPayment && (
                              <Tooltip>
                                <TooltipTrigger type="button">
                                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[300px]">
                                  This field is pre-filled from the payment
                                  request and cannot be modified during
                                  approval.
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </FormLabel>
                          <FormControl>
                            <ComboboxField
                              {...field}
                              modal
                              disabled={isRequestPayment}
                              options={listPaymentMethodOptions}
                              placeholder="Select payment method"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Remaining Due
                      </FormLabel>
                      <FormControl>
                        <InputMaskField
                          value={formatPrice(data?.statement?.remainingAmount)}
                          disabled
                          className="bg-gray-50 cursor-not-allowed text-orange-600 font-medium"
                        />
                      </FormControl>
                    </FormItem>

                    {isRequestPayment ? (
                      <>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <FileText className="w-4 h-4" /> Payment Proof By Team
                        </p>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          {data?.statementPaymentRequest?.files.map((file) => {
                            return (
                              <div
                                key={file.fileId}
                                className="flex items-center gap-3 justify-between border p-4 rounded-lg"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {file.fileType === MediaType.IMAGE ? (
                                    <ImageIcon className="w-4 h-4" />
                                  ) : (
                                    <File className="w-4 h-4" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="truncate font-medium text-sm"
                                      title={file.fileName}
                                    >
                                      {truncateFileName(file.fileName)}
                                    </p>
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Uploaded by {file.createdBy} on{" "}
                                        {formatDateString(
                                          file.createdAt?.toDate() ||
                                            new Date(),
                                          COMMON_FORMAT_DATETIME_CREDIT,
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {file.fileType === MediaType.IMAGE && (
                                    <Button
                                      onClick={() => handleViewImage(file)}
                                      variant="ghost"
                                      size="sm"
                                      className="p-2"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  )}

                                  <Button
                                    onClick={() =>
                                      handleDownload(file.filePath)
                                    }
                                    variant="ghost"
                                    size="sm"
                                    className="p-2"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </>
                    ) : (
                      <FormField
                        control={form.control}
                        name="files"
                        render={() => (
                          <FormItem>
                            <FormLabel className="space-x-2">
                              <UploadIcon className="w-4 h-4" /> Upload Payment
                              Proof
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <FileUploader
                                uppyId={uppyId}
                                files={files}
                                setFiles={setFiles}
                                allowedFileTypes={ACCEPT_FILE_IMAGE_PDF}
                                supportText="PDF, JPG, PNG, DOCX (max 10MB)"
                                uploadText="Click to upload or drag and drop"
                                isPrefixName={false}
                                onDelete={handleDeleteFiles}
                                truncateFileName
                                maxFileNameLength={40}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <DialogFooter className="flex justify-between pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={
                          isRequestPayment
                            ? handleOpenRejectReasonStatementModal
                            : handleClose
                        }
                        disabled={
                          mutation.isPending ||
                          uploadTeamMediaMutation.isPending ||
                          uploadTeamDocumentMutation.isPending
                        }
                      >
                        {isRequestPayment ? "Reject" : "Cancel"}
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          !form.formState.isValid ||
                          mutation.isPending ||
                          uploadTeamMediaMutation.isPending ||
                          uploadTeamDocumentMutation.isPending
                        }
                        loading={
                          mutation.isPending ||
                          uploadTeamMediaMutation.isPending ||
                          uploadTeamDocumentMutation.isPending
                        }
                        className="bg-gray-600 hover:bg-gray-700"
                      >
                        Confirm Approval
                      </Button>
                    </DialogFooter>

                    {/* Notice */}
                    <p className="text-xs text-gray-500 text-center pt-2">
                      Only Finance Admin users can approve payments
                    </p>
                  </form>
                </Form>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
