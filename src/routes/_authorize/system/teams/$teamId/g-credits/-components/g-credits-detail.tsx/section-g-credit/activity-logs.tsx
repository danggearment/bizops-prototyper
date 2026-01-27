import { LogMarkdown } from "@/components/common/log-markdown/log-markdown"
import { COMMON_FORMAT_DATETIME_CREDIT } from "@/constants/payment"
import { useQueryAudit } from "@/services/connect-rpc/transport"
import { formatDateString } from "@/utils/format-date"
import { staffListCreditActivity } from "@gearment/nextapi/api/audit/v1/activity-ActivityAPI_connectquery"
import { StaffListCreditActivityResponse_Activity } from "@gearment/nextapi/api/audit/v1/activity_pb"
import { BoxEmpty, LogItem } from "@gearment/ui3"
import { useParams } from "@tanstack/react-router"
import { Activity } from "lucide-react"
import { useState } from "react"
import ModalLogDetails from "./modal-log-details"

export default function ActivityLogs() {
  const [logSelected, setLogSelected] =
    useState<StaffListCreditActivityResponse_Activity | null>(null)

  const { teamId } = useParams({
    from: "/_authorize/system/teams/$teamId/g-credits/",
  })

  const { data: activityLogs } = useQueryAudit(
    staffListCreditActivity,
    {
      teamId: teamId,
    },
    {
      select: (data) => data?.data,
    },
  )

  const handleViewDetails = (log: StaffListCreditActivityResponse_Activity) => {
    setLogSelected(log)
  }
  return (
    <div className="border p-4 rounded-lg space-y-4 bg-secondary/10">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4" />
        <span className="text-lg font-bold">Activity Logs</span>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {activityLogs?.length === 0 && <BoxEmpty description="No data" />}
        {(activityLogs || []).map((log, index) => (
          <LogItem
            key={index}
            content={
              <>
                <strong>#....{log.id.slice(-6)}:</strong>{" "}
                <LogMarkdown content={log.message} className="inline-flex" />{" "}
                <button
                  className="inline-block hover:no-underline text-primary"
                  onClick={() => handleViewDetails(log)}
                >
                  details
                </button>
              </>
            }
            time={
              log.createdAt
                ? formatDateString(
                    log.createdAt.toDate(),
                    COMMON_FORMAT_DATETIME_CREDIT,
                  )
                : ""
            }
          />
        ))}
      </div>
      {logSelected && (
        <ModalLogDetails
          open
          log={logSelected}
          onClose={() => setLogSelected(null)}
        />
      )}
    </div>
  )
}
