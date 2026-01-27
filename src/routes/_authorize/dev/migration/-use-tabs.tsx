import { MigrationStatusLabel } from "@/constants/migration"
import { Migration_Job_Status } from "@/services/connect-rpc/types"
import { useMemo } from "react"
import { useMigration } from "./-migration-context"

type Tab = {
  key: number
  text: string
}

type JobCount = {
  status: number
  count: number
}

const SORTED_STATUS_ORDER = [
  Migration_Job_Status.PENDING,
  Migration_Job_Status.READY_FOR_PROCESSING,
  Migration_Job_Status.PROCESSING,
  Migration_Job_Status.COMPLETED,
  Migration_Job_Status.FAILED,
]

export default function useTabs(): Tab[] {
  const { countMigrationJobStatus } = useMigration()

  const jobsCount: JobCount[] = useMemo(() => {
    const raw = (countMigrationJobStatus ?? []).map((item) => ({
      status: item.status,
      count: Number(item.count),
    }))
    return SORTED_STATUS_ORDER.map((status) => {
      const found = raw.find((item) => item.status === status)
      return {
        status,
        count: found ? found.count : 0,
      }
    })
  }, [countMigrationJobStatus])

  const tabs: Tab[] = useMemo(() => {
    const baseTabs: Tab[] = [
      {
        key: Migration_Job_Status.UNSPECIFIED,
        text: "All",
      },
      ...SORTED_STATUS_ORDER.map((status) => ({
        key: status,
        text: MigrationStatusLabel[status],
      })),
    ]

    return baseTabs.map((t) => {
      let count: number | undefined
      if (t.key === Migration_Job_Status.UNSPECIFIED) {
        count = jobsCount.reduce((acc, job) => acc + (job.count ?? 0), 0)
      } else {
        count = jobsCount.find((job) => job.status === t.key)?.count
      }
      return {
        key: t.key,
        text: `${t.text} (${count ?? 0})`,
      }
    })
  }, [jobsCount])

  return tabs
}
