import { useInfiniteQueryAudit } from "@/services/connect-rpc/transport"
import { formatDateString } from "@/utils"
import { staffListOrderActivity } from "@gearment/nextapi/api/audit/v1/activity-ActivityAPI_connectquery"
import { CursorPaginationSort } from "@gearment/nextapi/common/type/v1/paging_pb"
import { Badge, BoxEmpty, LoadingCircle, LogItem } from "@gearment/ui3"
import { formatShortenText } from "@gearment/utils"
import { ArrowRightIcon } from "lucide-react"

interface Props {
  orderId: string
}

const LIMIT_SEARCH_INFINITE = 20

export default function OrderLogs(props: Props) {
  const { orderId } = props

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQueryAudit(
      staffListOrderActivity,
      {
        pagination: {
          sort: CursorPaginationSort.DESC,
          cursor: "",
          limit: LIMIT_SEARCH_INFINITE,
        },
        filter: {
          orderIds: [orderId],
        },
      },
      {
        enabled: !!orderId,
        pageParamKey: "pagination",
        getNextPageParam: (lastPage) => {
          if (!lastPage?.pagination) return undefined
          if (lastPage.pagination.hasNext && lastPage.pagination.nextCursor) {
            return {
              cursor: lastPage.pagination.nextCursor,
              limit: LIMIT_SEARCH_INFINITE,
            }
          }
          return undefined
        },
      },
    )

  const logs = data?.pages.flatMap((page) => page.data) || []

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const bottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 50
    if (bottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <div className="bg-background rounded-lg p-4">
      <h3 className="heading-3 mb-4 flex items-center gap-2">Logs Activity</h3>

      {isLoading && (
        <div className="flex justify-center items-center">
          <LoadingCircle />
        </div>
      )}
      {!isLoading && (
        <>
          <div className="overflow-auto max-h-[400px]" onScroll={handleScroll}>
            {logs.length === 0 && <BoxEmpty description="No data" />}
            {logs.map((log, index) => (
              <LogItem
                key={index}
                content={
                  <div className="space-y-2">
                    <p>
                      <strong>{formatShortenText(log.id, 5, 5)}:</strong>{" "}
                      {log.message}
                    </p>
                    {log.fieldDiffs.length > 0 &&
                      log.fieldDiffs.map((field) => (
                        <div key={field.field} className="space-y-2">
                          <p>
                            Field changed: <strong>{field.field}</strong>
                          </p>
                          <p
                            key={field.field}
                            className="flex items-center gap-2"
                          >
                            <Badge variant={"error"}>
                              {field.before || "--"}
                            </Badge>
                            <ArrowRightIcon className="w-4 h-4" />
                            <Badge variant={"success"}>
                              {field.after || "--"}
                            </Badge>
                          </p>
                        </div>
                      ))}
                    <p></p>
                  </div>
                }
                time={
                  log.createdAt ? formatDateString(log.createdAt.toDate()) : ""
                }
              />
            ))}

            {isFetchingNextPage && (
              <div className="flex justify-center items-center py-4">
                <LoadingCircle />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
