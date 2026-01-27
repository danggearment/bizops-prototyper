import { StaffGetGCreditDashboardResponse_CreditDashboard } from "@/services/connect-rpc/types"
import { formatPrice } from "@/utils"

interface Props {
  dashboard: StaffGetGCreditDashboardResponse_CreditDashboard
}
const Box = ({
  title,
  value,
  percentAvailable,
}: {
  title: string
  value: string
  percentAvailable?: string
}) => {
  return (
    <div className="bg-background rounded-lg p-4 font-bold ">
      <div className="space-y-2">
        <div className="font-medium text-muted-foreground">
          <span>{title}</span>
        </div>
        <div className="text-lg">{value}</div>
        {percentAvailable && (
          <div className="text-sm text-gray-400">{percentAvailable}</div>
        )}
      </div>
    </div>
  )
}

export default function SectionSumary({ dashboard }: Props) {
  return (
    <section className="grid grid-cols-3 gap-4">
      <Box title="G-Credit Used" value={formatPrice(dashboard.creditUsed)} />

      <Box title="G-Credit Limit" value={formatPrice(dashboard.creditLimit)} />
      <Box
        title="Available Credit"
        value={formatPrice(dashboard.creditAvailable)}
        percentAvailable={`${dashboard.creditAvailablePercent}% available`}
      />
    </section>
  )
}
