import { SidebarInset, SidebarProvider, SidebarTrigger } from "@gearment/ui3"
import { LayoutDashboardIcon } from "lucide-react"
import AppBreadcrumb from "../common/breadcrumb/breadcrumb"
import SearchInput from "./search-input"
import SearchMultiOrders from "./search-multi-orders/search-multi-orders"
import SelectTimezone, { TimezoneProvider } from "./select-timezone"
import Sidebar from "./sidebar/sidebar"
import UserAvatar from "./sidebar/user-avatar"

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <TimezoneProvider>
      <SidebarProvider>
        <Sidebar />
        <SidebarInset className="overflow-x-hidden min-h-[100vh] flex-1 bg-secondary">
          <header className="flex justify-between bg-sidebar px-4 w-full h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden block size-auto">
                <button>
                  <LayoutDashboardIcon />
                </button>
              </SidebarTrigger>
              <SearchInput />
              <SearchMultiOrders />
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <SelectTimezone />
              </div>
              <UserAvatar />
            </div>
          </header>
          <div className="flex p-4 w-full shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
              <AppBreadcrumb />
            </div>
          </div>
          <div className="text-base px-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TimezoneProvider>
  )
}
