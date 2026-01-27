import Image from "@/components/common/image/image"
import { COMMON_FORMAT_DATETIME_CREDIT } from "@/constants/payment"
import {
  useMutationFinance,
  useMutationStudio,
} from "@/services/connect-rpc/transport"
import {
  Credit,
  Credit_Attachment,
  MediaType,
} from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { useNotificationModal } from "@/services/modals/modal-notification"
import {
  ModalPolicyNote,
  usePolicyNoteModal,
} from "@/services/modals/modal-policy-note"
import {
  ModalUploadFile,
  useUploadFileModal,
} from "@/services/modals/modal-upload-file"
import { queryClient } from "@/services/react-query"
import { FileType, formatDateString, staffFormatUploadData } from "@/utils"
import {
  staffDownloadCreditAttachment,
  staffGetCreditOverview,
  staffUpsertCreditPolicyAttachment,
} from "@gearment/nextapi/api/credit/v1/credit_admin-CreditAdminAPI_connectquery"
import {
  staffUploadTeamDocument,
  staffUploadTeamMedia,
} from "@gearment/nextapi/api/studio/v1/media_admin-MediaAdminManagement_connectquery"
import { File as ProtoFile } from "@gearment/nextapi/common/type/v1/file_pb"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { formatShortenText } from "@gearment/utils"
import { useParams } from "@tanstack/react-router"
import {
  Download,
  Edit,
  Eye,
  File,
  FileText,
  Image as ImageIcon,
  Plus,
  Trash,
} from "lucide-react"
import { useRef } from "react"

interface Props {
  credit?: Credit
}
function PolicySection({ credit }: Props) {
  const { teamId } = useParams({
    from: "/_authorize/system/teams/$teamId/g-credits/",
  })
  const { setOpen: openPolicyNoteModal } = usePolicyNoteModal()
  const { setOpen: openUploadFileModal } = useUploadFileModal()
  const { setOpen: openConfirmModal, onClose } = useConfirmModal()
  const { setOpen: openNotificationModal, onClose: onCloseNotificationModal } =
    useNotificationModal()
  const mediaIds = useRef<string[]>([])

  const updatePolicyMutation = useMutationFinance(
    staffUpsertCreditPolicyAttachment,
    {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Success",
          description: "Update policy successfully!",
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffGetCreditOverview.service.typeName,
            staffGetCreditOverview.name,
          ],
        })
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.rawMessage || "Cannot update policy, please try again.",
        })
      },
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

  const handleAddPolicyNote = () => {
    openPolicyNoteModal({
      title: "Add policy note",
      initialValue: "",
      confirmText: "Add Note",
      onConfirm: async (policyNote: string) => {
        await updatePolicyMutation.mutateAsync({
          teamId,
          policyNote,
        })
      },
    })
  }

  const handleEditPolicyNote = () => {
    openPolicyNoteModal({
      title: "Edit policy note",
      initialValue: credit?.policyNote || "",
      confirmText: "Save Changes",
      onConfirm: async (policyNote: string) => {
        await updatePolicyMutation.mutateAsync({
          teamId,
          policyNote,
        })
      },
    })
  }

  const handleDeletePolicyNote = () => {
    openConfirmModal({
      title: "Delete policy note",
      description:
        "Are you sure you want to delete this policy note? This action cannot be undone.",
      type: "error",
      confirmText: "Confirm Delete",
      onConfirm: async () => {
        await updatePolicyMutation.mutateAsync({
          teamId,
          clearPolicyNote: true,
        })
        onClose()
      },
    })
  }

  const handleUploadFilesToCloud = async (
    uppyInstance: any,
  ): Promise<ProtoFile[]> => {
    const formFiles: ProtoFile[] = []
    mediaIds.current = []
    const uppyFiles = uppyInstance.getFiles()

    if (!uppyFiles?.length) return formFiles

    const uploadPromises = uppyFiles.map(async (file: any) => {
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

        uppyInstance.setFileState(file.id, {
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

  const handleUploadFiles = () => {
    openUploadFileModal({
      title: "Upload policy files",
      confirmText: "Upload Files",
      onConfirm: async (uppyInstance) => {
        try {
          toast({
            title: "Uploading files...",
            description: "Please wait while we upload your files.",
          })

          const uploadedFiles = await handleUploadFilesToCloud(uppyInstance)
          await uppyInstance.upload()

          await updatePolicyMutation.mutateAsync({
            teamId,
            newFiles: uploadedFiles,
          })

          toast({
            variant: "success",
            title: "Success",
            description: "Files uploaded successfully!",
          })
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: "Failed to upload files. Please try again.",
          })
        }
      },
    })
  }

  const handleDeleteFile = (file: Credit_Attachment) => {
    openConfirmModal({
      title: "Delete Attachment",
      description: `Are you sure you want to delete "${file.fileName}"? This action cannot be undone.`,
      type: "error",
      confirmText: "Confirm Delete",
      onConfirm: async () => {
        await updatePolicyMutation.mutateAsync({
          teamId,
          deletedFileIds: [file.fileId],
        })
        onClose()
      },
    })
  }

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
      <Accordion
        collapsible
        type="single"
        defaultValue="item-1"
        className=" AccordionRoot border p-4 rounded-lg space-y-4 bg-secondary/10"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="text-lg font-bold text-center">
                Policy & Supporting Documents{" "}
                <Badge variant={"success"}>
                  {credit?.files.length}{" "}
                  {credit?.files.length === 1 ? "file" : "files"}
                </Badge>
              </span>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            {/* View policy note */}
            {credit?.policyNote ? (
              <div className="space-y-2 mb-8">
                <div className="flex items-center justify-between">
                  <p className=" font-bold">Policy Note</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditPolicyNote}
                      disabled={updatePolicyMutation.isPending}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit Note
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeletePolicyNote}
                      disabled={updatePolicyMutation.isPending}
                      className="text-red-600"
                    >
                      <Trash className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="w-full border p-2 rounded-lg">
                  {credit?.policyNote}
                </p>
              </div>
            ) : (
              <div className="w-full text-center space-y-2 border p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  No policy note provided yet.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddPolicyNote}
                  disabled={updatePolicyMutation.isPending}
                  loading={updatePolicyMutation.isPending}
                  className=" border rounded-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Policy Note
                </Button>
              </div>
            )}
            {/* View policy attachments */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center justify-between">
                <p className=" font-bold">Attachments</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className=" border rounded-lg cursor-pointer"
                  onClick={handleUploadFiles}
                  disabled={
                    updatePolicyMutation.isPending ||
                    uploadTeamMediaMutation.isPending ||
                    uploadTeamDocumentMutation.isPending
                  }
                >
                  <Plus className="w-4 h-4" /> Upload More Files
                </Button>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {(credit?.files || []).map((file) => (
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
                        {file.fileName.length > 20 ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="font-medium w-fit">
                                {formatShortenText(file.fileName, 12, 8)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>{file.fileName}</TooltipContent>
                          </Tooltip>
                        ) : (
                          <p className="truncate font-medium">
                            {file.fileName}
                          </p>
                        )}
                        <div>
                          <p className="text-sm text-gray-500">
                            Uploaded by {file.createdBy} on{" "}
                            {formatDateString(
                              file.createdAt?.toDate() || new Date(),
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
                        onClick={() => handleDownload(file.fileId)}
                        variant="ghost"
                        size="sm"
                        className="p-2"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteFile(file)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <ModalPolicyNote />
      <ModalUploadFile />
    </>
  )
}

export default PolicySection
