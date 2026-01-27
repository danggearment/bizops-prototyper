import { StaffInfo_Short } from "@/services/connect-rpc/types"
import { CellContext } from "@tanstack/react-table"

export default function CellStaff({ row }: CellContext<StaffInfo_Short, any>) {
  return (
    <div className="">
      <p className="font-semibold">{row.original.staffName}</p>
      <p className="text-foreground/50">{row.original.email}</p>
      <p className="text-foreground/50">{row.original.fullName}</p>
      <p className="text-foreground/50">#{row.original.staffId}</p>
    </div>
  )
}
