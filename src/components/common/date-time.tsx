import { formatDateString } from "@/utils/format-date"
import { cn } from "@gearment/ui3"

export const DateTime = ({
  date,
  className,
  format,
}: {
  date?: string | Date | number
  className?: string
  format?: string
}) => {
  if (!date) return <p className={cn("tabular-nums", className)}>--</p>

  if (
    typeof date === "object" &&
    (date.getFullYear() === 1970 || date.getFullYear() === 1)
  ) {
    return <p className={cn("tabular-nums", className)}>--</p>
  }

  return (
    <p className={cn("tabular-nums", className)}>
      {date ? formatDateString(date, format) : "--"}
    </p>
  )
}
