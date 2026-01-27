import { AllOrderStatus } from "@/constants/all-orders-status"
import { Order_Admin } from "@/services/connect-rpc/types"
import { CellHeader } from "@gearment/ui3"
import { useSearch } from "@tanstack/react-router"
import { HeaderContext } from "@tanstack/react-table"

interface Props {
  header: HeaderContext<Order_Admin, any>
  title: string
}
export default function CellHeaderSort({ header, title }: Props) {
  const search = useSearch({
    from: "/_authorize/order/sale-orders/",
  })

  const hasSort = search.processingStatus !== AllOrderStatus.ALL

  return (
    <CellHeader {...header} sort={hasSort}>
      <p className="whitespace-nowrap">{title}</p>
    </CellHeader>
  )
}
