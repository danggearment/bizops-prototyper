import { DateTime } from "@/components/common/date-time"
import { Timestamp } from "@bufbuild/protobuf"
import { ButtonIconCopy } from "@gearment/ui3"
import { useNavigate } from "@tanstack/react-router"

interface Props {
  txnId: string
  teamId: string
  createdAt?: Timestamp
  children?: React.ReactNode
}

function CellTransaction({ txnId, teamId, createdAt, children }: Props) {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate({
      to: "/system/teams/$teamId/transactions/$txnId",
      params: {
        teamId: teamId,
        txnId: txnId,
      },
    })
  }

  return (
    <div className="space-y-1">
      <div className="body-medium  font-medium flex gap-1 items-center">
        <span
          id={txnId}
          className=" whitespace-nowrap cursor-pointer"
          onClick={handleViewDetails}
        >
          #{txnId}
        </span>
        <ButtonIconCopy size="sm" copyValue={txnId} />
      </div>

      <div className="body-small">
        <span>
          Created: <DateTime date={createdAt?.toDate() || ""} />
        </span>
      </div>

      {children}
    </div>
  )
}

export default CellTransaction
