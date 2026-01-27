import { ButtonIconCopy } from "@gearment/ui3"
import { Link, useLocation } from "@tanstack/react-router"

interface Props {
  txnId: string
}

function CellTxn({ txnId }: Props) {
  const location = useLocation()

  return (
    <div className="flex items-center gap-2 w-full">
      <Link
        to="/finance/transactions/$transactionId"
        params={{ transactionId: txnId }}
        state={{
          ...location,
        }}
        className="flex items-center gap-2"
      >
        <span className="truncate hover:text-primary">{txnId}</span>
      </Link>
      <ButtonIconCopy size={"sm"} copyValue={txnId} />
    </div>
  )
}

export default CellTxn
