import { Timestamp } from "@bufbuild/protobuf"
import { ButtonIconCopy } from "@gearment/ui3"

interface Props {
  txnId: string
  refId: string
  createdAt?: Timestamp
  children?: React.ReactNode
}

function CellDeposit({ txnId, refId, children }: Props) {
  return (
    <div className="space-y-1">
      <div className="body-medium  font-medium flex gap-1 items-center">
        <span id={txnId} className=" whitespace-nowrap">
          {txnId}
        </span>
        <ButtonIconCopy size="sm" copyValue={txnId} />
      </div>

      <div className="body-small mb-1 flex items-center gap-1 text-foreground/50">
        <span>Ref ID: {refId ? `${refId}` : "--"}</span>
        <ButtonIconCopy size="sm" copyValue={refId} />
      </div>
      {children}
    </div>
  )
}

export default CellDeposit
