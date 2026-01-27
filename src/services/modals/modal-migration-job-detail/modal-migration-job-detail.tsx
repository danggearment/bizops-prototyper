import {
  MigrationStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import {
  MigrationDataTypeLabel,
  MigrationStatusLabel,
} from "@/constants/migration"
import { useQueryMigration } from "@/services/connect-rpc/transport"
import {
  Migration_DataType,
  Migration_Job,
  Migration_Job_Phase,
  Migration_Job_Result,
  Migration_Job_Status,
} from "@/services/connect-rpc/types"
import { staffGetMigrationJob } from "@gearment/nextapi/api/migration/v1/migration-MigrationOperationAPI_connectquery"
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gearment/ui3"
import {
  CheckCircle,
  CircleArrowDown,
  CircleArrowUp,
  CircleX,
  Clock,
  Loader2,
} from "lucide-react"
import { useMigrationJobDetailModal } from "./modal-migration-job-detail-store"

export function ModalMigrationJobDetail() {
  const { open, onClose, migrationJob } = useMigrationJobDetailModal()

  // Fetch detailed job data using staffGetMigrationJob API
  const {
    data: detailedMigrationJob,
    isLoading,
    error,
  } = useQueryMigration(
    staffGetMigrationJob,
    {
      // Create a composite query based on available fields
      // Note: Adjust this parameter based on actual API requirements
      jobId: (migrationJob as Migration_Job)?.jobId,
    },
    {
      enabled: open && !!migrationJob,
    },
  )

  if (!open) return null

  // Use detailed data if available, fallback to basic data
  const jobData = detailedMigrationJob?.item || migrationJob

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Migration Job Details</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading migration job details...</span>
          </div>
        )}

        {error && (
          <div className="py-4">
            <DialogDescription className="text-red-600">
              Failed to load migration job details: {error.message}
            </DialogDescription>
          </div>
        )}

        {jobData && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Migration Type
                </label>
                <p className="mt-1">
                  {
                    MigrationDataTypeLabel[
                      jobData.dataType as Migration_DataType
                    ]
                  }
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <div className="mt-1">
                  <Badge
                    variant={mappingColor<Migration_Job_Status>(
                      MigrationStatusColorsMapping,
                      jobData.status as Migration_Job_Status,
                    )}
                  >
                    {
                      MigrationStatusLabel[
                        jobData.status as Migration_Job_Status
                      ]
                    }
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Customer ID
                </label>
                <p className="mt-1">{jobData.input?.cusId || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Staff ID
                </label>
                <p className="mt-1">{jobData.staffId || "N/A"}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Progress Metrics</h3>

              <div className="grid grid-cols-2 gap-6">
                {/* Extracted Metrics */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Extracted Data
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CircleArrowUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Completed:{" "}
                        {String(jobData.completedExtractedCount || 0)}/
                        {String(jobData.totalExtractedCount || 0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CircleX className="w-4 h-4 text-red-500" />
                      <span className="text-sm">
                        Failed: {String(jobData.failedExtractedCount || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Loaded Metrics */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Loaded Data
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CircleArrowDown className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Completed: {String(jobData.completedLoadedCount || 0)}/
                        {String(jobData.totalLoadedCount || 0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CircleX className="w-4 h-4 text-red-500" />
                      <span className="text-sm">
                        Failed: {String(jobData.failedLoadedCount || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Created At
                </label>
                <p className="mt-1 text-sm">
                  {jobData.createdAt?.toDate().toLocaleString() || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Updated At
                </label>
                <p className="mt-1 text-sm">
                  {jobData.updatedAt?.toDate().toLocaleString() || "N/A"}
                </p>
              </div>
            </div>

            {/* Results Details */}
            {jobData.results && jobData.results.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Migration Results</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Phase</TableHead>
                        <TableHead className="w-[100px]">Function</TableHead>
                        <TableHead className="text-center w-[80px]">
                          Total
                        </TableHead>
                        <TableHead className="w-[140px]">Timeline</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobData.results.map(
                        (result: Migration_Job_Result, index: number) => (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {result.phase ===
                                Migration_Job_Phase.EXTRACT ? (
                                  <CircleArrowUp className="w-4 h-4 text-blue-500" />
                                ) : result.phase ===
                                  Migration_Job_Phase.LOAD ? (
                                  <CircleArrowDown className="w-4 h-4 text-purple-500" />
                                ) : (
                                  <Clock className="w-4 h-4 text-gray-500" />
                                )}
                                <span className="text-sm font-medium">
                                  {Migration_Job_Phase[result.phase]}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div
                                className="max-w-[200px] truncate"
                                title={result.functionName}
                              >
                                <span className="text-sm">
                                  {result.functionName || "N/A"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="font-medium">
                                {Number(result.totalCount) || 0}
                              </span>
                              <div>
                                (
                                <span className="font-medium text-green-600">
                                  {Number(result.completedCount) || 0}
                                </span>
                                /
                                <span className="font-medium text-blue-600">
                                  {Number(result.convertedCount) || 0}
                                </span>
                                /
                                <span className="font-medium text-red-600">
                                  {Number(result.failedCount) || 0}
                                </span>
                                )
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-gray-500">
                                {result.createdAt
                                  ? result.createdAt.toDate().toLocaleString()
                                  : "N/A"}
                              </span>
                              <br />
                              <span className="text-xs text-gray-500">
                                {result.updatedAt
                                  ? result.updatedAt.toDate().toLocaleString()
                                  : "N/A"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                {Number(result.failedCount) > 0 ? (
                                  <div
                                    title="Has failures"
                                    className="flex items-center gap-2"
                                  >
                                    {result.errorMessage && (
                                      <span className="mt-1 p-1 bg-red-50 border border-red-200 rounded text-xs">
                                        <span
                                          className="text-red-600"
                                          title={result.errorMessage}
                                        >
                                          Error:{" "}
                                          {result.errorMessage.length > 50
                                            ? `${result.errorMessage.substring(0, 50)}...`
                                            : result.errorMessage}
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div title="Success">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Error Information */}
            {jobData.error && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Error Details
                </label>
                <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{jobData.error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
