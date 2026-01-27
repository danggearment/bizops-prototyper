import { formatShortenText } from "@gearment/utils"
import { ChevronRightIcon, DownloadIcon, FileTextIcon } from "lucide-react"

import useShippingMethod from "@/hooks/use-shipping-method"
import { handleDownloadPDF } from "@/routes/_authorize/order/-helper.ts"
import { FileType } from "@/schemas/schemas/common"
import { useState } from "react"

interface Props {
  isLabelAttached: boolean
  shippingLabels?: { labelFile?: FileType }[]
  shippingMethod: string
}
export default function CellTracking({
  isLabelAttached,
  shippingLabels,
  shippingMethod,
}: Props) {
  const [viewAll, setViewAll] = useState(false)
  const { getShippingMethodName } = useShippingMethod()
  return (
    <div>
      {isLabelAttached ? (
        <div className="space-y-1">
          <FileTextIcon size={16} />
          {shippingLabels &&
            shippingLabels
              .slice(0, viewAll ? shippingLabels.length : 2)
              .map((shippingLabel) => (
                <div
                  key={shippingLabel.labelFile?.fileName}
                  className="flex items-center gap-1"
                >
                  <span className="text-primary body-extra-small whitespace-nowrap">
                    {shippingLabel.labelFile &&
                      formatShortenText(shippingLabel.labelFile.fileName)}
                  </span>
                  <button
                    onClick={() =>
                      shippingLabel.labelFile &&
                      handleDownloadPDF(
                        shippingLabel.labelFile.fileUrl,
                        shippingLabel.labelFile.fileName,
                      )
                    }
                    aria-label="download"
                  >
                    <DownloadIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          {shippingLabels && shippingLabels.length > 2 && (
            <button
              className="flex items-center gap-1 text-secondary-text hover:text-primary dark:hover:text-primary"
              onClick={() => setViewAll((prev) => !prev)}
            >
              <span className="body-extra-small">
                {viewAll ? "View less" : "View all"}
              </span>
              <ChevronRightIcon width={14} height={14} />
            </button>
          )}
        </div>
      ) : (
        <span className="body-small text-secondary-text">
          {getShippingMethodName(shippingMethod)}
        </span>
      )}
    </div>
  )
}
