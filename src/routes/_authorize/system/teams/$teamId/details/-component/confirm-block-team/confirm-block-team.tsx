import { DateTime } from "@/components/common/date-time"
interface ConfirmBlockTeamProps {
  teamName?: string
  ownerName?: string
  joinedDate?: { toDate: () => Date }
}

export function getConfirmBlockTeamDescription({
  teamName,
  ownerName,
  joinedDate,
}: ConfirmBlockTeamProps) {
  return (
    <div className="space-y-2 pt-2">
      <ul className="mb-4 list-disc list-inside space-y-1">
        <li>
          Blocking this team will prevent them from creating orders and
          accessing the all system operations.
        </li>
        <li>Existing orders are not affected.</li>
      </ul>
      <div>
        <p className="font-semibold mb-2">Detail:</p>
        <div className="space-y-1 text-sm pl-4">
          <ul className="mb-4 list-disc list-inside space-y-1">
            <li>
              <span className="font-medium">Team:</span> {teamName || "N/A"}
            </li>
            <li>
              <span className="font-medium">Owner:</span> {ownerName || "N/A"}
            </li>
            <li>
              <span className="font-medium">Joined:</span>{" "}
              {joinedDate ? (
                <span className="inline [&>p]:inline [&>p]:m-0">
                  <DateTime date={joinedDate.toDate()} />
                </span>
              ) : (
                "N/A"
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
