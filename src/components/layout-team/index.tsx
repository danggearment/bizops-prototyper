import { SidebarInset, SidebarProvider } from "@gearment/ui3"
import AppBreadcrumb from "../common/breadcrumb/breadcrumb"
import Sidebar from "./sidebar/sidebar"

interface Props {
  children: React.ReactNode
}

export default function LayoutTeam({ children }: Props) {
  return (
    <div
      id="layout-team"
      className="w-screen h-screen overflow-auto fixed inset-0 z-10"
    >
      <SidebarProvider>
        <Sidebar />
        <SidebarInset className="px-4 pb-4 bg-secondary">
          <header className="flex bg-secondary h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <AppBreadcrumb />
            </div>
          </header>
          <div>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
