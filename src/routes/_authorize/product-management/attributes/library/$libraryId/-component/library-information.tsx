import { AttributeGroupValueStatusLabel } from "@/constants/attributes"
import {
  AttributeGroupValueStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import { Badge } from "@gearment/ui3"
import { useAttributeLibraryDetail } from "../-attribute-library-detail-context"

export function LibraryInformation() {
  const { attributeLibraryDetail } = useAttributeLibraryDetail()
  const { attrValue, attrCode, status, description, groups } =
    attributeLibraryDetail

  return (
    <div className="space-y-4 p-4 rounded-md bg-background">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold">{attrValue}</p>
          <Badge
            variant={mappingColor(
              AttributeGroupValueStatusColorsMapping,
              status,
            )}
          >
            {AttributeGroupValueStatusLabel[status]}
          </Badge>
        </div>
        <div className="text-muted-foreground">Code: {attrCode}</div>
      </div>
      <div className="space-y-1">
        <p className="font-medium text-muted-foreground">Description</p>
        <p>{description || "--"}</p>
      </div>
      <div className="space-y-1">
        <p className="font-medium text-muted-foreground">Groups</p>
        <div>
          {groups.length > 0 ? (
            <div className="flex items-center gap-1">
              {groups.map((group) => (
                <div
                  key={group.attrKey}
                  className="text-sm py-1 px-4 rounded-full text-primary font-semibold bg-primary/10 border border-primary"
                >
                  {group.attrName}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm py-1 px-4 rounded-full font-semibold bg-sidebar-accent text-foreground/50 border border-transparent">
              Ungrouped
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
