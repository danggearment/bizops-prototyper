import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from "@gearment/ui3"
import { FileText, ExternalLink } from "lucide-react"
import { format } from "date-fns"

interface CaseStudy {
  id: string
  title: string
  description: string
  status: "success" | "failed" | "pending"
  createdAt: string
  updatedAt: string
  testResults?: {
    passed: number
    failed: number
    total: number
  }
}

const MOCK_CASE_STUDIES: CaseStudy[] = [
  {
    id: "case-001",
    title: "Basic CRUD Operations Test",
    description:
      "Testing create, read, update, and delete operations for orders",
    status: "success",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
    testResults: {
      passed: 15,
      failed: 0,
      total: 15,
    },
  },
  {
    id: "case-002",
    title: "Filter and Search Functionality",
    description: "Validating search filters and pagination work correctly",
    status: "success",
    createdAt: "2024-01-15T14:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    testResults: {
      passed: 12,
      failed: 1,
      total: 13,
    },
  },
  {
    id: "case-003",
    title: "Bulk Actions Performance",
    description: "Testing bulk operations with large datasets",
    status: "pending",
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-16T09:00:00Z",
  },
]

interface Props {
  prototypeId: string
}

export default function CaseStudies({ prototypeId }: Props) {
  // TODO: Replace with real API hook from @gearment/nextapi
  const caseStudies = MOCK_CASE_STUDIES
  const loading = false

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading case studies...
        </CardContent>
      </Card>
    )
  }

  if (caseStudies.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No case studies available
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {caseStudies.map((caseStudy) => (
        <Card key={caseStudy.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle>{caseStudy.title}</CardTitle>
                  <Badge
                    variant={
                      caseStudy.status === "success"
                        ? "default"
                        : caseStudy.status === "failed"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {caseStudy.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {caseStudy.description}
                </p>
              </div>
              <Button size="sm" variant="ghost">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {caseStudy.testResults && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">
                    {caseStudy.testResults.total}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Passed:</span>
                  <span className="font-medium text-green-600">
                    {caseStudy.testResults.passed}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Failed:</span>
                  <span className="font-medium text-red-600">
                    {caseStudy.testResults.failed}
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                Created:{" "}
                {format(new Date(caseStudy.createdAt), "dd/MM/yyyy HH:mm")}
              </span>
              <span>
                Updated:{" "}
                {format(new Date(caseStudy.updatedAt), "dd/MM/yyyy HH:mm")}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
