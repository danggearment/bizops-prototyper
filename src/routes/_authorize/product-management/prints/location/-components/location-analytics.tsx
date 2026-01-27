import { cn } from "@gearment/ui3"
import { CircleCheckBigIcon, CircleXIcon, MapPinIcon } from "lucide-react"
import { usePrintLocation } from "../-print-location-context"

export function LocationAnalytics() {
  const { analytics } = usePrintLocation()

  const data = [
    {
      id: "total-print-locations",
      label: "Total print locations",
      value: analytics.totalLocations,
      icon: <MapPinIcon className="size-8 text-primary" />,
      bgColor: "bg-primary/10",
    },
    {
      id: "active-print-locations",
      label: "Active print locations",
      value: analytics.totalActiveLocations,
      icon: <CircleCheckBigIcon className="size-8 text-success-foreground" />,
      bgColor: "bg-success-foreground/10",
    },
    {
      id: "inactive-print-locations",
      label: "Inactive print locations",
      value: analytics.totalInactiveLocations,
      icon: <CircleXIcon className="size-8 text-error-foreground" />,
      bgColor: "bg-error-foreground/10",
    },
  ]
  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
      {data.map((item) => (
        <div key={item.id} className="p-5 bg-white rounded-md cursor-pointer">
          <div className="flex items-center gap-4">
            <div className={cn(item.bgColor, "rounded-full p-3")}>
              <div className="flex items-center gap-2">{item.icon}</div>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground font-medium">
                {item.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
