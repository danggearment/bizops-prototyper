import Layout from "@/components/layout"
import { ModalSearchOrders } from "@/services/modals/modal-search-orders"
import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authorize")({
  beforeLoad(props) {
    return {
      pathname: props.location.pathname,
    }
  },
  component: Index,
})

function Index() {
  return (
    <Layout>
      <Outlet />
      <ModalSearchOrders />
    </Layout>
  )
}
