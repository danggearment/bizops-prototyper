import {
  mappingColor,
  PrintTypeStatusColorsMapping,
} from "@/constants/map-color"
import { PrintTypeStatusLabel } from "@/constants/prints"
import { Badge } from "@gearment/ui3"
import { usePrintTypeDetail } from "../-print-type-detail-context"

export function TypeInformation() {
  const { printTypeDetail } = usePrintTypeDetail()
  const { name, code, status, description } = printTypeDetail

  return (
    <div className="space-y-4 p-4 rounded-md bg-background">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold">{name}</p>
          <Badge variant={mappingColor(PrintTypeStatusColorsMapping, status)}>
            {PrintTypeStatusLabel[status]}
          </Badge>
        </div>
        <div className="text-muted-foreground">Print type code: {code}</div>
      </div>
      <div className="space-y-1">
        <p className="font-medium text-muted-foreground">Description</p>
        <p>{description || "--"}</p>
      </div>
    </div>
  )
}
