import {
  StaffListStatementPaymentRequestSchema,
  StaffListStatementPaymentRequestType,
} from "@/schemas/schemas/payment"
import { useQueryFinance } from "@/services/connect-rpc/transport"
import {
  CreditStatementPaymentRequestStatus,
  StaffListStatementPaymentRequestRequest_SortCriterion,
  StaffListStatementPaymentRequestRequest_SortCriterion_SortBy,
  StaffListStatementPaymentRequestRequest_SortCriterion_SortDirection,
} from "@/services/connect-rpc/types"
import { ModalDetailStatementPaymentRequest } from "@/services/modals/modal-detail-statement-payment-request"
import { ModalReasonRejectStatement } from "@/services/modals/modal-reason-reject-statement"
import { formatDateForCallApi } from "@/utils"
import { staffListStatementPaymentRequest } from "@gearment/nextapi/api/credit/v1/credit_admin-CreditAdminAPI_connectquery"
import {
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gearment/ui3"
import { formatNumber } from "@gearment/utils"
import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
  useSearch,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useCallback } from "react"
import Filter from "./-components/filter/filter"
import Table from "./-components/table/table"
import useTabs from "./-use-tabs"

export const Route = createFileRoute("/_authorize/finance/payment-request/")({
  validateSearch: zodValidator(StaffListStatementPaymentRequestSchema),
  search: {
    middlewares: [
      stripSearchParams(StaffListStatementPaymentRequestSchema.parse({})),
    ],
  },
  beforeLoad: () => {
    return {
      breadcrumb: [
        {
          name: "Finance",
          link: "/finance",
          search: undefined,
        },
        {
          name: "Statement payment request",
          link: "/finance/payment-request",
          search: undefined,
        },
      ],
    }
  },
  component: RouteComponent,
})

const sortByMapping: Record<
  string,
  StaffListStatementPaymentRequestRequest_SortCriterion_SortBy
> = {
  requestedAt:
    StaffListStatementPaymentRequestRequest_SortCriterion_SortBy.CREATED_AT,
}

const sortDirectionMapping: Record<
  string,
  StaffListStatementPaymentRequestRequest_SortCriterion_SortDirection
> = {
  asc: StaffListStatementPaymentRequestRequest_SortCriterion_SortDirection.ASC,
  desc: StaffListStatementPaymentRequestRequest_SortCriterion_SortDirection.DESC,
}

function RouteComponent() {
  const search = useSearch({
    from: "/_authorize/finance/payment-request/",
  })
  const navigate = useNavigate({
    from: "/finance/payment-request",
  })

  const { data, isLoading, refetch } = useQueryFinance(
    staffListStatementPaymentRequest,
    {
      filter: {
        statuses: [...(search.status ? [search.status] : [])],
        resolverIds: search.resolverIds,
        requestedFrom: search.from
          ? formatDateForCallApi(search.from)
          : undefined,
        requestedTo: search.to
          ? formatDateForCallApi(search.to, "endOfDay")
          : undefined,
        teamIds: search.teamIds,
      },
      search:
        search.searchTokens && search.searchTokens.length
          ? { searchTokens: search.searchTokens }
          : undefined,
      paging: {
        limit: search.limit,
        page: search.page,
      },
      sortCriterion: (search.sortBy || []).reduce<
        StaffListStatementPaymentRequestRequest_SortCriterion[]
      >((acc, key, idx) => {
        const mapped = sortByMapping[key]
        if (!mapped) return acc
        acc.push(
          new StaffListStatementPaymentRequestRequest_SortCriterion({
            sortBy: mapped,
            sortDirection:
              sortDirectionMapping[search.sortDirection?.[idx] ?? "desc"],
          }),
        )
        return acc
      }, []),
    },
  )

  const handleSetFilter = useCallback(
    (filter: StaffListStatementPaymentRequestType, isReset = false) => {
      navigate({
        search: (old) => (isReset ? { ...filter } : { ...old, ...filter }),
        replace: true,
      })
    },
    [navigate],
  )

  const tabs = useTabs()
  const handleSelectTab = (value: CreditStatementPaymentRequestStatus) => {
    handleSetFilter({
      ...search,
      status: value,
    })
  }

  const handleRefetchData = useCallback(async () => {
    await Promise.all([refetch()])
  }, [refetch])

  return (
    <div className="space-y-4">
      <PageHeader>
        <PageHeader.Title>Statement payment request</PageHeader.Title>
      </PageHeader>
      <Filter
        handleChangeSearch={handleSetFilter}
        handleRefetchData={handleRefetchData}
      />
      <Tabs
        value={search.status.toString()}
        onValueChange={(value) => handleSelectTab(Number(value))}
      >
        <TabsList className="bg-sidebar">
          {tabs.map((tab) => {
            const isActive = search.status === tab.key
            return (
              <TabsTrigger
                key={tab.key}
                value={tab.key.toString()}
                className="w-[120px]"
              >
                {tab.icon(isActive)}
                <span>
                  {tab.text} ({formatNumber(tab.count || 0)})
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>
        <TabsContent value={search.status.toString()}>
          <Table data={data} isLoading={isLoading} />
        </TabsContent>
      </Tabs>

      <ModalReasonRejectStatement />
      <ModalDetailStatementPaymentRequest />
    </div>
  )
}
