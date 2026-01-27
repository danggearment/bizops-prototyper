import { CreditStatusColorsMapping, mappingColor } from "@/constants/map-color"
import {
  CreditStatusLabel,
  G_CREDIT_TABS,
  G_CREDIT_TAB_KEY,
  type GCreditTabKey,
} from "@/constants/payment"
import {
  useMutationFinance,
  useQueryFinance,
} from "@/services/connect-rpc/transport"
import { CreditStatus } from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import {
  ModalSuspendCredit,
  useSuspendCreditModal,
} from "@/services/modals/modal-suspend-credit"
import { ModalTransactionList } from "@/services/modals/modal-transaction-list"
import { queryClient } from "@/services/react-query"
import {
  staffGetCreditOverview,
  staffToggleCreditStatus,
} from "@gearment/nextapi/api/credit/v1/credit_admin-CreditAdminAPI_connectquery"
import {
  Badge,
  Button,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from "@gearment/ui3"
import { useNavigate, useParams } from "@tanstack/react-router"
import { HandCoins, PencilLine } from "lucide-react"
import { useState } from "react"
import ActivityLogs from "./activity-logs"
import BillingCycleInformation from "./billing-cycle-information"
import CreditSummary from "./credit-summary"
import PolicySection from "./policy-section"
import SectionBillingSummary from "./section-billing-summary"
import SectionStatementHistory from "./section-statement-history"
import SectionUsage from "./section-usage"
import StatementAddress from "./statement-address"

const Tab = ({
  children,
  value,
  handleSelectTab,
}: {
  children: React.ReactNode
  value: GCreditTabKey
  handleSelectTab: (value: GCreditTabKey) => void
}) => {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => handleSelectTab(v as GCreditTabKey)}
    >
      <TabsList className="w-auto overflow-x-auto justify-start">
        {G_CREDIT_TABS.map((t) => (
          <TabsTrigger key={t.key} value={t.key}>
            {t.value}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={value}>{children}</TabsContent>
    </Tabs>
  )
}

export default function SectionGCredit() {
  const navigate = useNavigate({
    from: "/system/teams/$teamId/g-credits",
  })
  const { teamId } = useParams({
    from: "/_authorize/system/teams/$teamId/g-credits/",
  })
  const [setOpen, onClose] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const [activeTab, setActiveTab] = useState<GCreditTabKey>(
    G_CREDIT_TAB_KEY.OVERVIEW,
  )

  const { data } = useQueryFinance(
    staffGetCreditOverview,
    {
      teamId,
    },
    {
      select: (data) => data?.data,
    },
  )

  const mutationUpdateCreditStatus = useMutationFinance(
    staffToggleCreditStatus,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            staffGetCreditOverview.service.typeName,
            staffGetCreditOverview.name,
          ],
        })
        toast({
          variant: "success",
          title: "G-Credit status updated",
        })
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Failed to update G-Credit status",
          description: error.rawMessage,
        })
      },
    },
  )

  const [openSuspendModal] = useSuspendCreditModal((state) => [state.setOpen])

  const handleToggleStatus = (reasonId?: string, reason?: string) => {
    const payload = {
      teamId,
      reasonId: "",
      reason: "",
    }
    if (reasonId) payload.reasonId = reasonId
    if (reason) payload.reason = reason

    mutationUpdateCreditStatus.mutate(payload)
  }

  const handleActive = () => {
    if (data?.credit?.status === CreditStatus.ACTIVE) {
      openSuspendModal({
        title: "Suspend G-Credit Access",
        onConfirm: (reasonId: string, reason: string) => {
          handleToggleStatus(reasonId, reason)
        },
      })
      return
    }

    setOpen({
      title: "Are you sure you want to enable G-Credit?",
      description: "This action cannot be undone.",
      onConfirm: () => {
        handleToggleStatus()
        onClose()
      },
    })
  }
  return (
    <section className="bg-background rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HandCoins className="w-6 h-6" />
          <div>
            <span className="font-bold text-lg">G-Credit</span>
            <p className="text-sm text-muted-foreground">
              Manage team credit limit and billing cycle
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={data?.credit?.status == CreditStatus.ACTIVE}
              onCheckedChange={handleActive}
            />
            <span>
              <Badge
                className="text-base"
                variant={mappingColor(
                  CreditStatusColorsMapping,
                  data?.credit?.status,
                )}
              >
                {CreditStatusLabel[data?.credit?.status || 0]}
              </Badge>
            </span>
          </div>
          <Button
            onClick={() => {
              navigate({
                to: "/system/teams/$teamId/g-credits/enable",
              })
            }}
            disabled={data?.credit?.status !== CreditStatus.ACTIVE}
          >
            <PencilLine />
            Edit G-Credit
          </Button>
        </div>
      </div>
      <Tab value={activeTab} handleSelectTab={setActiveTab}>
        {activeTab === G_CREDIT_TAB_KEY.OVERVIEW && (
          <div className="grid grid-cols-2 gap-4">
            <CreditSummary
              credit={data?.credit}
              currentBillingCycle={data?.currentBillingCycle}
            />
            <BillingCycleInformation
              credit={data?.credit}
              currentBillingCycle={data?.currentBillingCycle}
              nextBillingCycle={data?.nextBillingCycle}
            />
            <div className="col-span-2">
              <StatementAddress />
            </div>
            <div className="col-span-2">
              <PolicySection credit={data?.credit} />
            </div>
            <div className="col-span-2">
              <ActivityLogs />
            </div>
          </div>
        )}
        {activeTab === G_CREDIT_TAB_KEY.BILLING_CYCLE && (
          <div className="grid grid-cols-1 gap-4">
            <div className="col-span-2">
              <SectionBillingSummary
                credit={data?.credit}
                currentBillingCycle={data?.currentBillingCycle}
              />
            </div>
            <div className="col-span-2">
              <SectionUsage
                credit={data?.credit}
                billingCycle={data?.currentBillingCycle}
              />
            </div>
            <div className="col-span-2">
              <SectionStatementHistory />
            </div>
          </div>
        )}
      </Tab>
      <ModalTransactionList />
      <ModalSuspendCredit />
    </section>
  )
}
