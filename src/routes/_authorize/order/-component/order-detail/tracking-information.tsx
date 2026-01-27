import { formatDateString } from "@/utils"
import { DownloadIcon, PrinterIcon } from "lucide-react"

import {
  Badge,
  BoxEmpty,
  ButtonIconCopy,
  LogItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"

import { handleDownloadPDF } from "@/routes/_authorize/order/-helper.ts"
import {
  Order_OrderTracking,
  Order_TrackingType,
} from "@/services/connect-rpc/types"

interface Props {
  orderTrackings: Order_OrderTracking[]
}

export default function TrackingInformation({ orderTrackings }: Props) {
  return (
    <div>
      <h5 className="heading-5 mb-2">Tracking Information</h5>
      {orderTrackings.length === 0 && <BoxEmpty description="No data" />}

      <div className="overflow-auto max-h-[200px]">
        {orderTrackings.map((data, index) => (
          <LogItem
            key={index}
            content={
              <div className="text-base space-y-2 mb-2">
                <div className="flex-1">
                  <a
                    href={data.trackingUrl}
                    target="_blank"
                    className="text-primary flex items-center gap-2"
                    rel="noreferrer"
                  >
                    {data.trackingNo}
                    {data.trackingType === Order_TrackingType.PRIMARY && (
                      <Badge className="bg-primary  text-primary-foreground">
                        Primary
                      </Badge>
                    )}
                  </a>
                  <p className="mt-1 text-base">
                    {`${data.carrier || "--"}`} • {`${data.service || "--"}`} •{" "}
                    {`${data.type || "--"}`}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <ButtonIconCopy size={"sm"} copyValue={data.trackingNo} />
                  <Tooltip>
                    <TooltipTrigger>
                      <a
                        href={data.labelFile?.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <PrinterIcon width={16} height={16} />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>Print tracking label</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() =>
                          handleDownloadPDF(
                            data.labelFile?.fileUrl || "",
                            data.labelFile?.fileName,
                          )
                        }
                      >
                        <DownloadIcon width={16} height={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Download tracking label</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            }
            time={
              data.trackingUpdatedAt
                ? formatDateString(data.trackingUpdatedAt?.toDate())
                : ""
            }
          />
        ))}
      </div>
    </div>
  )
}
