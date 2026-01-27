import {
  AllTransactionSearchSchema,
  AllTransactionSearchType,
} from "@/schemas/schemas/payment.ts"
import { TeamTransactionType } from "@/services/connect-rpc/types/index.ts"
import {
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gearment/ui3"
import { formatNumber } from "@gearment/utils"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import AllTransactionProvider, {
  useAllTransaction,
} from "./-all-transactions-context.tsx"
import Filter from "./-component/filter/filter.tsx"
import TableAllTransaction from "./-component/table-transaction/table.tsx"
import useTabs from "./-use-tabs.tsx"

export const Route = createFileRoute("/_authorize/finance/transactions/")({
  validateSearch: zodValidator(AllTransactionSearchSchema),
  search: {
    middlewares: [stripSearchParams(AllTransactionSearchSchema.parse({}))],
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
          name: "Transactions",
          link: "/finance/transactions",
          search: undefined,
        },
      ],
    }
  },
  component: () => (
    <AllTransactionProvider>
      <Index />
    </AllTransactionProvider>
  ),
})

function Index() {
  const { search, setRowSelection, handleSetFilter } = useAllTransaction()
  const tabs = useTabs()

  const handleSelectTab = (value: TeamTransactionType) => {
    let newFilter: AllTransactionSearchType = {
      ...search,
      page: 1,
      type: value,
    }

    switch (value) {
      case TeamTransactionType.DEPOSIT:
        break
      case TeamTransactionType.PAYMENT:
        newFilter = {
          ...search,
          page: 1,
          type: value,
          approvalBy: undefined,
        }
        break
      case TeamTransactionType.REFUND:
        newFilter = {
          ...search,
          page: 1,
          type: value,
          methodCode: undefined,
          approvalBy: undefined,
        }
        break
    }

    setRowSelection({})
    handleSetFilter(newFilter)
  }

  return (
    <>
      <PageHeader>
        <PageHeader.Title>Transactions</PageHeader.Title>
      </PageHeader>
      <div className="space-y-4">
        <Filter />

        <Tabs
          value={search.type.toString()}
          onValueChange={(value) =>
            handleSelectTab(Number(value) as TeamTransactionType)
          }
        >
          <TabsList className="bg-sidebar">
            {tabs.map((tab) => {
              const isActive = search.type === tab.key
              return (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key.toString()}
                  className="w-[120px]"
                >
                  {tab.icon(isActive)}
                  <span>
                    {tab.text} ({formatNumber(tab.count)})
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>
          <TabsContent value={search.type.toString()}>
            <TableAllTransaction />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
