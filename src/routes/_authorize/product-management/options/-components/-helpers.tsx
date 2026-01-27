import { Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"

export const ActionOptionGroup = ({
  isDefault,
  children,
}: {
  isDefault: boolean
  children: React.ReactNode
}) => {
  if (isDefault) {
    return (
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          This option is protected due to system-wide dependencies.
        </TooltipContent>
      </Tooltip>
    )
  }
  return <>{children}</>
}
