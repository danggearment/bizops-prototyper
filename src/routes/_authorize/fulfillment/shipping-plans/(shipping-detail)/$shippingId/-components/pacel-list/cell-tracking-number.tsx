import { ShippingParcel } from "@gearment/nextapi/api/ffm/v1/cross_dock_pb"
import { formatShortenText } from "@gearment/utils"
import { Row } from "@tanstack/react-table"
import { ExternalLinkIcon } from "lucide-react"

export default function CellTrackingNumber({
  row,
}: {
  row: Row<ShippingParcel>
}) {
  if (!row.original.trackingInfo) {
    return <div className="text-center">--</div>
  }
  return (
    <ul className="gap-2">
      <li>
        {row.original.trackingInfo?.labelUrl ? (
          <a
            className="text-primary flex items-center gap-2"
            href={row.original.trackingInfo?.labelUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {formatShortenText(row.original.trackingInfo?.labelUrl)}
            <ExternalLinkIcon size={14} />
          </a>
        ) : (
          "--"
        )}
      </li>
      <li>
        {row.original.trackingInfo?.trackingUrl ? (
          <a
            className="text-primary flex items-center gap-2"
            href={row.original.trackingInfo?.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.original.trackingInfo?.trackingNumber}
            <ExternalLinkIcon size={14} />
          </a>
        ) : (
          "--"
        )}
      </li>
      <li>
        {row.original.trackingInfo?.trackingCarrier || "--"} -{" "}
        {row.original.trackingInfo?.trackingService || "--"}
      </li>
    </ul>
  )
}
