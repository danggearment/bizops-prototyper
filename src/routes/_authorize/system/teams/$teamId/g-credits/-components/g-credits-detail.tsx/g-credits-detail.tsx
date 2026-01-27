import { StaffGetGCreditDashboardResponse_CreditDashboard } from "@/services/connect-rpc/types"
import SectionGCredit from "./section-g-credit"
import SectionSumary from "./section-sumary"

interface Props {
  dashboard: StaffGetGCreditDashboardResponse_CreditDashboard
}
export default function GCreditsDetail({ dashboard }: Props) {
  return (
    <div className="space-y-4">
      <SectionSumary dashboard={dashboard} />
      <SectionGCredit />
    </div>
  )
}
