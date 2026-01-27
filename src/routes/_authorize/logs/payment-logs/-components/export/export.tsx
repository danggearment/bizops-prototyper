import {
  useExportPaymentLogsCriteriaMutation,
  usePaymentLogsQuery,
} from "@/data-center/payment-logs"
import { FileAttachmentOrMessageResponse_File } from "@gearment/nextapi/common/type/v1/file_pb"
import {
  Button,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { useSearch } from "@tanstack/react-router"
import { DownloadIcon, InfoIcon } from "lucide-react"
import { getFilter } from "../../-helper"

export default function Export() {
  const { mutateAsync: exportPaymentLogsCriteria, isPending } =
    useExportPaymentLogsCriteriaMutation()

  const search = useSearch({
    from: "/_authorize/logs/payment-logs/",
  })
  const { filter, sortCriterion, pagination } = getFilter(search)
  const { data } = usePaymentLogsQuery({
    pagination,
    filter,
    sortCriterion,
  })

  function downloadPaymentLogsFile(file: FileAttachmentOrMessageResponse_File) {
    const blob = new Blob([file.data], { type: file.contentType })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.fileName
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 0)
  }

  const handleExportPaymentLogsCriteria = async () => {
    const response = await exportPaymentLogsCriteria(
      {
        filter,
        sortCriterion,
      },
      {
        onError: (error) => {
          toast({
            variant: "error",
            title: "Export payment logs",
            description: error.rawMessage,
          })
        },
      },
    )

    if (response.data.case === "message") {
      toast({
        variant: "info",
        title: "Export payment logs",
        description: response.data.value.message,
      })
    }
    if (response.data.case === "file") {
      downloadPaymentLogsFile(response.data.value)
    }
  }
  const disabled = Number(data?.pagination?.total ?? 0) === 0 || isPending

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoIcon className="w-4 h-4" />
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px]">
          The export will always include data from the most recent 6 months.
        </TooltipContent>
      </Tooltip>
      <Button
        loading={isPending}
        disabled={disabled}
        variant="outline"
        onClick={handleExportPaymentLogsCriteria}
      >
        <DownloadIcon />
        Export
      </Button>
    </div>
  )
}
