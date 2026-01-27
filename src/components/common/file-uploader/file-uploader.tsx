import { ACCEPT_FILE } from "@/constants/accept-file"
import { MyUppy, MyUppyFile, uploader } from "@/services/uploader/uppy"
import useUppy from "@/services/uploader/useUppy"
import { Button, cn, LoadingProgress, toast } from "@gearment/ui3"
import { defaultOptions } from "@uppy/core/lib/Restricter"
import DropTarget from "@uppy/drop-target"
import { FileIcon, TrashIcon, UploadIcon } from "lucide-react"
import { ChangeEvent, useEffect, useId, useRef } from "react"

interface Props {
  uppyId: string
  files: MyUppyFile[] | undefined
  setFiles: React.Dispatch<React.SetStateAction<MyUppyFile[] | undefined>>
  allowedFileTypes?: string[]
  uploadText?: React.ReactNode
  supportText?: React.ReactNode
  onCheckFile?: (file: File) => void
  defaultImage?: string
  onDelete?: () => void
  onDeleteFile?: () => void
  isPrefixName?: boolean
  truncateFileName?: boolean
  maxFileNameLength?: number
}

function DefaultUploadText() {
  return (
    <p className="mt-4 body-medium hidden md:block">
      Upload or drag a file here
    </p>
  )
}

function DefaultSupportText() {
  return (
    <>
      Only <strong>PNG</strong> and <strong>JPG</strong> files are supported,
      with a maximum size of <strong>10MB</strong>
    </>
  )
}

export default function FileUploader({
  uppyId,
  files,
  setFiles,
  allowedFileTypes = ACCEPT_FILE,
  uploadText = <DefaultUploadText />,
  supportText = <DefaultSupportText />,
  onCheckFile,
  onDelete,
  onDeleteFile,
  isPrefixName = true,
  truncateFileName = false,
  maxFileNameLength = 40,
}: Props) {
  const targetId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const uppyRef = useRef<MyUppy | null>(null)
  const progressRef = useRef<HTMLDivElement | null>(null)
  const [uploading] = useUppy(uppyId)

  useEffect(() => {
    const target = document.getElementById(targetId)

    if (target) {
      const uppy = uploader.getOrCreateUppy(uppyId, {
        restrictions: {
          ...defaultOptions,
          allowedFileTypes,
          maxNumberOfFiles: 1,
        },
      })
      uppyRef.current = uppy
      const uniqueId = new Date().getTime()

      uppy.use(DropTarget, {
        id: uniqueId.toString(),
        target: target,
        onDrop: () => {},
      })

      uploader.on(uppyId, "progress", (progress) => {
        if (progressRef.current) {
          progressRef.current.innerHTML = progress.toString()
        }
      })

      uploader.on(uppyId, "files-added", (files) => {
        setFiles(files)
      })

      uploader.on(uppyId, "restriction-failed", (_, error) => {
        toast({
          variant: "destructive",
          title: "File restriction",
          description: error.message,
        })
      })
    }
    return () => {
      uploader.off(uppyId)
    }
  }, [])

  const checkFile = (file: File) => {
    if (file.size > 1024 * 1024 * 10) {
      toast({
        variant: "destructive",
        title: "File size",
        description: " File size need < 10MB",
      })
    }
    return file.size > 1024 * 1024 * 10
  }

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files?.length) {
      const hasError = Array.from(files).some(onCheckFile ?? checkFile)
      if (hasError) return
      // just clear files before add new file
      handleClearFiles()
      uppyRef.current?.addFiles(
        Array.from(files).map((file) => {
          const uniqueId = new Date().getTime()
          const fileName = isPrefixName ? `${uniqueId}_${file.name}` : file.name
          return {
            type: file.type,
            name: fileName,
            data: file,
            source: "Input",
          }
        }),
      )
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }
  const handleClearFiles = () => {
    setFiles(undefined)
    const files = uppyRef.current?.getFiles()
    if (files?.length) {
      Array.from(files).forEach((file) => {
        uppyRef.current?.removeFile(file.id)
      })
    }
    onDelete && onDelete()
  }

  const handleClearFile = (file: MyUppyFile) => {
    setFiles((prev) => prev?.filter((f) => f.id !== file.id))
    uppyRef.current?.removeFile(file.id)
    onDeleteFile && onDeleteFile()
  }

  const getFileNameParts = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf(".")
    const hasExtension = lastDotIndex > 0 && lastDotIndex < fileName.length - 1

    if (hasExtension) {
      return {
        nameWithoutExt: fileName.substring(0, lastDotIndex),
        extension: fileName.substring(lastDotIndex),
        hasExtension: true,
      }
    }

    return {
      nameWithoutExt: fileName,
      extension: "",
      hasExtension: false,
    }
  }

  const calculateTruncationParts = (availableLength: number) => {
    const ELLIPSIS_LENGTH = 3 // "..." length
    const START_RATIO = 0.6 // 60% for start, 40% for end

    const startChars = Math.floor(availableLength * START_RATIO)
    const endChars = availableLength - startChars - ELLIPSIS_LENGTH

    return { startChars, endChars }
  }

  const truncateWithEllipsis = (
    text: string,
    startChars: number,
    endChars: number,
  ) => {
    const start = text.substring(0, startChars)
    const end = text.substring(text.length - endChars)
    return `${start}...${end}`
  }

  const truncateFileNameUtil = (
    fileName: string,
    maxLength: number,
  ): string => {
    if (!truncateFileName || fileName.length <= maxLength) {
      return fileName
    }

    const { nameWithoutExt, extension, hasExtension } =
      getFileNameParts(fileName)

    if (hasExtension) {
      const availableForName = maxLength - extension.length - 3 // Reserve 3 chars for "..."

      if (nameWithoutExt.length > availableForName && availableForName > 0) {
        const { startChars, endChars } =
          calculateTruncationParts(availableForName)
        const truncatedName = truncateWithEllipsis(
          nameWithoutExt,
          startChars,
          endChars,
        )
        return `${truncatedName}${extension}`
      }
    }

    const { startChars, endChars } = calculateTruncationParts(maxLength)
    return truncateWithEllipsis(fileName, startChars, endChars)
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      {!files?.length && (
        <>
          <div
            id={targetId}
            className={cn(
              "relative flex-1 flex justify-center items-center gap-3 overflow-hidden cursor-pointer",
              "bg-gray-1 border-dashed border-border border rounded-xl ",
            )}
            onClick={() => {
              if (!uploading) {
                inputRef.current?.click()
              }
            }}
          >
            <div className="p-[30px] text-center">
              <UploadIcon width={24} height={24} className="mx-auto" />
              {uploadText}
            </div>

            {uploading && (
              <div className="absolute top-0 left-0 w-full h-full bg-gray-2/80 flex items-center justify-center">
                <LoadingProgress ref={progressRef} showProgress />
              </div>
            )}

            <input
              onChange={handleChangeFile}
              hidden
              ref={inputRef}
              type="file"
              multiple
              accept={allowedFileTypes.join(",")}
            />
          </div>
          {supportText && <p className="mt-2 body-small">{supportText}</p>}
        </>
      )}
      {files &&
        files.length > 0 &&
        files.map((file) => (
          <div
            key={file.id}
            className={cn(
              " p-6 flex items-center border shadow-1 gap-6 rounded-xl ",
            )}
          >
            <div>
              <FileIcon />
            </div>
            <div className="w-full">
              <div>
                {truncateFileNameUtil(file.name || "", maxFileNameLength)}
              </div>
              <div className="body-small">
                {((file.size ?? 0) / 1024).toFixed(2)}kb
              </div>
            </div>
            <div>
              <Button onClick={() => handleClearFile(file)} variant={"ghost"}>
                <TrashIcon className="w-6 h-6" />
              </Button>
            </div>
          </div>
        ))}
    </div>
  )
}
