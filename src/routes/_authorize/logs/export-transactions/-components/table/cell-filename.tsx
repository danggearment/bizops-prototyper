import { useMutationStudio } from "@/services/connect-rpc/transport"
import { TransactionExportSession } from "@/services/connect-rpc/types"
import { truncateWithEllipsis } from "@/utils/format-string"
import { userDownloadTeamMedia } from "@gearment/nextapi/api/studio/v1/media-MediaManagement_connectquery"
import { toast } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"
import { DownloadIcon } from "lucide-react"

interface Props extends CellContext<TransactionExportSession, any> {}

export default function CellFilename(props: Props) {
  const exportOrder = props.row.original
  const { fileName, id, path } = exportOrder

  const mutationDownloadFileExportOrder = useMutationStudio(
    userDownloadTeamMedia,
    {
      onSuccess: (res) => {
        window.open(res.mediaUrl)
        toast({
          title: "Download export order",
          description: `Download ${fileName} successfully`,
        })
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Download export order",
          description: error.rawMessage,
        })
      },
    },
  )

  const handleDownload = async (key: string) => {
    await mutationDownloadFileExportOrder.mutateAsync({
      mediaKey: key,
    })
  }

  return (
    <div>
      <p className="body-small text-secondary-text">{id}</p>
      {fileName && path && (
        <button
          className="block text-left text-primary"
          onClick={() => handleDownload(path)}
        >
          {truncateWithEllipsis(fileName, 30)}
          <DownloadIcon width={16} height={16} className="inline ml-1" />
        </button>
      )}
    </div>
  )
}
