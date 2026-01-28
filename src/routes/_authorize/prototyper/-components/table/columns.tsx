import { Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@gearment/ui3"
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"

export interface PrototypeType {
  id: string
  name: string
  description: string
  thumbnail?: string
  content?: string
  caseStudies: CaseStudyType[]
  createdAt: string
}

export interface CaseStudyType {
  id: string
  prototypeId: string
  title: string
  description: string
  thumbnail: string
  content: string
  order: number
  createdAt: string
}

const columnHelper = createColumnHelper<PrototypeType>()

export const columns: ColumnDef<PrototypeType, unknown>[] = [
  columnHelper.accessor("id", {
    header: "ID",
    size: 120,
    cell: (info) => <span className="font-mono text-sm text-muted-foreground">{info.getValue()}</span>,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    size: 250,
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => <span className="text-sm text-muted-foreground">{info.getValue()}</span>,
  }),
  columnHelper.accessor("caseStudies", {
    header: "Case Studies",
    size: 120,
    cell: (info) => {
      const count = info.getValue().length
      return (
        <Badge variant={count > 0 ? "default" : "secondary"}>
          {count} {count === 1 ? "study" : "studies"}
        </Badge>
      )
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    size: 150,
    cell: (info) => (
      <span className="text-sm text-muted-foreground">
        {format(new Date(info.getValue()), "dd/MM/yyyy HH:mm")}
      </span>
    ),
  }),
  columnHelper.display({
    id: "actions",
    size: 60,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye className="h-4 w-4 mr-2" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
]