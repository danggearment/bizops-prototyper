import {
  MigrationSearchSchema,
  MigrationTabs,
} from "@/schemas/schemas/migration"
import { useMutationMigration } from "@/services/connect-rpc/transport"
import {
  MigrationType,
  ModalMigration,
  useMigrationModal,
} from "@/services/modals/modal-migration"
import { queryClient } from "@/services/react-query"
import { formatDateForCallApi } from "@/utils"
import {
  staffCreateMigrationJob,
  staffListMigrationJob,
} from "@gearment/nextapi/api/migration/v1/migration-MigrationOperationAPI_connectquery.ts"
import {
  Button,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from "@gearment/ui3"
import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
  useSearch,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import FilterMigrationAccounts from "./-components/filter/filter-migration-accounts"
import FilterMigrationJobs from "./-components/filter/filter-migration-jobs"
import TableMigrationAccounts from "./-components/table-migration-accounts/table-migration-accounts"
import TableMigrationJobs from "./-components/table-migration-jobs/table-migration-jobs"
import MigrationProvider, { useMigration } from "./-migration-context"
import useTabs from "./-use-tabs"

export const Route = createFileRoute("/_authorize/dev/migration/")({
  component: () => (
    <MigrationProvider>
      <Index />
    </MigrationProvider>
  ),
  validateSearch: zodValidator(MigrationSearchSchema),
  search: {
    middlewares: [stripSearchParams(MigrationSearchSchema.parse({}))],
  },
})

function Index() {
  const { setOpen, onClose } = useMigrationModal((state) => ({
    setOpen: state.setOpen,
    onClose: state.onClose,
  }))
  const { triggerMigrationJob } = useMigration()

  const navigate = useNavigate({ from: "/dev/migration" })

  const search = useSearch({ from: "/_authorize/dev/migration/" })

  const tabs = useTabs()

  const mutationCreateMigrationJob = useMutationMigration(
    staffCreateMigrationJob,
    {
      onSuccess: () => {
        onClose()
        queryClient.invalidateQueries({
          queryKey: [
            staffListMigrationJob.service.typeName,
            staffListMigrationJob.name,
          ],
        })
        toast({
          variant: "success",
          title: "Migration Job created",
        })
      },
    },
  )

  const handleCreateMigrationJob = async (values: MigrationType) => {
    const { dataTypes, cusIds, time } = values
    const listCusIds =
      cusIds
        .replace(/[\s\n]+/g, ",")
        .replace(/,+$/, "")
        .split(",")
        .filter((item) => item.trim())
        .map((item) => Number(item)) || []

    const data = {
      cusIds: listCusIds,
      dataTypes: dataTypes as number[],
      rangeFrom: time.rangeFrom
        ? formatDateForCallApi(time.rangeFrom)
        : undefined,
      rangeTo: time.rangeTo
        ? formatDateForCallApi(time.rangeTo, "endOfDay")
        : undefined,
    }

    await mutationCreateMigrationJob.mutateAsync(data)
  }

  const handleChangeTab = (value: MigrationTabs) => {
    navigate({
      search: () => ({
        ...MigrationSearchSchema.parse({}),
        tab: value,
      }),
      replace: true,
    })
  }

  const handleChangeTabMigrationJob = (value: string) => {
    navigate({
      search: () => ({
        ...MigrationSearchSchema.parse({}),
        tab: search.tab,
        status: Number(value),
      }),
    })
  }

  return (
    <>
      <PageHeader>
        <PageHeader.Title>Migrations</PageHeader.Title>
        <PageHeader.Action>
          <Button
            onClick={() => setOpen({ onCreate: handleCreateMigrationJob })}
          >
            Create Migration Job
          </Button>
          <Button onClick={triggerMigrationJob}>Trigger Migration Job</Button>
        </PageHeader.Action>
      </PageHeader>
      <Tabs
        defaultValue={search.tab}
        onValueChange={(value) => handleChangeTab(value as MigrationTabs)}
      >
        <TabsList className="bg-sidebar">
          <TabsTrigger value={MigrationTabs.MigrationAccounts}>
            Migration Accounts
          </TabsTrigger>
          <TabsTrigger value={MigrationTabs.MigrationJobs}>
            Migration Jobs
          </TabsTrigger>
        </TabsList>
        <TabsContent value={MigrationTabs.MigrationAccounts}>
          <div className="space-y-4">
            <FilterMigrationAccounts />
            <TableMigrationAccounts />
          </div>
        </TabsContent>
        <TabsContent value={MigrationTabs.MigrationJobs}>
          <div className="space-y-4">
            <FilterMigrationJobs />
            <Tabs
              value={search.status?.toString()}
              onValueChange={(value) => handleChangeTabMigrationJob(value)}
            >
              <TabsList className="overflow-x-auto bg-sidebar">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.key} value={tab.key.toString()}>
                    {tab.text}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={search.status.toString()}>
                <TableMigrationJobs />
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
      <ModalMigration />
    </>
  )
}
