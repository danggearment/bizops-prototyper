import ImageAvatar from "@/components/common/image/image-avatar"
import { MyRouterContext } from "@/routes/__root"
import { RootRouteChildren } from "@/routeTree.gen"
import { useQueryIam } from "@/services/connect-rpc/transport.tsx"
import { staffGetTeam } from "@gearment/nextapi/api/iam/v1/team-TeamAPI_connectquery.ts"
import {
  cn,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@gearment/ui3"
import { formatTextMany } from "@gearment/utils"
import {
  AnyContext,
  FileRouteTypes,
  Link,
  MakeRouteMatch,
  RootRoute,
  useLocation,
  useMatch,
  useNavigate,
} from "@tanstack/react-router"
import {
  ArrowLeftIcon,
  BanknoteIcon,
  CogIcon,
  CreditCard,
  File,
  HandCoins,
  LogsIcon,
  LucideIcon,
  Store,
} from "lucide-react"

type NavItem = {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

type NavList = (NavItem | { divider: boolean })[]

const navList: NavList = [
  {
    divider: true,
  },
  {
    title: "Team information",
    url: "/system/teams/$teamId/details/",
    icon: File,
  },
  {
    title: "Stores",
    url: "/system/teams/$teamId/store/",
    icon: Store,
  },
  {
    title: "Payment methods",
    url: "/system/teams/$teamId/payment-methods/",
    icon: BanknoteIcon,
  },
  {
    title: "Transactions",
    url: "/system/teams/$teamId/transactions/",
    icon: CreditCard,
  },
  {
    title: "G-credits",
    url: "/system/teams/$teamId/g-credits/",
    icon: HandCoins,
  },
  {
    title: "Configuration",
    url: "/system/teams/$teamId/general/",
    icon: CogIcon,
    items: [
      {
        title: "General",
        url: "/system/teams/$teamId/general/",
      },
      {
        title: "Print Type",
        url: "/system/teams/$teamId/print-type/",
      },
    ],
  },
  {
    title: "Logs",
    url: "/system/teams/$teamId/logs/import-orders/",
    icon: LogsIcon,
    items: [
      {
        title: "Import Orders",
        url: "/system/teams/$teamId/logs/import-orders/",
      },
    ],
  },
]

type MatchType = MakeRouteMatch<
  RootRoute<
    undefined,
    MyRouterContext,
    AnyContext,
    () => { breadcrumb: { name: string; link: string; search: undefined }[] },
    { params: { teamId: string } },
    Record<string, unknown>,
    RootRouteChildren,
    FileRouteTypes
  >,
  "/_authorize",
  true
>

export default function AppSidebar() {
  const match: MatchType = useMatch({
    from: "/_authorize",
  })
  const navigate = useNavigate()
  const activatedRoute = match.context.pathname

  function isRouteActive(activatedRoute: string, link: string) {
    const escapedLink = link.replace(/\//g, "\\/").replace("$teamId", "\\w+")
    const regex = new RegExp(escapedLink)
    return regex.test(activatedRoute + "/")
  }

  const { data } = useQueryIam(
    staffGetTeam,
    { teamId: match.params.teamId },
    { select: (data) => data.data },
  )

  const beforeLocation = useLocation({
    select: (data) => data.state,
  })
  const memberCount = data?.memberCount ? Number(data?.memberCount) : 0

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="relative">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {
                  navigate({
                    to: beforeLocation.pathname ? beforeLocation.pathname : "/",
                    search: beforeLocation.search,
                  })
                }}
                tooltip="Back to Workspace"
                className="w-full mt-[40px] text-foreground justify-start gap-4 hover:no-underline truncate"
              >
                <ArrowLeftIcon width={16} height={16} /> Back to Workspace
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem className="py-2">
                <SidebarMenuButton asChild>
                  <div className={cn("w-full flex gap-[12px]")}>
                    <ImageAvatar
                      className="h-[22px] w-[22px] rounded border"
                      url={data?.avatarUrl ?? ""}
                      alt={data?.teamName}
                      name={data?.teamId}
                    />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="w-full font-medium truncate ...">
                        {data?.teamName}
                      </h4>
                      <span className="text-sm text-secondary-text font-normal truncate">
                        {formatTextMany("member", memberCount)}
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {navList.map((item, index) => {
                if ("divider" in item) {
                  return (
                    <SidebarMenuItem key={index}>
                      <Separator />
                    </SidebarMenuItem>
                  )
                }
                const hasItems = item.items && item.items.length > 0

                if (!hasItems) {
                  const activated = isRouteActive(activatedRoute, item.url)
                  return (
                    <SidebarMenuItem
                      key={item.url}
                      className={cn(
                        activated &&
                          "bg-sidebar-accent text-sidebar-accent-foreground text-primary",
                      )}
                    >
                      <SidebarMenuButton tooltip={item.title} asChild>
                        <Link
                          to={item.url}
                          state={{
                            ...beforeLocation,
                          }}
                        >
                          {item.icon && <item.icon />}
                          <span className={cn(activated && "text-primary")}>
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }
                return (
                  <Collapsible
                    key={item.url}
                    asChild
                    open
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <Link
                          to={item.url}
                          state={{
                            ...beforeLocation,
                          }}
                        >
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </Link>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => {
                            const activated = isRouteActive(
                              activatedRoute,
                              subItem.url,
                            )
                            return (
                              <SidebarMenuSubItem
                                key={subItem.title}
                                className={cn(
                                  activated &&
                                    "bg-sidebar-accent text-sidebar-accent-foreground",
                                )}
                              >
                                <SidebarMenuSubButton asChild>
                                  <Link
                                    to={subItem.url}
                                    state={{
                                      ...beforeLocation,
                                    }}
                                  >
                                    <span
                                      className={cn(
                                        activated && "text-primary",
                                      )}
                                    >
                                      {subItem.title}
                                    </span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  )
}
