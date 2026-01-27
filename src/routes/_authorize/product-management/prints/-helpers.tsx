import { cn, Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"

export function TooltipProtected({
  children,
  isProtected,
  tooltipText,
}: {
  children: React.ReactNode
  isProtected: boolean
  tooltipText: string
}) {
  if (!isProtected) return <>{children}</>
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "cursor-pointer flex gap-2",
            isProtected && "opacity-50 cursor-not-allowed",
          )}
          tabIndex={-1}
          type="button"
          disabled
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  )
}
