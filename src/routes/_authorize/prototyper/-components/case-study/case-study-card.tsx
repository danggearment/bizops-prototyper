import { Button, Card, CardContent, CardHeader, CardTitle } from "@gearment/ui3"
import { Pencil, Trash2, ExternalLink } from "lucide-react"
import type { CaseStudyType } from "../table/columns"

interface CaseStudyCardProps {
  caseStudy: CaseStudyType
  onEdit: (caseStudy: CaseStudyType) => void
  onDelete: (id: string) => void
}

export default function CaseStudyCard({
  caseStudy,
  onEdit,
  onDelete,
}: CaseStudyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={caseStudy.thumbnail}
          alt={caseStudy.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">
          {caseStudy.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {caseStudy.description}
        </p>
        <div className="flex items-center gap-2">
          <Button size="sm" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button size="sm" variant="outline" onClick={() => onEdit(caseStudy)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(caseStudy.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
