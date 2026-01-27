import { useQueryFinance } from "@/services/connect-rpc/transport"
import {
  staffCheckCreateCreditEligibility,
  staffGetGCreditDashboard,
} from "@gearment/nextapi/api/credit/v1/credit_admin-CreditAdminAPI_connectquery"
import { Button, cn, LoadingCircle, PageHeader } from "@gearment/ui3"
import { useNavigate, useParams } from "@tanstack/react-router"
import { CreditCard, TriangleAlert } from "lucide-react"
import GCreditsDetail from "./g-credits-detail.tsx/g-credits-detail"

const DisableGCredit = () => {
  const navigate = useNavigate({
    from: "/system/teams/$teamId/g-credits",
  })
  const { teamId } = useParams({
    from: "/_authorize/system/teams/$teamId/g-credits/",
  })

  const { data: isEligible, isLoading: isLoadingEligibility } = useQueryFinance(
    staffCheckCreateCreditEligibility,
    { teamId },
    {
      select: (data) => data.isEligible,
    },
  )

  if (isLoadingEligibility) {
    return (
      <div className="flex justify-center items-center">
        <LoadingCircle />
      </div>
    )
  }
  return (
    <div className="bg-background rounded-lg px-4 py-8 text-center space-y-4">
      <div>
        <span className={cn("inline-block bg-primary/20 rounded-full p-3")}>
          <CreditCard className={cn("w-8 h-8 text-primary")} />
        </span>
        <div className="text-lg font-medium">G-Credit Not Enabled</div>
      </div>
      <p className="max-w-md mx-auto">
        Enable G-credit for this team to provide flexible credit options, set
        spending limits, and track credit usage in real-time
      </p>

      {!isEligible && (
        <div className="text-red-500">
          <div className="flex justify-center gap-3">
            <TriangleAlert className="w-4 h-4" />
            <div className="space-y-1">
              <p>
                Cannot enable G-Credit without a valid Invoice or Legal Address.
              </p>
              <p>
                Please verify the team&apos;s billing information in the POD
                system.
              </p>
            </div>
          </div>
        </div>
      )}
      <Button
        disabled={!isEligible}
        onClick={() =>
          navigate({
            to: "/system/teams/$teamId/g-credits/enable",
            params: { teamId },
          })
        }
      >
        Enable G-credit
      </Button>
    </div>
  )
}

export default function GCreditsEnable() {
  const { teamId } = useParams({
    from: "/_authorize/system/teams/$teamId/g-credits/",
  })

  const { data, isLoading } = useQueryFinance(
    staffGetGCreditDashboard,
    {
      teamId,
    },
    {
      select: (data) => ({
        data: data?.data,
      }),
    },
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingCircle />
      </div>
    )
  }

  return (
    <div>
      {data?.data ? (
        <GCreditsDetail dashboard={data.data} />
      ) : (
        <div>
          <PageHeader>
            <PageHeader.Title>G-credits</PageHeader.Title>
          </PageHeader>
          <DisableGCredit />
        </div>
      )}
    </div>
  )
}
