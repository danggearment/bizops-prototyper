import { Button } from "@gearment/ui3"
import { PlusIcon } from "lucide-react"

export default function Actions() {
  return (
    <div className="flex gap-2 justify-end">
      <Button variant="outline">
        <PlusIcon />
        Create product group
      </Button>
    </div>
  )
}
