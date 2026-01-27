import { Breadcrumb } from "@/components/common/breadcrumb/breadcrumb"
import { AuthContext } from "@/services/auth"
import { ConfirmModal } from "@/services/modals/modal-confirm"
import { ModalEnterSearchText } from "@/services/modals/modal-enter-search-text"
import { ModalNotification } from "@/services/modals/modal-notification"
import { getEnvironment } from "@/utils"
import {
  DefaultNotFoundComponent,
  EnvironmentBadge,
  Toaster,
} from "@gearment/ui3"
import { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router"

export interface MyRouterContext {
  auth: AuthContext
  breadcrumb: Breadcrumb[]
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  staticData: {
    breadcrumb: [
      {
        name: "Home",
        link: "/",
      },
    ],
  },
  component: Index,
  pendingComponent: () => null,
  notFoundComponent: () => <DefaultNotFoundComponent as={Link} />,
})

const environment = getEnvironment()
const isProduction = environment === "production"

function Index() {
  return (
    <>
      <div className="relative z-0">
        <Outlet />
      </div>
      <Toaster />
      <ConfirmModal />
      <ModalNotification />
      <ModalEnterSearchText />
      {!isProduction && <EnvironmentBadge environment={environment} />}
    </>
  )
}
