import { AllOrderSearchOrdersSchema } from "@/schemas/schemas/all-orders"
import { AllOrder_Type } from "@/services/connect-rpc/types"
import { useSearchOrders } from "@/services/modals/modal-search-orders"
import { Input } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { XIcon } from "lucide-react"
import { useEffect, useRef } from "react"
import { useAllOrders } from "../-all-orders-context"
import NotFoundOrders from "./not-found-orders"

export default function InputSearchAllOrders() {
  const actions = useSearchOrders((state) => state.actions)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { notFoundOrders } = useAllOrders()
  const search = useSearch({
    from: "/_authorize/order/all-orders/",
  })
  const value = search.orderIds?.join(", ") || ""

  const handleConfirm = (orderInput: string, type: AllOrder_Type) => {
    const orderIds = orderInput.split(",")
    navigate({
      to: "/order/all-orders",
      search: AllOrderSearchOrdersSchema.parse({
        orderIds,
        type,
      }),
      replace: true,
    })
    actions.onClose()
  }

  useEffect(() => {
    function handleHotKey(e: KeyboardEvent) {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        (e.key === "k" || e.key === "K")
      ) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleHotKey)
    return () => {
      window.removeEventListener("keydown", handleHotKey)
    }
  }, [])

  const handleClick = () => {
    actions.setOpen({
      value,
      errorMessage: "Max length is 100",
      type: search.type,
      onConfirm: (text, type) => {
        handleConfirm(text, type)
      },
    })
    inputRef.current?.blur()
  }

  return (
    <div className="bg-background rounded-md p-4 space-y-4">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Enter order IDs"
          value={value}
          onClick={handleClick}
          aria-label="Search orders"
          className={value ? "pr-10" : ""}
        />
        {value && (
          <button
            type="button"
            className="absolute rounded-full right-6 top-1/2 -translate-y-1/2 bg-transparent p-1 hover:bg-muted focus:outline-none"
            onClick={() => {
              inputRef.current?.focus()
              handleConfirm("", AllOrder_Type.ALL)
            }}
            aria-label="Clear"
            tabIndex={0}
          >
            <XIcon size={14} className="text-muted-foreground" />
          </button>
        )}
      </div>
      {notFoundOrders.length > 0 && <NotFoundOrders />}
    </div>
  )
}
