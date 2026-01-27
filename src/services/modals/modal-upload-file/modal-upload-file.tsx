import FileUploader from "@/components/common/file-uploader/file-uploader"
import { ACCEPT_FILE_IMAGE_PDF } from "@/constants/accept-file"
import { MyUppyFile, uploader } from "@/services/uploader/uppy"
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@gearment/ui3"
import { useId, useMemo, useState } from "react"
import { useUploadFileModal } from "./modal-upload-file-store"

export function ModalUploadFile() {
  const { open, onClose, title, confirmText, onConfirm } = useUploadFileModal()
  const [files, setFiles] = useState<MyUppyFile[] | undefined>()
  const [loading, setLoading] = useState(false)
  const uppyId = useId()

  const uppyInstance = useMemo(() => uploader.getOrCreateUppy(uppyId), [uppyId])

  const handleConfirm = async () => {
    if (!files?.length) return

    const isAsync = onConfirm.constructor.name === "AsyncFunction"

    try {
      if (isAsync) {
        setLoading(true)
        await onConfirm(uppyInstance)
      } else {
        onConfirm(uppyInstance)
      }
      // Clear files after successful upload
      setFiles(undefined)
      onClose()
    } catch (error) {
      console.error("Error uploading files:", error)
    } finally {
      if (isAsync) {
        setLoading(false)
      }
    }
  }

  const handleClose = () => {
    onClose()
    setFiles(undefined)
    const uppyFiles = uppyInstance.getFiles()
    if (uppyFiles?.length) {
      uppyFiles.forEach((file: any) => {
        uppyInstance.removeFile(file.id)
      })
    }
  }

  const handleDeleteFiles = () => {
    setFiles(undefined)
  }

  const isDisabled = !files?.length || loading

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="font-medium">
            Select Files<span className="text-red-500">*</span>
          </div>
          <div className="max-w-full overflow-hidden">
            <FileUploader
              uppyId={uppyId}
              files={files}
              setFiles={setFiles}
              allowedFileTypes={ACCEPT_FILE_IMAGE_PDF}
              supportText="Images (PNG, JPG) and PDF files up to 10 MB allowed."
              uploadText="Click to upload or drag files here"
              isPrefixName={false}
              truncateFileName={true}
              maxFileNameLength={30}
              onDelete={handleDeleteFiles}
            />
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              disabled={isDisabled}
              loading={loading}
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
