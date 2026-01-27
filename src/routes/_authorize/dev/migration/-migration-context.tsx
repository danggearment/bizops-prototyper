import {
  MigrationSearchKeys,
  MigrationSearchSchema,
  MigrationSearchType,
  MigrationTabs,
} from "@/schemas/schemas/migration"
import {
  useMutationMigration,
  useQueryMigration,
} from "@/services/connect-rpc/transport"
import {
  Migration_Account,
  Migration_Job,
  StaffCountMigrationJobStatusResponse_StatusCount,
} from "@/services/connect-rpc/types"
import { formatDateForCallApi } from "@/utils"
import {
  staffCountMigrationJobStatus,
  staffListMigrationAccount,
  staffListMigrationJob,
  staffTriggerMigrationJob,
} from "@gearment/nextapi/api/migration/v1/migration-MigrationOperationAPI_connectquery"
import { toast } from "@gearment/ui3"
import { useSearch } from "@tanstack/react-router"
import { createContext, useContext } from "react"

interface MigrationContextType {
  migrationJobs: {
    data: Migration_Job[]
    rowCount: number
    pageCount: number
  }
  migrationAccounts: {
    data: Migration_Account[]
    rowCount: number
    pageCount: number
  }
  isPendingJob: boolean
  isPendingAccount: boolean
  search: MigrationSearchType
  countMigrationJobStatus: StaffCountMigrationJobStatusResponse_StatusCount[]
  triggerMigrationJob: () => void
}

const MigrationContext = createContext<MigrationContextType>({
  migrationJobs: { data: [], rowCount: 0, pageCount: 0 },
  migrationAccounts: { data: [], rowCount: 0, pageCount: 0 },
  isPendingJob: false,
  isPendingAccount: false,
  search: MigrationSearchSchema.parse({}),
  countMigrationJobStatus: [],
  triggerMigrationJob: () => {},
})

interface Props {
  children: React.ReactNode
}

export default function MigrationProvider({ children }: Props) {
  const search = useSearch({ from: "/_authorize/dev/migration/" })

  const {
    data: migrationJob,
    isPending: isPendingJob,
    isFetching: isFetchingJob,
  } = useQueryMigration(
    staffListMigrationJob,
    {
      dataTypes: search.dataTypes as number[],
      cusIds: search.cusIds?.map(Number),
      rangeFrom: search.from ? formatDateForCallApi(search.from) : undefined,
      rangeTo: search.to
        ? formatDateForCallApi(search.to, "endOfDay")
        : undefined,
      statuses: search.status ? [search.status] : undefined,
      paging: {
        page: search.page,
        limit: search.limit,
      },
    },
    {
      enabled: search.tab === MigrationTabs.MigrationJobs,
      select: (data) => ({
        migrationJobs: data.items,
        total: Number(data.paging?.total),
        pageCount: Number(data.paging?.totalPage),
      }),
    },
  )

  const {
    data: migrationAccount,
    isPending: isPendingAccount,
    isFetching: isFetchingAccount,
  } = useQueryMigration(
    staffListMigrationAccount,
    {
      paging: {
        page: search.page,
        limit: search.limit,
      },
      nextUserId:
        search.searchKey === MigrationSearchKeys.Enum.nextUserId
          ? search.searchText
          : undefined,
      cusId:
        search.searchKey === MigrationSearchKeys.Enum.cusId
          ? Number(search.searchText)
          : undefined,
    },
    {
      enabled: search.tab === MigrationTabs.MigrationAccounts,
      select: (data) => ({
        migrationAccounts: data.items,
        total: Number(data.paging?.total),
        pageCount: Number(data.paging?.totalPage),
      }),
    },
  )

  const { data: countMigrationJobStatus = [] } = useQueryMigration(
    staffCountMigrationJobStatus,
    {},
    {
      enabled: search.tab === MigrationTabs.MigrationJobs,
      select: (data) => data.items,
    },
  )

  const mutationTriggerMigrationJob = useMutationMigration(
    staffTriggerMigrationJob,
    {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Migration job triggered successfully",
        })
      },
      onError: (error) => {
        toast({
          variant: "error",
          title: "Failed to trigger migration job",
          description: error.rawMessage,
        })
      },
    },
  )

  const handleTriggerMigrationJob = async () => {
    await mutationTriggerMigrationJob.mutateAsync({})
  }

  return (
    <MigrationContext.Provider
      value={{
        migrationJobs: {
          data: migrationJob?.migrationJobs ?? [],
          rowCount: migrationJob?.total ?? 0,
          pageCount: migrationJob?.pageCount ?? 0,
        },
        migrationAccounts: {
          data: migrationAccount?.migrationAccounts ?? [],
          rowCount: migrationAccount?.total ?? 0,
          pageCount: migrationAccount?.pageCount ?? 0,
        },
        isPendingJob: isPendingJob || isFetchingJob,
        isPendingAccount: isPendingAccount || isFetchingAccount,
        search,
        countMigrationJobStatus,
        triggerMigrationJob: handleTriggerMigrationJob,
      }}
    >
      {children}
    </MigrationContext.Provider>
  )
}

export const useMigration = () => {
  const content = useContext(MigrationContext)
  if (!content) {
    throw Error("MigrationContext is not created")
  }

  return content
}
