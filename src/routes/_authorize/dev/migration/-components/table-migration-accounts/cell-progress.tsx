import { DateTime } from "@/components/common/date-time"
import {
  Migration_DataType,
  Migration_Job,
  Migration_Job_Status,
  Migration_Progress,
} from "@/services/connect-rpc/types"
import { useMigrationJobDetailModal } from "@/services/modals/modal-migration-job-detail/modal-migration-job-detail-store"
import {
  Badge,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Progress,
} from "@gearment/ui3"
import { ChevronDown, ChevronRight, Eye } from "lucide-react"
import { useState } from "react"

interface Props {
  progresses: Migration_Progress[]
}

export default function CellProgress({ progresses }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { setOpen } = useMigrationJobDetailModal()

  const handleViewJobDetail = (progress: Migration_Progress) => {
    // Create a mock Migration_Job object from progress data
    const mockJob = new Migration_Job({
      dataType: Migration_DataType.UNSPECIFIED,
      input: undefined,
      staffId: "",
      status: Migration_Job_Status.UNSPECIFIED,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
      error: progress.lastError,
      results: [],
      totalExtractedCount: BigInt(0),
      completedExtractedCount: BigInt(0),
      failedExtractedCount: BigInt(0),
      convertedExtractedCount: BigInt(0),
      totalLoadedCount: BigInt(progress.totalCount || 0),
      completedLoadedCount: BigInt(progress.completedCount || 0),
      failedLoadedCount: BigInt(progress.failedCount || 0),
      convertedLoadedCount: BigInt(0),
      extractJobCount: BigInt(0),
      loadJobCount: BigInt(0),
      jobId: BigInt(progress.lastJobId || 0),
    })
    setOpen({ migrationJob: mockJob })
  }

  if (!progresses || progresses.length === 0) {
    return <div className="text-sm text-gray-500">No progress data</div>
  }

  // Calculate summary metrics
  const summary = progresses.reduce(
    (acc, progress) => {
      const total = Number(progress.totalCount) || 0
      const completed = Number(progress.completedCount) || 0
      const failed = Number(progress.failedCount) || 0
      const hasError = !!progress.lastError

      return {
        totalCount: acc.totalCount + total,
        completedCount: acc.completedCount + completed,
        failedCount: acc.failedCount + failed,
        errorCount: acc.errorCount + (hasError ? 1 : 0),
        jobCount: acc.jobCount + 1,
      }
    },
    {
      totalCount: 0,
      completedCount: 0,
      failedCount: 0,
      errorCount: 0,
      jobCount: 0,
    },
  )

  const progressPercentage =
    summary.totalCount > 0
      ? (summary.completedCount / summary.totalCount) * 100
      : 0

  return (
    <div className="space-y-2">
      {/* Summary View */}
      <div className="space-y-2">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">
              {summary.completedCount}/{summary.totalCount} completed
            </span>
            <span className="text-gray-500">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            {summary.jobCount} jobs
          </Badge>

          {summary.completedCount > 0 && (
            <Badge variant="success" className="text-xs">
              {summary.completedCount} done
            </Badge>
          )}

          {summary.failedCount > 0 && (
            <Badge variant="warning" className="text-xs">
              {summary.failedCount} failed
            </Badge>
          )}

          {summary.errorCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {summary.errorCount} errors
            </Badge>
          )}
        </div>
      </div>

      {/* Expandable Detailed View */}
      {progresses.length > 0 && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
            {isExpanded ? "Hide details" : "Show details"}
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2">
            <div className="space-y-2 p-2 bg-gray-50 rounded border">
              {progresses.map((progress, index) => (
                <div
                  key={index}
                  className="text-xs border-b border-gray-200 pb-2 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700">
                      Job #{String(progress.lastJobId)}
                    </span>
                    <div className="flex items-center gap-1">
                      {Number(progress.totalCount) > 0 && (
                        <Badge variant="outline" className="text-xs py-0">
                          {String(progress.completedCount)}/
                          {String(progress.totalCount)}
                        </Badge>
                      )}
                      {Number(progress.failedCount) > 0 && (
                        <Badge variant="warning" className="text-xs py-0">
                          {String(progress.failedCount)} failed
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleViewJobDetail(progress)}
                        title="View job details"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {progress.lastError && (
                    <div className="text-red-600 bg-red-50 p-1 rounded text-xs">
                      Error:{" "}
                      {progress.lastError.length > 50
                        ? `${progress.lastError.substring(0, 50)}...`
                        : progress.lastError}
                    </div>
                  )}

                  <div className="text-gray-500 text-xs mt-1">
                    Updated:{" "}
                    {progress.updatedAt ? (
                      <DateTime date={progress.updatedAt.toDate()} />
                    ) : (
                      "N/A"
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}
