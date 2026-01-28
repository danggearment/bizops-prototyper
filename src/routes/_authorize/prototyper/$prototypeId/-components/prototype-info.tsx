import { Card, CardContent, CardHeader, CardTitle } from "@gearment/ui3"
import type { PrototypeType } from "../../-components/table/columns"

interface Props {
  prototype: PrototypeType
}

export default function PrototypeInfo({ prototype }: Props) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Module Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Module Name</div>
            <div className="text-base">{prototype.moduleName}</div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Description</div>
            <div className="text-base">{prototype.description}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
            <div className="text-base capitalize">{prototype.status}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Generated Files</div>
            <div className="text-base">{prototype.files?.length || 0} files</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-base">{prototype.explanation}</div>
        </CardContent>
      </Card>
    </div>
  )
}