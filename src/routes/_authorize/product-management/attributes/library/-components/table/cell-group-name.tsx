import { GMAttribute_Admin_Value } from "@/services/connect-rpc/types"
import { Popover, PopoverContent, PopoverTrigger } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { CellContext } from "@tanstack/react-table"
import { useState } from "react"

export default function CellGroupName(
  props: CellContext<GMAttribute_Admin_Value, any>,
) {
  const [open, setOpen] = useState(false)
  const debouncedOpen = _debounce((value: boolean) => {
    setOpen(value)
  }, 200)

  const handleMouseEnter = () => {
    setOpen(true)
  }

  const handleMouseLeave = () => {
    setOpen(false)
  }

  const { groups } = props.row.original
  if (groups.length === 0)
    return (
      <span className="text-sm py-1 px-4 rounded-full font-semibold bg-sidebar-accent text-foreground/50 border border-transparent">
        Ungrouped
      </span>
    )

  return (
    <div className="flex items-center gap-1">
      <div className="py-1 px-4 rounded-full text-primary font-semibold bg-primary/10 border border-primary">
        {groups[0].attrName}
      </div>
      {groups.length > 1 && (
        <Popover open={open} onOpenChange={debouncedOpen}>
          <PopoverTrigger
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="hover:bg-primary/10 cursor-pointer rounded-full px-2 py-1 text-foreground-dark border border-transparent">
              + {groups.length - 1} more
            </span>
          </PopoverTrigger>
          <PopoverContent
            color="dark"
            side="bottom"
            className="bg-background max-w-[300px] w-fit"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="text-sm font-medium mb-2">
              All groups ({groups.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <div
                  key={group.attrKey}
                  className="text-sm py-1 px-4 rounded-full text-primary font-semibold bg-primary/10 border border-primary"
                >
                  {group.attrName}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
