import {
  mappingColor,
  PrintLocationStatusColorsMapping,
} from "@/constants/map-color"
import { PrintLocationStatusLabel } from "@/constants/prints"
import { Badge } from "@gearment/ui3"
import { usePrintLocationDetail } from "../-print-location-detail-context"

export function LocationInformation() {
  const { printLocationDetail } = usePrintLocationDetail()
  const { name, code, status, description } = printLocationDetail

  return (
    <div className="space-y-4 p-4 rounded-md bg-background">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold">{name}</p>
          <Badge
            variant={mappingColor(PrintLocationStatusColorsMapping, status)}
          >
            {PrintLocationStatusLabel[status]}
          </Badge>
        </div>
        <div className="text-muted-foreground">Print location code: {code}</div>
      </div>
      <div className="space-y-1">
        <p className="font-medium text-muted-foreground">Description</p>
        <p>{description || "--"}</p>
      </div>
    </div>
  )
}
