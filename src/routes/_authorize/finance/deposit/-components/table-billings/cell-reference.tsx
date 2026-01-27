import { DepositRequest_Short } from "@/services/connect-rpc/types"
import { ButtonIconCopy } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"

export default function CellReference(
  props: CellContext<DepositRequest_Short, any>,
) {
  const referenceID = props.getValue<string>()

  return (
    <div className="flex items-center space-x-2">
      <span>{referenceID || "--"}</span>
      {referenceID && <ButtonIconCopy copyValue={referenceID} />}
    </div>
  )
}
