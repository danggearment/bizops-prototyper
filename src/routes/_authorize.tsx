import { Outlet, createFileRoute } from "@tanstack/react-router"
import { Layout } from "@gearment/ui3"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  FileCode,
} from "lucide-react"

export const Route = createFileRoute("/_authorize")({
  component: AuthorizeLayout,
})

function AuthorizeLayout() {
  return (
    <Layout>
      <Layout.Sidebar>
        <Layout.Sidebar.Header>
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="font-semibold text-lg">BizOps</span>
          </div>
        </Layout.Sidebar.Header>
        <Layout.Sidebar.Content>
          <Layout.Sidebar.Group title="Main">
            <Layout.Sidebar.Item
              icon={LayoutDashboard}
              label="Dashboard"
              to="/dashboard"
            />
            <Layout.Sidebar.Item
              icon={Package}
              label="Products"
              to="/products"
            />
            <Layout.Sidebar.Item
              icon={ShoppingCart}
              label="Orders"
              to="/orders"
            />
            <Layout.Sidebar.Item
              icon={Users}
              label="Customers"
              to="/customers"
            />
          </Layout.Sidebar.Group>
          <Layout.Sidebar.Group title="Finance">
            <Layout.Sidebar.Item
              icon={CreditCard}
              label="Payments"
              to="/payments"
            />
            <Layout.Sidebar.Item
              icon={BarChart3}
              label="Reports"
              to="/reports"
            />
          </Layout.Sidebar.Group>
          <Layout.Sidebar.Group title="System">
            <Layout.Sidebar.Item
              icon={FileCode}
              label="Prototyper"
              to="/prototyper"
            />
            <Layout.Sidebar.Item
              icon={Settings}
              label="Settings"
              to="/settings"
            />
          </Layout.Sidebar.Group>
        </Layout.Sidebar.Content>
      </Layout.Sidebar>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}
