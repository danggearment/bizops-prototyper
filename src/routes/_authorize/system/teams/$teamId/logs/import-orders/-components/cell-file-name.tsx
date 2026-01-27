import { useMutationStudio } from "@/services/connect-rpc/transport"
import { OrderAdmin_OrderDraftImportSession } from "@gearment/nextapi/api/pod/v1/admin_api_type_pb"
import { staffDownloadTeamMedia } from "@gearment/nextapi/api/studio/v1/media_admin-MediaAdminManagement_connectquery"
import {
  Button,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { formatShortenText } from "@gearment/utils"
import { CellContext } from "@tanstack/react-table"
import { DownloadIcon } from "lucide-react"
import { ReactNode } from "react"

interface Props extends CellContext<OrderAdmin_OrderDraftImportSession, any> {
  children?: ReactNode
}

export default function CellTeamName(props: Props) {
  const id = props.row.original.id.toString()
  const fileName = formatShortenText(props.row.original.fileName)
  const path = props.row.original.path

  const mutation = useMutationStudio(staffDownloadTeamMedia, {
    onSuccess: (res) => {
      window.open(res.mediaUrl)
      toast({
        variant: "success",
        title: "Download import order",
        description: `Download ${fileName} successfully`,
      })
    },
  })

  const handleDownload = async (key: string) => {
    await mutation.mutateAsync({
      mediaKey: key,
    })
  }

  return (
    <div>
      {fileName.length > 20 ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="cursor-pointer whitespace-nowrap hover:text-primary p-0"
              onClick={() => handleDownload(path)}
              variant="link"
              size="sm"
            >
              {formatShortenText(fileName, 12, 8)}
              <DownloadIcon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{fileName}</TooltipContent>
        </Tooltip>
      ) : (
        <Button
          className="cursor-pointer whitespace-nowrap hover:text-primary p-0"
          onClick={() => handleDownload(path)}
          variant="link"
          size="sm"
        >
          {fileName}
          <DownloadIcon size={16} />
        </Button>
      )}
      <div
        className={"body-sm flex px-2.5 items-center gap-1 text-foreground/50"}
      >
        <span>#{id}</span>
      </div>
    </div>
  )
}
