import {
  createRouter,
  Link,
  ParsedPath,
  RouterProvider,
} from "@tanstack/react-router"

import { DefaultErrorComponent, DefaultPendingComponent } from "@gearment/ui3"
import { Breadcrumb } from "./components/common/breadcrumb/breadcrumb"
import { routeTree } from "./routeTree.gen"
import { useAuth } from "./services/auth"
import { queryClient } from "./services/react-query"

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    breadcrumb: undefined!,
    queryClient,
  },
  notFoundMode: "root",
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: DefaultPendingComponent,
  defaultErrorComponent: () => <DefaultErrorComponent as={Link} />,
})

export const TanstackRoute = () => {
  const context = useAuth()

  return (
    <RouterProvider router={router} context={{ auth: context, queryClient }} />
  )
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

declare module "@tanstack/react-router" {
  interface HistoryState extends ParsedPath {
    key?: string
    search?: Record<string, any>
  }
  interface StaticDataRouteOption {
    breadcrumb?: Breadcrumb[]
  }
}
