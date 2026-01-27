import { PrintTabSchema } from "@/schemas/schemas/prints"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@gearment/ui3"
import {
  createFileRoute,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router"
import { PrinterIcon, Settings2Icon } from "lucide-react"
import { useMemo } from "react"

export const Route = createFileRoute("/_authorize/product-management/prints")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const routerState = useRouterState()

  const currentTab = useMemo(() => {
    const segments = routerState.location.pathname.split("/")
    const tab =
      segments[segments.lastIndexOf("prints") + 1] ||
      PrintTabSchema.Enum.location
    return tab === PrintTabSchema.Enum.location ||
      tab === PrintTabSchema.Enum.type
      ? tab
      : PrintTabSchema.Enum.location
  }, [routerState.location.pathname])

  const tabs = [
    {
      value: PrintTabSchema.Enum.location,
      label: (
        <div className="flex items-center gap-2">
          <PrinterIcon size={16} /> Print locations
        </div>
      ),
    },
    {
      value: PrintTabSchema.Enum.type,
      label: (
        <div className="flex items-center gap-2">
          <Settings2Icon size={16} /> Print types
        </div>
      ),
    },
  ]

  const handleTabChange = (value: string) => {
    navigate({
      to: `/product-management/prints/${value}`,
    })
  }

  return (
    <div className="space-y-4">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="bg-sidebar">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => handleTabChange(tab.value)}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={currentTab} forceMount>
          <Outlet />
        </TabsContent>
      </Tabs>
    </div>
  )
}
