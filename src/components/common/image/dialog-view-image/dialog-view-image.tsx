import { useMutationStudio } from "@/services/connect-rpc/transport"
import { staffCreateMediaSharedLink } from "@gearment/nextapi/api/studio/v1/media_admin-MediaAdminManagement_connectquery"
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  toast,
} from "@gearment/ui3"
import { DownloadIcon, EyeIcon, Link } from "lucide-react"
import { useState } from "react"
import { ImageBox, ImageContainerProps } from "../image"

export const DialogViewImage = (props: ImageContainerProps) => {
  const [open, setOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    setIsDownloading(true)
    const a = document.createElement("a")
    document.body.appendChild(a)

    // Fetch the image and convert to blob for download
    fetch(props.url + "/print")
      .then((response) => response.blob())
      .then((blob) => {
        // Create a blob URL and set it as the anchor's href
        const blobUrl = URL.createObjectURL(blob)
        a.href = blobUrl
        a.download = props.title ?? "image.png"
        a.click()

        // Clean up by revoking the blob URL
        URL.revokeObjectURL(blobUrl)
      })
      .catch((error) => {
        console.error("Error downloading image:", error)
        // Fallback to direct download if fetch fails
      })
      .finally(() => {
        document.body.removeChild(a)
        setIsDownloading(false)
      })
  }
  const handleClose = () => {
    setOpen(false)
  }

  const mutationDownloadFileDesign = useMutationStudio(
    staffCreateMediaSharedLink,
    {
      onSuccess: (data) => {
        if (data.sharedLinks && data.sharedLinks[0]) {
          window.open(data.sharedLinks[0], "_blank")
        } else {
          toast({
            variant: "error",
            title: "Download original design",
            description: "No shared link available",
          })
        }
      },
      onError: () => {
        toast({
          variant: "error",
          title: "Download original design",
          description: "Download original design error",
        })
      },
    },
  )
  const handleDownloadOriginalDesign = async () => {
    if (!props.mediaPath) {
      toast({
        variant: "error",
        title: "Download original design",
        description: "Media path is required",
      })
      return
    }

    await mutationDownloadFileDesign.mutateAsync({
      mediaInput: {
        case: "mediaPaths",
        value: {
          mediaPaths: [props.mediaPath],
        },
      },
      teamId: props.teamId,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          <ImageBox {...props} />
          <div className="hidden group-hover:flex absolute top-0 left-0 right-0 bottom-0 items-center justify-center gap-2 text-sm text-white  bg-black/50 ">
            <EyeIcon className="w-4 h-4" />
            Preview
          </div>
        </div>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "min-w-[650px] max-w-[700px] max-h-[700px] min-h-[700px] p-4",
        )}
      >
        <DialogTitle className="text-center"></DialogTitle>
        <div className="flex flex-col items-center justify-center">
          <div
            className={cn(
              "flex item-center justify-center w-[600px] h-[600px]",
            )}
          >
            <ImageBox {...props} width={600} url={props.url + "/print"} />
          </div>
        </div>
        <DialogFooter className="flex justify-end">
          {props.showOriginUrl && (
            <a href={props.originUrl} target="_blank" rel="noreferrer">
              <Button>
                <Link className="w-4 h-4" />
                Original design
              </Button>
            </a>
          )}
          {props.enableViewOriginalDesign && (
            <Button
              onClick={handleDownloadOriginalDesign}
              disabled={mutationDownloadFileDesign.isPending}
              loading={mutationDownloadFileDesign.isPending}
            >
              <EyeIcon className="w-4 h-4" />
              View original design
            </Button>
          )}
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            loading={isDownloading}
          >
            <DownloadIcon className="w-4 h-4" />
            {props.downloadTitle || "Download"}
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
