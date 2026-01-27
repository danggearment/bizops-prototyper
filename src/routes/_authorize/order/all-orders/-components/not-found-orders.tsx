import {
  ModalNotFoundOrders,
  useNotFoundOrders,
} from "@/services/modals/modal-not-found-orders"
import { Button } from "@gearment/ui3"
import { formatTextMany } from "@gearment/utils"
import { AlertTriangleIcon } from "lucide-react"
import { useAllOrders } from "../-all-orders-context"

export default function NotFoundOrders() {
  const { notFoundOrders } = useAllOrders()
  const actions = useNotFoundOrders((state) => state.actions)
  return (
    <>
      <Button
        variant="destructive"
        className="rounded-full"
        onClick={() => actions.setOpen({ notFoundOrders })}
      >
        <AlertTriangleIcon size={16} />{" "}
        {formatTextMany("order", notFoundOrders.length)} not found - Click to
        view
      </Button>
      <ModalNotFoundOrders />
    </>
  )
}
