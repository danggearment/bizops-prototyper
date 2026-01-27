import { useQueryPod } from "@/services/connect-rpc/transport"
import { GMAttributeValueStatus } from "@/services/connect-rpc/types"
import { staffCountGMAttributeValueStatus } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { cn } from "@gearment/ui3"
import { useParams } from "@tanstack/react-router"
import {
  CircleCheckBigIcon,
  CircleXIcon,
  PackageIcon,
  ShoppingBagIcon,
} from "lucide-react"
import { useMemo } from "react"
import { useAttributeGroupValue } from "../-attribute-group-value-context"
import {
  attributeValueStatusAnalytics,
  getAttributeValueCount,
} from "./-helper"

export default function GroupValueAnalytics() {
  const { attributeGroupDetail } = useAttributeGroupValue()
  const { productUsageCount } = attributeGroupDetail
  const { groupId } = useParams({
    from: "/_authorize/product-management/attributes/group/$groupId/",
  })

  const { data = [] } = useQueryPod(
    staffCountGMAttributeValueStatus,
    {
      filter: {
        attributeGroupKeys: [groupId],
      },
    },
    {
      select: ({ data }) => attributeValueStatusAnalytics(data),
    },
  )

  const analytics = useMemo(
    () => [
      {
        id: "total-attributes",
        label: "Total attributes",
        count: getAttributeValueCount(data),
        icon: (
          <Icon
            icon={<PackageIcon className="size-8 text-primary" />}
            bgColor="bg-primary/10"
          />
        ),
      },
      {
        id: "active-attributes",
        label: "Active attributes",
        count: getAttributeValueCount(
          data,
          GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_ACTIVE,
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
        id: "inactive-attributes",
        label: "Inactive attributes",
        count: getAttributeValueCount(
          data,
          GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_INACTIVE,
        ),
        icon: (
          <Icon
            icon={<CircleXIcon className="size-8 text-error-foreground" />}
            bgColor="bg-error-foreground/10"
          />
        ),
      },
      {
        id: "used-in-products",
        label: "Used in products",
        count: productUsageCount,
        icon: (
          <Icon
            icon={<ShoppingBagIcon className="size-8 text-purple-500" />}
            bgColor="bg-purple-500/10"
          />
        ),
      },
    ],
    [data, productUsageCount],
  )
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {analytics.map((item) => (
        <div className="col-span-1 rounded-md p-4 bg-background" key={item.id}>
          <div className="flex items-start gap-3 justify-between">
            <div className="">
              <div className="text-lg font-bold">{item.count}</div>
              <div className="font-medium text-foreground/50">{item.label}</div>
            </div>
            {item.icon}
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
