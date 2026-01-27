import { File } from "@gearment/nextapi/common/type/v1/file_pb"
import {
  BizIcons,
  ButtonIconCopy,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"

export default function CellTrackingNumber({
  labelFile,
  trackingNo,
  trackingUrl,
  trackingCarrier,
  trackingService,
}: {
  labelFile: File | null
  trackingNo: string
  trackingUrl: string
  trackingCarrier: string
  trackingService: string
}) {
  if (!trackingNo) {
    return <div className="text-center">--</div>
  }
  return (
    <ul className="space-y-1">
      <li>
        {labelFile && (
          <div className="w-fit">
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  className="text-primary"
                  href={labelFile.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BizIcons.Pdf className="size-5" />
                </a>
              </TooltipTrigger>
              <TooltipContent>View Label (PDF)</TooltipContent>
            </Tooltip>
          </div>
        )}
      </li>
      <li>
        {trackingUrl ? (
          <div className="flex items-center gap-1">
            <a
              className="text-primary flex items-center gap-1"
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {trackingNo || "--"}
            </a>
            <ButtonIconCopy size="sm" copyValue={trackingNo} />
          </div>
        ) : (
          "--"
        )}
      </li>
      <li>
        {[trackingCarrier, trackingService].filter(Boolean).join(" / ") || "--"}
      </li>
    </ul>
  )
}
