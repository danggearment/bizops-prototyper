import { ACCEPT_FILE } from "@/constants/accept-file"
import { MyUppy, MyUppyFile, uploader } from "@/services/uploader/uppy"
import { cn, toast } from "@gearment/ui3"
import { defaultOptions } from "@uppy/core/lib/Restricter"
import { ChangeEvent, useEffect, useRef } from "react"

interface Props {
  children?: React.ReactNode
  className?: string
  uppyId: string
  setFiles: (files: MyUppyFile[] | undefined) => void
  acceptFiles?: string[]
}

export default function FileUploadWrapper({
  children,
  className,
  uppyId,
  setFiles,
  acceptFiles,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const uppyRef = useRef<MyUppy | null>(null)

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const inputFiles = e.target.files
    if (inputFiles?.length && uppyRef.current) {
      // check file
      const hasError = Array.from(inputFiles).some((file) => {
        if (file.size > 1024 * 1024 * 10) {
          toast({
            variant: "destructive",
            title: "File size",
            description: " File size need < 10MB",
          })
        }
        return file.size > 1024 * 1024 * 10
      })
      if (hasError) return

      // remove current file
      const uppyFiles = uppyRef.current.getFiles()
      if (uppyFiles?.length) {
        Array.from(uppyFiles).forEach((file) => {
          uppyRef.current?.removeFile(file.id)
        })
      }

      // add new file
      uppyRef.current.addFiles(
        Array.from(inputFiles).map((file) => {
          return {
            type: file.type,
            name: `${file.name}`,
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

  useEffect(() => {
    const uppy = uploader.getOrCreateUppy(uppyId, {
      restrictions: {
        ...defaultOptions,
        allowedFileTypes: acceptFiles ?? ACCEPT_FILE,
        maxNumberOfFiles: 1,
        maxFileSize: 1024 * 1024 * 10,
        minFileSize: null,
        maxTotalFileSize: null,
        minNumberOfFiles: null,
        requiredMetaFields: [],
      },
    })
    uppyRef.current = uppy
    uploader.on(uppyId, "files-added", (files) => {
      setFiles(files)
    })

    return () => {
      uploader.off(uppyId)
    }
  }, [])

  return (
    <div>
      <div
        className={cn("w-fit", className)}
        onClick={() => inputRef.current?.click()}
      >
        {children}
      </div>
      <input
        hidden
        ref={inputRef}
        type="file"
        accept={(acceptFiles ?? ACCEPT_FILE).join(", ")}
        onChange={handleChangeFile}
      />
    </div>
  )
}
