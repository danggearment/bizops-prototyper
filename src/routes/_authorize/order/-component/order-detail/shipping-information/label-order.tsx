import FileUploadWrapper from "@/components/common/file-uploader/file-upload-wrapper"
import { ACCEPT_PDF_FILE } from "@/constants/accept-file"
import {
  useMutationPod,
  useMutationStudio,
} from "@/services/connect-rpc/transport"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { useNotificationModal } from "@/services/modals/modal-notification"
import { queryClient } from "@/services/react-query"
import { MyUppyFile, uploader } from "@/services/uploader/uppy"
import {
  userGetOrderDraft,
  userUpdateLabelOrderDraft,
} from "@gearment/nextapi/api/pod/v1/order_draft-OrderDraftAPI_connectquery"
import { userUploadTeamDocument } from "@gearment/nextapi/api/studio/v1/media-MediaManagement_connectquery"
import {
  Badge,
  Button,
  cn,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { formatShortenText } from "@gearment/utils"
import { FileClock, FileIcon, TrashIcon, UploadIcon } from "lucide-react"
import { useEffect, useId, useMemo, useRef, useState } from "react"

import { handleDownloadPDF } from "@/routes/_authorize/order/-helper.ts"
import { FileType } from "@/schemas/common/common.ts"
import { formatUploadData } from "@/utils"
interface Props {
  shippingLabels?: { labelFile?: FileType; isLabelUpdated?: boolean }[]
  isEdit: boolean
  isAmazonOrder?: boolean
  orderId: string
}
export default function LabelOrder({
  shippingLabels,
  isEdit,
  isAmazonOrder,
  orderId,
}: Props) {
  const shippingLabelsRef = useRef(shippingLabels)
  const [loading, setLoading] = useState(false)
  const uppyId = useId()
  const uppy = uploader.getOrCreateUppy(uppyId)
  const mutationUploadTeamDocument = useMutationStudio(userUploadTeamDocument)
  const [setOpen, onClose] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])
  const [setOpenNotification, onCloseNotification] = useNotificationModal(
    (state) => [state.setOpen, state.onClose],
  )

  const { originalLabels, updatedLabels } = useMemo(() => {
    const original: typeof shippingLabels = []
    const updated: typeof shippingLabels = []

    shippingLabels?.forEach((label) => {
      if (label.isLabelUpdated) {
        updated.push(label)
      } else {
        original.push(label)
      }
    })

    return { originalLabels: original, updatedLabels: updated }
  }, [shippingLabels])

  const isLabelUpdated = updatedLabels.length > 0
  const displayLabels = isLabelUpdated ? updatedLabels : originalLabels

  const mutationUploadShippingLabel = useMutationPod(
    userUpdateLabelOrderDraft,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            userGetOrderDraft.service.typeName,
            userGetOrderDraft.name,
          ],
        })
      },
    },
  )
  useEffect(() => {
    shippingLabelsRef.current = shippingLabels
  }, [shippingLabels])

  const handleUpload = async (files?: MyUppyFile[]) => {
    try {
      setLoading(true)
      let labelFile: FileType | undefined = undefined
      if (files) {
        for (const file of files) {
          if (!file.name) return

          if (
            (shippingLabelsRef.current || []).some(
              (s) => s.labelFile?.fileName === file?.name,
            )
          ) {
            toast({
              variant: "destructive",
              title: "Update shipping label",
              description:
                "This shipping label was existed, please try another file",
            })
            return
          }

          const uploadData = formatUploadData(file, "orderLabel", "document")

          const res = await mutationUploadTeamDocument.mutateAsync(uploadData)
          const uploadUrl = res.uploadUrl

          if (res.documentFile) {
            labelFile = {
              fileName: res.documentFile.fileName,
              filePath: res.documentFile.filePath,
              fileUrl: res.documentFile.fileUrl,
            }
          }
          uppy.setFileState(file.id, {
            xhrUpload: {
              method: res.method,
              endpoint: uploadUrl,
              formData: false,
            },
          })
        }
        await uppy.upload()
        files.forEach((file) => {
          uppy.removeFile(file.id)
        })
      }

      if (labelFile) {
        if (isAmazonOrder) {
          const labelUrls = shippingLabelsRef.current?.concat({
            labelFile: labelFile,
          })

          await mutationUploadShippingLabel.mutateAsync({
            draftId: orderId,
            labels: labelUrls,
          })
        } else {
          await mutationUploadShippingLabel.mutateAsync({
            draftId: orderId,
            labels: [
              {
                labelFile: labelFile,
              },
            ],
          })
        }
      }
    } finally {
      setLoading(false)
    }
  }
  const handleDelete = async (labelUrl: string) => {
    setOpen({
      title: "Delete shipping label",
      description: `Are you sure you want to delete this shipping label`,
      onConfirm: async () => {
        const labelUrls = shippingLabels?.filter(
          (s) => s.labelFile?.fileUrl !== labelUrl,
        )
        await mutationUploadShippingLabel.mutateAsync({
          draftId: orderId,
          labels: labelUrls,
        })
        onClose()
      },
    })
  }

  const viewOriginalLabel = () => {
    const rows = []

    const maxLength = Math.max(originalLabels.length, updatedLabels.length)
    for (let i = 0; i < maxLength; i++) {
      const originalLabel = originalLabels[i]
      const updatedLabel = updatedLabels[i]

      rows.push({
        index: i + 1,
        originalFileName: originalLabel?.labelFile?.fileName || "--",
        originalFileUrl: originalLabel?.labelFile?.fileUrl || "",
        updatedFileName: updatedLabel?.labelFile?.fileName || "--",
        updatedFileUrl: updatedLabel?.labelFile?.fileUrl || "",
        isUpdated:
          originalLabel?.labelFile?.fileName !==
          updatedLabel?.labelFile?.fileName,
      })
    }

    setOpenNotification({
      title: "Label Comparison",
      description: (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]"></TableHead>
              <TableHead>Original</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.index}>
                  <TableCell className="font-medium">{row.index}</TableCell>
                  <TableCell
                    className={cn(row.isUpdated ? "text-error-foreground" : "")}
                  >
                    <div>
                      {row.originalFileUrl && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleDownloadPDF(
                              row.originalFileUrl,
                              row.originalFileName,
                            )
                          }
                          className="shrink-0"
                        >
                          <FileIcon className="w-4 h-4" />
                          {row.originalFileName.length > 20 ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  {formatShortenText(
                                    row.originalFileName,
                                    12,
                                    8,
                                  )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {row.originalFileName}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            row.originalFileName
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell
                    className={cn(
                      row.isUpdated ? "text-success-foreground" : "",
                    )}
                  >
                    <div>
                      {row.updatedFileUrl && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleDownloadPDF(
                              row.updatedFileUrl,
                              row.updatedFileName,
                            )
                          }
                          className="shrink-0"
                        >
                          <FileIcon className="w-4 h-4" />
                          {row.updatedFileName.length > 20 ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  {formatShortenText(
                                    row.updatedFileName,
                                    12,
                                    8,
                                  )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {row.updatedFileName}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            row.updatedFileName
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No labels to compare
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ),
      OK: "Close",
      className: "sm:min-w-[800px]",
      onConfirm: () => {
        onCloseNotification()
      },
    })
  }
  return (
    <div>
      <h3 className="heading-3 mb-4 flex items-center gap-2">
        Shipping Label
        {isLabelUpdated && (
          <>
            <Badge variant="warning">Updated</Badge>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={viewOriginalLabel}>
                  <FileClock className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View label comparison</TooltipContent>
            </Tooltip>
          </>
        )}
      </h3>
      {displayLabels?.map((shippingLabel) => (
        <div key={shippingLabel.labelFile?.fileName} className="">
          <div
            onClick={() =>
              shippingLabel.labelFile &&
              handleDownloadPDF(
                shippingLabel.labelFile.fileUrl,
                shippingLabel.labelFile.fileName,
              )
            }
            className="flex mb-4 group cursor-pointer gap-2 border border-border px-6 py-4 rounded-md items-center shadow-1"
          >
            <div>
              <FileIcon />
            </div>

            <div className="flex-1 w-full overflow-hidden">
              <div className="group-hover:text-primary body-medium truncate">
                {shippingLabel.labelFile &&
                  formatShortenText(shippingLabel.labelFile.fileName)}
              </div>
            </div>

            {isEdit && displayLabels.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  shippingLabel.labelFile &&
                    handleDelete(shippingLabel.labelFile.fileUrl)
                }}
                className="hover:text-primary"
              >
                <TrashIcon />
              </Button>
            )}
          </div>
        </div>
      ))}

      {isEdit && (
        <FileUploadWrapper
          setFiles={handleUpload}
          uppyId={uppyId}
          acceptFiles={ACCEPT_PDF_FILE}
        >
          <Button
            loading={loading}
            className="flex items-center gap-3"
            disabled={loading}
            variant={"outline"}
          >
            <UploadIcon />
            {isAmazonOrder || shippingLabels?.length === 0
              ? "Upload"
              : "Replace"}
          </Button>
        </FileUploadWrapper>
      )}
    </div>
  )
}
