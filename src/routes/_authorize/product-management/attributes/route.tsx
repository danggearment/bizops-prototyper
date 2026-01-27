import { AttributeTabSchema } from "@/schemas/schemas/attributes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@gearment/ui3"
import {
  createFileRoute,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router"
import { FolderTreeIcon, LayersIcon } from "lucide-react"
import { useMemo } from "react"

export const Route = createFileRoute(
  "/_authorize/product-management/attributes",
)({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const routerState = useRouterState()

  const currentTab = useMemo(() => {
    const segments = routerState.location.pathname.split("/")
    const tab =
      segments[segments.lastIndexOf("attributes") + 1] ||
      AttributeTabSchema.Enum.group
    return tab === AttributeTabSchema.Enum.group ||
      tab === AttributeTabSchema.Enum.library
      ? tab
      : AttributeTabSchema.Enum.group
  }, [routerState.location.pathname])

  const tabs = [
    {
      value: AttributeTabSchema.Enum.group,
      label: (
        <div className="flex items-center gap-2">
          <FolderTreeIcon size={16} /> Attributes group
        </div>
      ),
    },
    {
      value: AttributeTabSchema.Enum.library,
      label: (
        <div className="flex items-center gap-2">
          <LayersIcon size={16} /> Attributes library
        </div>
      ),
    },
  ]

  const handleTabChange = (value: string) => {
    navigate({
      to: `/product-management/attributes/${value}`,
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
