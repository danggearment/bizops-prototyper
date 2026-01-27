import FileUploader from "@/components/common/file-uploader/file-uploader"
import { ACCEPT_FILE_IMAGE_PDF } from "@/constants/accept-file"
import {
  COMMON_FORMAT_DATETIME_CREDIT,
  DueDateOptions,
  StatementDateOptions,
} from "@/constants/payment"
import {
  CreateCreditSchema,
  CreateCreditType,
  UpdateCreditSchema,
  UpdateCreditType,
} from "@/schemas/schemas/payment"
import {
  useMutationFinance,
  useMutationStudio,
  useQueryFinance,
} from "@/services/connect-rpc/transport"
import {
  ApproveReasonType,
  CreditIntervalUnit,
  Money,
  StaffGetCreditOverviewResponse_CreditOverview,
} from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { MyUppyFile, uploader } from "@/services/uploader/uppy"
import { FileType, getPrice, staffFormatUploadData } from "@/utils"
import { formatPrice } from "@/utils/format-currency"
import {
  calculateDateFromOption,
  formatDateString,
  parseIntervalOption,
} from "@/utils/format-date"
import {
  staffCreateGCredit,
  staffGetCreditOverview,
  staffUpdateGCredit,
} from "@gearment/nextapi/api/credit/v1/credit_admin-CreditAdminAPI_connectquery"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  CheckboxField,
  ComboboxField,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  InputMaskField,
  LoadingCircle,
  TextareaField,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { getDecimalPart, getNumberFromInputMask } from "@gearment/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams } from "@tanstack/react-router"
import { Calendar, CreditCard, Info } from "lucide-react"
import { useId, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import { staffListApproveReason } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import {
  staffUploadTeamDocument,
  staffUploadTeamMedia,
} from "@gearment/nextapi/api/studio/v1/media_admin-MediaAdminManagement_connectquery"
import { File as ProtoFile } from "@gearment/nextapi/common/type/v1/file_pb"

interface GCreditFormData {
  teamId: string
  limit: string
  statementOffset?: number
  statementUnit?: CreditIntervalUnit
  dueOffset?: number
  dueUnit?: CreditIntervalUnit
  enableNotification: boolean
  usageThreshold?: number
  policyNote?: string
  files?: Array<{
    fileName: string
    fileSize: number
    fileType: string
    fileUrl: string
  }>
  reasonId?: string
  reason?: string
}

const findDateOption = (
  options: Array<{ value: string; label: string }>,
  offset: number,
  unit: number,
) => {
  return options.find((option) => {
    const parsed = JSON.parse(option.value)
    return parsed.offset === offset && parsed.unit === unit
  })
}

const createFormDefaultValues = (
  data: StaffGetCreditOverviewResponse_CreditOverview | undefined,
  teamId: string,
  isUpdating: boolean,
): Partial<CreateCreditType> | Partial<UpdateCreditType> => {
  if (isUpdating) {
    return {
      teamId,
      limit: getPrice(data?.credit?.limitAmount).toString() || "",
      enableNotification: data?.credit?.isNotifyThresholdExceeded || false,
      usageThreshold: data?.credit?.notificationThresholdPercent || 0,
      statementOffset: data?.credit?.statementOffset || 1,
      statementUnit: data?.credit?.statementUnit || 1,
      dueOffset: data?.credit?.dueOffset || 1,
      dueUnit: data?.credit?.dueUnit || 1,
      reasonId: "",
      reason: "",
    } as Partial<UpdateCreditType>
  } else {
    return {
      teamId,
      limit: "",
      enableNotification: false,
      usageThreshold: 0,
      policyNote: "",
      files: [],
    } as Partial<CreateCreditType>
  }
}

function CurrentConfiguration({
  header,
  value,
  subValue,
}: {
  header: string
  value?: string
  subValue?: string
}) {
  return (
    <div className="py-3">
      <p className="text-sm text-muted-foreground mb-1">{header}</p>
      <p className="text-base font-bold text-foreground">{value}</p>
      {subValue && (
        <p className="text-sm text-muted-foreground mt-1">{subValue}</p>
      )}
    </div>
  )
}
const createMoneyAmount = (limitString: string): Money => {
  const limitNumber = getNumberFromInputMask(limitString)
  return new Money({
    units: BigInt(parseInt(limitNumber.toString())),
    nanos: getDecimalPart(limitNumber),
  })
}

export default function EnableForm() {
  const navigate = useNavigate({
    from: "/system/teams/$teamId/g-credits/enable",
  })
  const { teamId } = useParams({
    from: "/_authorize/system/teams/$teamId/g-credits/enable",
  })

  const { data, isLoading } = useQueryFinance(
    staffGetCreditOverview,
    { teamId },
    { select: (data) => data?.data },
  )

  const { data: approveReasonData } = useQueryFinance(
    staffListApproveReason,
    {
      type: ApproveReasonType.CREDIT,
    },
    {
      select: (data) => data?.data,
    },
  )

  const isUpdating = !!data?.credit
  const uppyId = useId()
  const uppy = useMemo(() => uploader.getOrCreateUppy(uppyId), [uppyId])
  const mediaIds = useRef<string[]>([])
  const [files, setFiles] = useState<MyUppyFile[]>()

  const getInitialStatementDate = () => {
    if (!isUpdating || !data?.credit) return ""
    const option = findDateOption(
      StatementDateOptions,
      data.credit.statementOffset,
      data.credit.statementUnit,
    )
    return option?.value || ""
  }

  const getInitialDueDate = () => {
    if (!isUpdating || !data?.credit) return ""
    const option = findDateOption(
      DueDateOptions,
      data.credit.dueOffset,
      data.credit.dueUnit,
    )
    return option?.value || ""
  }

  const [statementDateOption, setStatementDateOption] = useState(
    getInitialStatementDate,
  )
  const [dueDateOption, setDueDateOption] = useState(getInitialDueDate)
  const [selectedReasonId, setSelectedReasonId] = useState("")
  const [customReason, setCustomReason] = useState("")

  const reasonOptions = useMemo(() => {
    return (
      approveReasonData?.map((reason) => ({
        value: reason.approveReasonId,
        label: reason.reason,
        isCustom: reason.isCustom,
      })) || []
    )
  }, [approveReasonData])

  const form = useForm<GCreditFormData>({
    resolver: zodResolver(isUpdating ? UpdateCreditSchema : CreateCreditSchema),
    defaultValues: createFormDefaultValues(data, teamId, isUpdating),
  })

  const limitValue = form.watch("limit")
  const enableNotification = form.watch("enableNotification")

  const selectedReasonData = useMemo(() => {
    const reason = reasonOptions.find((r) => r.value === selectedReasonId)
    if (reason && !reason.isCustom) {
      setCustomReason(reason.label)
      form.setValue("reason", reason.label)
    } else {
      setCustomReason("")
      form.setValue("reason", "")
    }
    return reason
  }, [reasonOptions, selectedReasonId, form])

  const isCustomReason = selectedReasonData?.isCustom || false

  useMemo(() => {
    if (isUpdating && data?.credit) {
      form.setValue("statementOffset", data.credit.statementOffset)
      form.setValue("statementUnit", data.credit.statementUnit)
      form.setValue("dueOffset", data.credit.dueOffset)
      form.setValue("dueUnit", data.credit.dueUnit)
      form.setValue("limit", formatPrice(data.credit.limitAmount))
    }
  }, [isUpdating, data, form])

  const billingStartDate = useMemo(() => {
    const date = new Date()
    const utcToday = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    )
    return isUpdating && data?.credit?.billingStartDate
      ? data.credit.billingStartDate.toDate()
      : utcToday
  }, [isUpdating, data])

  const calculatedStatementDate = useMemo(() => {
    if (!statementDateOption) return null
    return calculateDateFromOption(billingStartDate, statementDateOption)
  }, [billingStartDate, statementDateOption])

  const calculatedDueDate = useMemo(() => {
    if (!dueDateOption || !calculatedStatementDate) return null
    return calculateDateFromOption(calculatedStatementDate, dueDateOption)
  }, [calculatedStatementDate, dueDateOption])

  const formFiles = useMemo(() => {
    return files?.length
      ? files.map((file) => ({
          fileName: file.name || "",
          fileSize: file.size || 0,
          fileType: file.type || "",
          fileUrl: "",
        }))
      : []
  }, [files])

  useMemo(() => {
    if (formFiles.length > 0) {
      form.setValue("files", formFiles, { shouldValidate: true })
    }
  }, [formFiles, form])

  const uploadTeamMediaMutation = useMutationStudio(staffUploadTeamMedia, {
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.rawMessage,
      })
    },
  })

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

  const [setOpen, onClose] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const createGCreditMutation = useMutationFinance(staffCreateGCredit, {
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Success",
        description: "G-credit has been enabled successfully!",
      })
      navigate({
        to: "/system/teams/$teamId/g-credits",
        params: { teamId },
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.rawMessage || "Failed to enable G-credit. Please try again.",
      })
    },
  })

  const updateGCreditMutation = useMutationFinance(staffUpdateGCredit, {
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Success",
        description: "G-credit has been updated successfully!",
      })
      navigate({
        to: "/system/teams/$teamId/g-credits",
        params: { teamId },
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.rawMessage || "Failed to update G-credit. Please try again.",
      })
    },
  })

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
        teamId,
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

  const handleCreate = async (formData: GCreditFormData) => {
    try {
      if (formData.policyNote && formData.policyNote.length > 1000) {
        form.setError("policyNote", {
          message: "Policy note must be less than 1000 characters",
        })
        return
      }

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

      const creditData = {
        teamId,
        creditLimit: createMoneyAmount(formData.limit),
        statementUnit: parseIntervalOption(statementDateOption).unit,
        statementOffset: parseIntervalOption(statementDateOption).offset,
        dueUnit: parseIntervalOption(dueDateOption).unit,
        dueOffset: parseIntervalOption(dueDateOption).offset,
        policyNote: formData.policyNote,
        isNotifyThresholdExceeded: formData.enableNotification,
        notificationThresholdPercent: formData.usageThreshold,
        files: uploadedFiles,
      }
      await createGCreditMutation.mutateAsync(creditData)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to enable G-credit. Please try again.",
      })
    }
  }

  const handleUpdate = async (formData: GCreditFormData) => {
    setOpen({
      title: "Confirm",
      description: "Are you sure you want to save the configuration?",
      confirmText: "Save",
      onConfirm: async () => {
        await updateGCreditMutation.mutateAsync({
          teamId,
          creditLimit: createMoneyAmount(formData.limit),
          statementUnit: parseIntervalOption(statementDateOption).unit,
          statementOffset: parseIntervalOption(statementDateOption).offset,
          dueUnit: parseIntervalOption(dueDateOption).unit,
          dueOffset: parseIntervalOption(dueDateOption).offset,
          isNotifyThresholdExceeded: formData.enableNotification,
          notificationThresholdPercent: formData.usageThreshold,
          reason: isCustomReason
            ? customReason.trim()
            : selectedReasonData?.label || "",
          reasonId: selectedReasonId,
        })
        onClose()
      },
    })
  }

  const handleSubmit = async (formData: GCreditFormData) => {
    if (!statementDateOption) {
      form.setError("statementUnit", {
        message: "Statement date is required",
      })
      return
    }

    if (!dueDateOption) {
      form.setError("dueUnit", {
        message: "Due date is required",
      })
      return
    }

    if (isUpdating && !selectedReasonId) {
      form.setError("reasonId", {
        message: "Reason is required for updating G-credit",
      })
      return
    }

    if (isUpdating && isCustomReason && !customReason.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please provide a custom reason.",
      })
      return
    }

    if (isUpdating) {
      await handleUpdate(formData)
    } else {
      await handleCreate(formData)
    }
  }

  const handleDeleteFiles = () => {
    form.setValue("files", [])
    setFiles(undefined)
  }

  const handleCancel = () => {
    navigate({
      to: "/system/teams/$teamId/g-credits",
      params: { teamId },
    })
  }

  const handleStatementDateChange = (value: string) => {
    setStatementDateOption(value)
    const parsed = parseIntervalOption(value)
    form.setValue("statementOffset", parsed.offset)
    form.setValue("statementUnit", parsed.unit)
    form.clearErrors("statementUnit")
  }

  const handleDueDateChange = (value: string) => {
    setDueDateOption(value)
    const parsed = parseIntervalOption(value)
    form.setValue("dueOffset", parsed.offset)
    form.setValue("dueUnit", parsed.unit)
    form.clearErrors("dueUnit")
  }

  const isSubmitting =
    createGCreditMutation.isPending ||
    updateGCreditMutation.isPending ||
    uploadTeamMediaMutation.isPending

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingCircle />
      </div>
    )
  }
  const commonFormat = COMMON_FORMAT_DATETIME_CREDIT
  return (
    <div
      className={`bg-background rounded-lg px-4 py-8 space-y-4 mb-4 ${!isUpdating && " w-1/2"}`}
    >
      <div className="text-left">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          {isUpdating ? "Edit G-credit Configuration" : "Enable G-credit"}
        </h2>
        <div className="text-sm text-muted-foreground mb-8">
          {isUpdating
            ? "Update credit limit and billing cycle settings for this team. Please provide a reason for this change."
            : "Configure G-credit settings for this team. You can modify these settings later."}
        </div>
      </div>

      {!isUpdating && (
        <Alert>
          <AlertDescription className="flex items-center">
            <Info className="w-4 h-4 mr-2" />
            Only users with admin or finance role can enable and configure
            G-credit for this team.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div
            className={`grid gap-6 ${isUpdating ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}
          >
            {isUpdating && (
              <div className="space-y-4 col-span-1">
                <h3 className="text-md font-medium border-b pb-2">
                  Current Configuration
                </h3>

                <section className="border bg-secondary/10 rounded-lg p-4">
                  <div className="font-medium text-left mb-2 text-lg">
                    Credit Limits
                  </div>
                  <CurrentConfiguration
                    header="Total credit limit"
                    value={formatPrice(data?.credit?.limitAmount)}
                  />
                  <CurrentConfiguration
                    header="Utilization"
                    value={`${data?.credit?.creditUtilizationPercent || 0}%`}
                    subValue={`Usable: ${formatPrice(data?.credit?.limitAmount)}`}
                  />
                </section>

                <section className="border bg-secondary/10 rounded-lg p-4">
                  <div className="font-medium text-left mb-2 text-lg">
                    Billing Cycle Configuration
                  </div>
                  <CurrentConfiguration
                    header="Billing start date"
                    value={formatDateString(
                      data?.credit?.billingStartDate?.toDate() || new Date(),
                      commonFormat,
                    )}
                  />
                  <CurrentConfiguration
                    header="Statement cycle"
                    value={
                      findDateOption(
                        StatementDateOptions,
                        data?.credit?.statementOffset || 0,
                        data?.credit?.statementUnit || 0,
                      )?.label
                    }
                  />
                  <CurrentConfiguration
                    header="Due date"
                    value={
                      findDateOption(
                        DueDateOptions,
                        data?.credit?.dueOffset || 0,
                        data?.credit?.dueUnit || 0,
                      )?.label
                    }
                  />
                </section>

                <section className="border bg-secondary/10 rounded-lg p-4">
                  <div className="font-medium text-left mb-2 text-lg">
                    Notification Settings
                  </div>
                  <CurrentConfiguration
                    header="Notification settings"
                    value={`${data?.credit?.isNotifyThresholdExceeded ? `At ${data?.credit?.notificationThresholdPercent}% usage` : "Disabled"}`}
                  />
                </section>
              </div>
            )}
            <div className="space-y-4 col-span-2">
              <h3 className="text-md font-medium border-b pb-2">
                Update Configuration
              </h3>
              <section className="border bg-secondary/10 rounded-lg p-4">
                <div className="font-medium text-left mb-2 text-lg">
                  Credit Limits
                </div>
                <FormField
                  name="limit"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Total credit limit ($)
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <InputMaskField
                          {...field}
                          placeholder="Enter total credit limit"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <section className="border bg-secondary/10 rounded-lg p-4">
                <div className="font-medium text-left mb-2 text-lg flex items-center gap-2">
                  Billing Cycle Setup
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Configure the billing cycle for G-Credit management.
                        <br />
                        Set up statement generation dates and payment deadlines
                        <br />
                        to establish a structured credit payment schedule.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="space-y-4">
                  <div>
                    <FormLabel>
                      <span className="mr-1">Billing start date</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Credit cycle start date. Debt recording begins from
                            this point.
                            <br />
                            Users cannot select specific dates, only preset
                            options
                            <br />
                            to ensure system stability.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>

                    {isUpdating && (
                      <div className="mt-2">
                        <Input
                          value={
                            data?.credit?.billingStartDate
                              ? formatDateString(
                                  data.credit.billingStartDate.toDate(),
                                  commonFormat,
                                )
                              : ""
                          }
                          readOnly
                          className="bg-muted text-muted-foreground cursor-not-allowed"
                          placeholder="Billing start date"
                        />
                      </div>
                    )}

                    <p
                      className={`text-sm text-left text-muted-foreground mt-1`}
                    >
                      {isUpdating
                        ? "Billing Start Date cannot be changed after G-Credit activation."
                        : " The billing start date will be the date when you create the credit."}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <FormLabel className="text-foreground">
                      <span className="mr-1">
                        Statement date <span className="text-red-500">*</span>
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Date when the system automatically generates debt
                            statements.
                            <br />
                            Users select relative time points (not specific
                            dates).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <ComboboxField
                      value={statementDateOption}
                      onChange={handleStatementDateChange}
                      options={StatementDateOptions}
                      placeholder="Select statement date"
                      className="border-red-200 focus:border-red-300"
                    />
                    <FormMessage>
                      {form.formState.errors.statementUnit?.message?.toString()}
                    </FormMessage>
                    <p className="text-sm text-left text-muted-foreground">
                      The system will automatically calculate the statement date
                      by adding the selected duration to the billing start date.
                    </p>
                  </div>

                  <Alert className="bg-primary/10 border-primary/10 font-medium">
                    <AlertDescription className="text-primary/80 font-medium">
                      Statement will be generated on:{" "}
                      {calculatedStatementDate
                        ? formatDateString(
                            calculatedStatementDate,
                            commonFormat,
                          )
                        : ""}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <FormLabel className="text-foreground">
                      <span className="mr-1">
                        Due date <span className="text-red-500">*</span>
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Payment deadline for debt.
                            <br />
                            Can select from preset options or specific dates.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <ComboboxField
                      value={dueDateOption}
                      onChange={handleDueDateChange}
                      options={DueDateOptions}
                      placeholder="Select due date"
                      className="border-red-200 focus:border-red-300"
                    />
                    <FormMessage>
                      {form.formState.errors.dueUnit?.message?.toString()}
                    </FormMessage>
                    <p className="text-sm text-left text-muted-foreground">
                      The system will automatically calculate the due date by
                      adding the selected duration to the statement date.
                    </p>
                  </div>

                  <Alert className="bg-primary/10 border-primary/20 font-medium text-left">
                    <AlertTitle className="flex items-center mb-3 text-lg text-primary">
                      <Calendar className="w-5 h-5 mr-2" />
                      Billing Cycle Summary
                    </AlertTitle>
                    <AlertDescription className="text-primary/90 space-y-2">
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Billing period: </span>
                          <span>
                            {calculatedStatementDate
                              ? `${formatDateString(billingStartDate, commonFormat)} to ${formatDateString(calculatedStatementDate, commonFormat)}`
                              : "--"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Statement date: </span>
                          <span>
                            {calculatedStatementDate
                              ? formatDateString(
                                  calculatedStatementDate,
                                  commonFormat,
                                )
                              : "--"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Due date: </span>
                          <span>
                            {calculatedDueDate
                              ? formatDateString(
                                  calculatedDueDate,
                                  commonFormat,
                                )
                              : "--"}
                          </span>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </section>

              {!isUpdating && (
                <section className="border bg-secondary/10 rounded-lg p-4 space-y-8">
                  <div className="font-medium text-left mb-2 text-lg">
                    Policy Note & Attachments
                  </div>
                  <FormField
                    name="policyNote"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Policy note
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <TextareaField
                            className="bg-background "
                            {...field}
                            placeholder="Enter policy note"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="files"
                    control={form.control}
                    render={() => (
                      <FormItem>
                        <FormLabel>
                          Attach files (Images, PDFs)
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <FileUploader
                              uppyId={uppyId}
                              files={files}
                              setFiles={setFiles}
                              allowedFileTypes={ACCEPT_FILE_IMAGE_PDF}
                              supportText="File size up to 10 MB allowed."
                              uploadText="Click to upload or drag files here"
                              isPrefixName={false}
                              onDelete={handleDeleteFiles}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>
              )}

              <section className="border bg-secondary/10 rounded-lg p-4 space-y-2">
                <div className="font-medium text-left mb-2 text-lg">
                  Notification Settings
                </div>

                <FormField
                  name="enableNotification"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <CheckboxField
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          Send notifications when usage threshold is reached
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="usageThreshold"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="ml-6">
                      <FormLabel>Usage threshold (%)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={enableNotification ? 1 : undefined}
                          max={enableNotification ? 100 : undefined}
                          placeholder="Enter usage threshold"
                          className="w-[200px]"
                          disabled={!enableNotification}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value === "" ? 0 : Number(value))
                          }}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
            </div>
          </div>

          {isUpdating && (
            <section className="border bg-secondary/10 rounded-lg p-4">
              <div className="font-medium text-left mb-2 text-lg">
                Reason For Update
              </div>
              <FormField
                name="reasonId"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Select Reason <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <ComboboxField
                        value={selectedReasonId}
                        onChange={(value) => {
                          setSelectedReasonId(value)
                          form.setValue("reasonId", value)
                          form.clearErrors(["reasonId", "reason"])
                        }}
                        options={reasonOptions}
                        placeholder="Select reason for updating G-credit"
                        className="border-red-200 focus:border-red-300"
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.reasonId?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {isCustomReason && (
                <FormField
                  name="reason"
                  control={form.control}
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-foreground pt-4">
                        Custom Reason <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <TextareaField
                          value={customReason}
                          onChange={(e) => {
                            setCustomReason(e.target.value)
                            form.setValue("reason", e.target.value)
                          }}
                          placeholder="Please provide your custom reason for updating G-credit"
                          rows={3}
                          className="border-red-200 focus:border-red-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </section>
          )}
          <Alert className="bg-primary/10 border-primary/10 font-medium text-left text-primary/80">
            <AlertTitle className="flex items-center mb-1 text-md">
              Configuration Summary
            </AlertTitle>
            <AlertDescription className="text-primary/80">
              <p>Total credit limit: {limitValue}</p>
              <p>
                Billing cycle start date:{" "}
                {formatDateString(billingStartDate, commonFormat)}
              </p>
              <p>
                Statement date:{" "}
                {calculatedStatementDate
                  ? formatDateString(calculatedStatementDate, commonFormat)
                  : ""}
              </p>
              <p>
                Due date:{" "}
                {calculatedDueDate
                  ? formatDateString(calculatedDueDate, commonFormat)
                  : ""}
              </p>
              <p>
                Notifications:{" "}
                {enableNotification
                  ? `At ${form.watch("usageThreshold") || 0}% usage`
                  : "Disabled"}
              </p>
              <p>Attachments: {files?.length || 0} file(s)</p>
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-2 col-span-2">
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isUpdating ? "Save changes" : "Enable G-credit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
