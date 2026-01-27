import { CallLogEntry } from "@/schemas/schemas/call-logs"
import { formatDateString } from "@/utils/format-date"
import { Badge, Button, ButtonIconCopy } from "@gearment/ui3"
import { formatShortenText } from "@gearment/utils"
import { Link } from "@tanstack/react-router"
import { ColumnDef, flexRender } from "@tanstack/react-table"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "lucide-react"
import { CallLogDetailView } from "./call-log-detail-view"

// Helper function to get status color
const getStatusColor = (statusCode: number) => {
  if (statusCode >= 200 && statusCode < 300) return "success"
  if (statusCode >= 400 && statusCode < 500) return "warning"
  if (statusCode >= 500) return "error"
  return "secondary"
}

// Helper function to format duration
const formatDuration = (duration: number) => {
  if (duration < 1000) return `${duration}ms`
  if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`
  return `${(duration / 60000).toFixed(1)}m`
}

// Helper function to get HTTP method color
const getMethodColor = (method: string) => {
  switch (method.toUpperCase()) {
    case "GET":
      return "bg-blue-100 text-blue-800"
    case "POST":
      return "bg-green-100 text-green-800"
    case "PUT":
      return "bg-yellow-100 text-yellow-800"
    case "DELETE":
      return "bg-red-100 text-red-800"
    case "PATCH":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const columns: ColumnDef<CallLogEntry>[] = [
  {
    id: "expander",
    header: "",
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => row.toggleExpanded()}
          className="h-8 w-8 p-0"
        >
          {row.getIsExpanded() ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </Button>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: "Timestamp",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string
      return (
        <div className="text-sm">
          {formatDateString(createdAt, "MMM DD, YYYY HH:mm:ss")}
        </div>
      )
    },
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("method") as string
      return (
        <Badge
          variant="secondary"
          className={`text-xs ${getMethodColor(method)}`}
        >
          {method}
        </Badge>
      )
    },
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      const url = row.getValue<string>("url")
      return (
        <div className="flex items-center gap-2 max-w-xs">
          <span className="text-sm font-mono truncate">
            {formatShortenText(url, 30, 10)}
          </span>
          <Link to={url} target="_blank" className=" hover:text-primary">
            <ExternalLinkIcon className="h-3 w-3" />
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: "statusCode",
    header: "Status",
    cell: ({ row }) => {
      const statusCode = row.getValue("statusCode") as number
      const statusText = row.original.statusText
      return (
        <div className="flex items-center gap-2">
          <Badge variant={getStatusColor(statusCode) as any}>
            {statusCode}
          </Badge>
          <span className="text-xs text-muted-foreground">{statusText}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number
      return <div className="text-sm font-mono">{formatDuration(duration)}</div>
    },
  },
  {
    accessorKey: "requestId",
    header: "Request ID",
    cell: ({ row }) => {
      const requestId = row.getValue("requestId") as string
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono">
            {formatShortenText(requestId, 8, 4)}
          </span>
          <ButtonIconCopy copyValue={requestId} size="sm" />
        </div>
      )
    },
  },
]

// Custom row component with expandable detail view
export const CallLogRow = ({ row }: { row: any }) => {
  return (
    <>
      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
        {row.getVisibleCells().map((cell: any) => (
          <td key={cell.id} className="p-4 align-middle">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
      {row.getIsExpanded() && (
        <tr>
          <td colSpan={row.getVisibleCells().length} className="p-0">
            <CallLogDetailView callLog={row.original} />
          </td>
        </tr>
      )}
    </>
  )
}
