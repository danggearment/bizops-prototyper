import { LogMarkdown } from "@/components/common/log-markdown/log-markdown"
import { LogDetailTypeColors } from "@/constants/map-color"
import { useQueryAudit } from "@/services/connect-rpc/transport"
import { ActivitySourceDisplayNames } from "@/services/connect-rpc/types"
import { formatDateString } from "@/utils/format-date"
import { staffGetCreditActivity } from "@gearment/nextapi/api/audit/v1/activity-ActivityAPI_connectquery"
import { StaffListCreditActivityResponse_Activity } from "@gearment/nextapi/api/audit/v1/activity_pb"
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  LoadingCircle,
} from "@gearment/ui3"
import { useMemo } from "react"

interface Props {
  open: boolean
  log: StaffListCreditActivityResponse_Activity
  onClose: () => void
}

export default function ModalLogDetails({ open, log, onClose }: Props) {
  const { data, isPending } = useQueryAudit(
    staffGetCreditActivity,
    {
      activityId: log.id,
    },
    {
      select: (data) => data,
    },
  )

  const contents = useMemo(() => {
    return [
      {
        name: "Name",
        content: data?.activity?.id || "--",
      },
      {
        name: "Content",
        content: data?.activity?.content ? (
          <LogMarkdown content={data.activity.content} />
        ) : (
          "--"
        ),
      },
      {
        name: "Time update",
        content: data?.activity?.timeUpdate
          ? formatDateString(data.activity.timeUpdate.toDate())
          : "--",
      },
      {
        name: "IP Address",
        content: data?.activity?.ipAddress || "--",
      },
      {
        name: "Type",
        content: (
          <Badge
            color={
              data?.activity?.type
                ? LogDetailTypeColors[data.activity.type]
                : undefined
            }
            className="first-letter:uppercase"
          >
            {data?.activity?.type
              ? ActivitySourceDisplayNames[data.activity.type]
              : "--"}
          </Badge>
        ),
      },
      {
        name: "Information",
        content: (() => {
          if (!data?.activity?.information) return "--"
          const fields = data.activity.information
          return fields.map((field) => {
            const oldValue = field && field.split("->")[0]
            const newValue = field && field.split("->")[1]
            return (
              <div key={field}>
                <span>{oldValue}</span>
                <span>{"->"}</span>
                <span className="text-primary">{newValue}</span>
              </div>
            )
          })
        })(),
      },
      {
        name: "Reason",
        content: data?.reason || "--",
      },
    ]
  }, [data])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[680px] max-w-[100vw]">
        <DialogHeader>
          <DialogTitle>Log details • #{log?.id}</DialogTitle>
        </DialogHeader>
        <div className="relative">
          {isPending && (
            <div className="absolute top-1/2 left-1/2 -translate-1/2">
              <LoadingCircle />
            </div>
          )}
          <table className="body-small w-full text-secondary-text">
            {contents.map((content, index) => (
              <tr key={index} className="border-b border-stroke align-top">
                <td className="pr-2 py-[10px] min-w-[100px]">{content.name}</td>
                <td className="py-[10px] text-foreground-dark">
                  {content.content}
                </td>
              </tr>
            ))}
          </table>
        </div>
        <DialogFooter>
          <Button
            className="shadow"
            size="sm"
            variant="ghost"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
