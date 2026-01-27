import { EditIcon, Trash2Icon } from "lucide-react"
export default function CellActions() {
  return (
    <>
      <div className={"flex items-center justify-end gap-3"}>
        <EditIcon size={16} />
        <Trash2Icon size={16} className="text-destructive" />
      </div>
    </>
  )
}
