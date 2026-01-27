import { AllOrderSearchOrdersSchema } from "@/schemas/schemas/all-orders"
import { AllOrder_Type } from "@/services/connect-rpc/types"
import { useSearchOrders } from "@/services/modals/modal-search-orders"
import { Button } from "@gearment/ui3"
import { useNavigate } from "@tanstack/react-router"
import { SearchIcon } from "lucide-react"

export default function SearchMultiOrders() {
  const navigate = useNavigate()
  const actions = useSearchOrders((state) => state.actions)
  const handleConfirm = (text: string) => {
    const orderIds = text.split(",")
    navigate({
      to: "/order/all-orders",
      search: AllOrderSearchOrdersSchema.parse({
        orderIds,
        type: AllOrder_Type.ALL,
      }),
      replace: true,
    })
    actions.onClose()
  }

  const handleClick = () => {
    actions.setOpen({
      value: "",
      errorMessage: "Max length is 100",
      type: AllOrder_Type.ALL,
      onConfirm: (text) => {
        handleConfirm(text)
      },
    })
  }

  return (
    <Button
      variant="outline"
      className="bg-transparent"
      onClick={handleClick}
      aria-label="Search orders"
    >
      <SearchIcon className="w-4 h-4" />
      <span className="hidden md:block"> Search orders</span>
    </Button>
  )
}
