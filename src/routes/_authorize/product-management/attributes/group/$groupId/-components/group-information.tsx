import { AttributeGroupStatusLabel } from "@/constants/attributes"
import {
  AttributeGroupStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import { Badge } from "@gearment/ui3"
import { FolderTreeIcon } from "lucide-react"
import { useAttributeGroupValue } from "../-attribute-group-value-context"

export default function GroupInformation() {
  const { attributeGroupDetail } = useAttributeGroupValue()
  const { attrName, attrDescription, status } = attributeGroupDetail
  return (
    <div className="space-y-4 p-4 rounded-md bg-background">
      <div className="flex items-center gap-2">
        <FolderTreeIcon />
        <div className="text-md font-medium">{attrName}</div>
        <Badge
          variant={mappingColor(AttributeGroupStatusColorsMapping, status)}
        >
          {AttributeGroupStatusLabel[status]}
        </Badge>
      </div>
      {attrDescription && (
        <div className="space-y-1">
          <p className="font-medium">Description</p>
          <p className="text-sm text-muted-foreground">{attrDescription}</p>
        </div>
      )}
    </div>
  )
}
