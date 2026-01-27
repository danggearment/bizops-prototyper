import { Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"

export const CellName = ({ name }: { name: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="max-w-[150px] text-foreground-dark truncate text-left">
          {name}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">{name}</TooltipContent>
    </Tooltip>
  )
}
