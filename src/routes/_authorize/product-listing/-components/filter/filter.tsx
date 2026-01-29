import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gearment/ui3"
import { useNavigate } from "@tanstack/react-router"
import { Download, Filter, Plus, Search } from "lucide-react"
import { Route } from "../../index"

export default function ProductFilter() {
  const search = Route.useSearch()
  const navigate = useNavigate()

  return (
    <div className="bg-background rounded-lg p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9"
              defaultValue={search.search}
              onChange={(e) => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    search: e.target.value,
                    page: 1,
                  }),
                })
              }}
            />
          </div>
          <Select
            value={search.status}
            onValueChange={(value) => {
              navigate({
                search: (prev) => ({
                  ...prev,
                  status: value as "all" | "active" | "draft" | "archived",
                  page: 1,
                }),
              })
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={search.category}
            onValueChange={(value) => {
              navigate({
                search: (prev) => ({ ...prev, category: value, page: 1 }),
              })
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="apparel">Apparel</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>
    </div>
  )
}
