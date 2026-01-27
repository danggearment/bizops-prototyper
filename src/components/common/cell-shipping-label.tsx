import { Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"
import { formatShortenText } from "@gearment/utils"
import { ExternalLinkIcon } from "lucide-react"

export default function CellShippingLabel({
  fileUrl,
  fileName,
}: {
  fileUrl: string
  fileName: string
}) {
  if (!fileName) {
    return <div className="text-center">--</div>
  }
  return (
    <ul className="gap-2">
      <li>
        {fileUrl ? (
          fileName.length > 20 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  className="text-primary flex items-center gap-1 w-fit"
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formatShortenText(fileName, 12, 8)}
                  <ExternalLinkIcon className="w-4 h-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent>{fileName}</TooltipContent>
            </Tooltip>
          ) : (
            <a
              className="text-primary flex items-center gap-1 w-fit"
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {fileName}
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
          )
        ) : (
          "--"
        )}
      </li>
    </ul>
  )
}
