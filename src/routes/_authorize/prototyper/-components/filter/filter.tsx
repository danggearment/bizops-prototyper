import { Button, Input } from "@gearment/ui3"
import { Search, Plus } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { Route } from "../../index"

export default function Filter() {
  const search = Route.useSearch()
  const navigate = useNavigate()

  return (
    <div className="bg-background rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prototypes..."
            className="pl-9"
            defaultValue={search.search}
            onChange={(e) => {
              navigate({
                search: (prev) => ({ ...prev, search: e.target.value, page: 1 }),
              })
            }}
          />
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Prototype
        </Button>
      </div>
    </div>
  )
}