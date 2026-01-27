import { useQueryPod } from "@/services/connect-rpc/transport"
import { GMAttributeStatus } from "@/services/connect-rpc/types"
import { staffCountGMAttributeGroupStatus } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { cn } from "@gearment/ui3"
import { CircleCheckBigIcon, CircleXIcon, LayersIcon } from "lucide-react"
import { useMemo } from "react"
import { attributeGroupStatusAnalytics, getAttributeCount } from "./-helper"

export default function GroupAnalytics() {
  const { data = [] } = useQueryPod(
    staffCountGMAttributeGroupStatus,
    {},
    {
      select: ({ data }) => attributeGroupStatusAnalytics(data),
    },
  )

  const analytics = useMemo(() => {
    return [
      {
        id: "total-groups",
        label: "Total groups",
        count: getAttributeCount(data),
        icon: (
          <Icon
            icon={<LayersIcon className="size-8 text-primary" />}
            bgColor="bg-primary/10"
          />
        ),
      },
      {
        id: "active-groups",
        label: "Active groups",
        count: getAttributeCount(
          data,
          GMAttributeStatus.GM_ATTRIBUTE_STATUS_ACTIVE,
        ),
        icon: (
          <Icon
            icon={
              <CircleCheckBigIcon className="size-8 text-success-foreground" />
            }
            bgColor="bg-success-foreground/10"
          />
        ),
      },
      {
        id: "inactive-groups",
        label: "Inactive groups",
        count: getAttributeCount(
          data,
          GMAttributeStatus.GM_ATTRIBUTE_STATUS_INACTIVE,
        ),
        icon: (
          <Icon
            icon={<CircleXIcon className="size-8 text-error-foreground" />}
            bgColor="bg-error-foreground/10"
          />
        ),
      },
    ]
  }, [data])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {analytics.map((item) => (
        <div
          className="col-span-1 rounded-md p-4 bg-background border"
          key={item.id}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <div className="">
              <div className="text-lg font-bold">{item.count}</div>
              <div className="font-medium text-foreground/50">{item.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const Icon = ({
  icon,
  bgColor,
}: {
  icon: React.ReactNode
  bgColor: string
}) => {
  return (
    <div
      className={cn(
        "size-14 rounded-full flex items-center justify-center min-w-14",
        bgColor,
      )}
    >
      {icon}
    </div>
  )
}
