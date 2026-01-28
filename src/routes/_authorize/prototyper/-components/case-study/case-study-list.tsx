import { useState } from "react"
import { Button } from "@gearment/ui3"
import { Plus } from "lucide-react"
import { usePrototyperContext } from "../../-prototyper-context"
import CaseStudyCard from "./case-study-card"
import CaseStudyDialog from "./case-study-dialog"
import type { CaseStudyType } from "../table/columns"

export default function CaseStudyList() {
  const { caseStudies, deleteCaseStudy } = usePrototyperContext()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudyType | null>(null)

  const handleEdit = (caseStudy: CaseStudyType) => {
    setSelectedCaseStudy(caseStudy)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedCaseStudy(null)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this case study?")) {
      deleteCaseStudy(id)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedCaseStudy(null)
  }

  return (
    <div className="bg-background rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Case Studies</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Showcase real-world implementations and success stories
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Case Study
        </Button>
      </div>

      {caseStudies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No case studies yet</p>
          <Button variant="outline" className="mt-4" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create your first case study
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((caseStudy) => (
            <CaseStudyCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CaseStudyDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        caseStudy={selectedCaseStudy}
      />
    </div>
  )
}