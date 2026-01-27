import { cn, Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"

export default function StatusIndicator({
  isVerified,
  icon,
  verifiedText,
  unverifiedText,
  verifiedClassName = "bg-green-100 text-green-700",
}: {
  isVerified: boolean
  icon: React.ReactNode
  verifiedText: string
  unverifiedText: string
  verifiedClassName?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={cn(
            "flex items-center justify-center w-4 h-4 rounded-full",
            isVerified
              ? verifiedClassName
              : "bg-gray-200 text-gray-500 hover:bg-gray-300",
          )}
        >
          {icon}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-sm px-3 py-2 rounded-md">
        {isVerified ? verifiedText : unverifiedText}
      </TooltipContent>
    </Tooltip>
  )
}
