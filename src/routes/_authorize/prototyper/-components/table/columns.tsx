import { Badge, Button } from "@gearment/ui3"
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import { Eye, Code } from "lucide-react"
import { Link } from "@tanstack/react-router"

export interface GeneratedFileType {
  path: string
  content: string
  type: "create" | "update"
}

export interface PrototypeType {
  id: string
  moduleName: string
  description: string
  status: "pending" | "processing" | "completed" | "failed"
  createdAt: string
  createdBy: string
  files?: GeneratedFileType[]
  previewHtml?: string
  explanation?: string
}

const columnHelper = createColumnHelper<PrototypeType>()

export const columns: ColumnDef<PrototypeType, unknown>[] = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => (
      <span className="font-mono text-sm">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("moduleName", {
    header: "Module Name",
    cell: (info) => (
      <Link
        to="/prototyper/$prototypeId"
        params={{ prototypeId: info.row.original.id }}
        className="font-medium text-primary hover:underline"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => (
      <span className="text-sm text-muted-foreground line-clamp-2">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue()
      const variant =
        status === "completed"
          ? "default"
          : status === "processing"
            ? "secondary"
            : status === "failed"
              ? "destructive"
              : "outline"
      return <Badge variant={variant}>{status}</Badge>
    },
  }),
  columnHelper.accessor("createdBy", {
    header: "Created By",
    cell: (info) => <span className="text-sm">{info.getValue()}</span>,
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    cell: (info) => (
      <span className="text-sm">
        {format(new Date(info.getValue()), "dd/MM/yyyy HH:mm")}
      </span>
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: (info) => (
      <div className="flex items-center gap-2">
        <Link
          to="/prototyper/$prototypeId"
          params={{ prototypeId: info.row.original.id }}
        >
          <Button size="sm" variant="ghost">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
        <Link
          to="/prototyper/$prototypeId"
          params={{ prototypeId: info.row.original.id }}
          search={{ tab: "code" }}
        >
          <Button size="sm" variant="ghost">
            <Code className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    ),
  }),
]
