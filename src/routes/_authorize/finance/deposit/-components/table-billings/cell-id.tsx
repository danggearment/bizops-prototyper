import { CellContext } from "@tanstack/react-table"
import { DepositRequest_Short } from "@gearment/nextapi/api/wallet/v1/wallet_pb.ts"

export default function CellID(props: CellContext<DepositRequest_Short, any>) {
  const id = props.getValue().toString()

  return (
    <div className="flex items-center space-x-2">
      <span className={"w-[60px]"}>{id}</span>
    </div>
  )
}
