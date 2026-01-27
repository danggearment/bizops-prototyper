import { DepositRequest_Short } from "@/services/connect-rpc/types"
import { ButtonIconCopy } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"

export default function CellTransaction(
  props: CellContext<DepositRequest_Short, any>,
) {
  const transactionID = props.getValue<string>()
  const showTransactionID = transactionID.slice(-6)

  return (
    <div className="flex items-center space-x-2">
      <span className={"w-[60px]"}>{showTransactionID || "--"}</span>
      {transactionID && <ButtonIconCopy copyValue={transactionID} />}
    </div>
  )
}
