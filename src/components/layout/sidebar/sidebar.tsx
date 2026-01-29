import gearmentLogo from "@/assets/images/logo/gearment.png"
import mgGearmentLogo from "@/assets/images/logo/mb-gearment.png"
import { Link, useMatch } from "@tanstack/react-router"

import {
  cn,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@gearment/ui3"
import {
  CreditCard,
  DatabaseZapIcon,
  FeatherIcon,
  FolderClock,
  FolderSync,
  LayoutDashboard,
  LucideIcon,
  MonitorCog,
  Settings,
  Shirt,
  ShoppingCart,
  SproutIcon,
} from "lucide-react"
import { SidebarToggle } from "./sidebar-toggle"

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
const navMain: NavItem[] = [
  {
    icon: LayoutDashboard,
    url: "/dashboard",
    title: "Dashboard",
  },
  {
    icon: CreditCard,
    url: "/finance/deposit",
    title: "Finance",
    items: [
      {
        title: "Deposit",
        url: "/finance/deposit",
      },
      {
        title: "Statement payment request",
        url: "/finance/payment-request",
      },
      {
        title: "Transactions",
        url: "/finance/transactions",
      },
    ],
  },
  {
    icon: ShoppingCart,
    url: "/order/draft-orders",
    title: "Order",
    items: [
      {
        title: "Draft orders",
        url: "/order/draft-orders",
      },
      {
        title: "Sale orders",
        url: "/order/sale-orders",
      },
      {
        title: "Error orders",
        url: "/order/error-orders",
      },
    ],
  },
  {
    icon: MonitorCog,
    url: "/system/members",
    title: "System",
    items: [
      {
        title: "Staffs",
        url: "/system/members",
      },
      {
        title: "Teams",
        url: "/system/teams",
      },
      {
        title: "Prototypes",
        url: "/prototyper",
      },
    ],
  },
  {
    icon: FolderClock,
    url: "/logs/export-transactions",
    title: "Logs",
    items: [
      {
        title: "Export transactions",
        url: "/logs/export-transactions",
      },
      {
        title: "Payment logs",
        url: "/logs/payment-logs",
      },
    ],
  },
  {
    icon: Settings,
    url: "/global-configuration/finance",
    title: "Global configuration",
    items: [
      {
        title: "Finance",
        url: "/global-configuration/finance",
      },
      {
        title: "Rush order",
        url: "/global-configuration/rush-order",
      },
      {
        title: "Tier management",
        url: "/global-configuration/tier-management",
      },
      {
        title: "Pricing Management",
        url: "/global-configuration/pricing-management",
      },
      {
        title: "Seller Pricing Engine",
        url: "/global-configuration/seller-pricing-engine",
      },
    ],
  },
  {
    icon: SproutIcon,
    title: "Fulfillment",
    url: "/fulfillment/shipping-plans",
    items: [
      {
        title: "Shipping plans",
        url: "/fulfillment/shipping-plans",
      },
    ],
  },
  {
    icon: Shirt,
    title: "Product management",
    url: "/product-management",
    items: [
      {
        title: "Categories",
        url: "/product-management/categories",
      },
      {
        title: "Prints",
        url: "/product-management/prints",
      },
      {
        title: "Products",
        url: "/product-management/products",
      },
      {
        title: "Variants",
        url: "/product-management/variants",
      },
      {
        title: "Options",
        url: "/product-management/options",
      },
      {
        title: "Attributes",
        url: "/product-management/attributes",
      },
    ],
  },
]

const navDeveloper: NavItem[] = [
  {
    icon: FolderSync,
    title: "Sync",
    url: "/dev/sync",
  },
  {
    icon: FeatherIcon,
    title: "Open features",
    url: "/dev/open-features",
  },
  {
    icon: DatabaseZapIcon,
    title: "Migration",
    url: "/dev/migration",
  },
  {
    icon: FolderClock,
    title: "Call logs",
    url: "/logs/call-logs",
  },
]

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const match = useMatch({
    from: "/_authorize",
  })

  const activatedRoute = match.context.pathname
  const { open } = useSidebar()

  return (
    <div className="relative group">
      <div className="absolute -right-2 z-[99] top-12 group-hover:opacity-100 opacity-0 transition-opacity duration-300">
        <SidebarToggle />
      </div>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="px-2 mb-[40px] mt-[20px]">
              <Link to="/">
                {open && <img src={gearmentLogo} alt="logo" />}
                {!open && (
                  <img
                    className="max-w-[40px] max-h-[40px] mx-auto  w-full h-full rounded-lg "
                    src={mgGearmentLogo}
                    alt="logo"
                  />
                )}
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {navMain.map((item) => {
                const hasItems = item.items && item.items.length > 0

                if (!hasItems) {
                  const activated = activatedRoute.includes(item.url)
                  return (
                    <SidebarMenuItem
                      key={item.url}
                      className={cn(
                        activated &&
                          "bg-sidebar-accent text-sidebar-accent-foreground text-primary",
                      )}
                    >
                      <SidebarMenuButton asChild>
                        <Link to={item.url}>
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
                        <Link to={item.url}>
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </Link>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => {
                            const activated = activatedRoute.includes(
                              subItem.url,
                            )
                            return (
                              <SidebarMenuSubItem
                                key={subItem.title}
                                className={cn(
                                  activated &&
                                    "bg-sidebar-accent text-sidebar-accent-foreground text-primary",
                                )}
                              >
                                <SidebarMenuSubButton asChild>
                                  <Link to={subItem.url}>
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
          {localStorage.getItem("dev") && (
            <SidebarGroup>
              <SidebarGroupLabel>Developer</SidebarGroupLabel>
              <SidebarMenu>
                {navDeveloper.map((item) => {
                  const hasItems = item.items && item.items.length > 0
                  if (!hasItems) {
                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild>
                          <Link to={item.url}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
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
                          <Link to={item.url}>
                            <SidebarMenuButton tooltip={item.title}>
                              {item.icon && <item.icon />}
                              <span>{item.title}</span>
                            </SidebarMenuButton>
                          </Link>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => {
                              const activated = activatedRoute.includes(
                                subItem.url,
                              )
                              return (
                                <SidebarMenuSubItem
                                  key={subItem.title}
                                  className={cn(
                                    activated &&
                                      "bg-sidebar-accent text-sidebar-accent-foreground text-primary",
                                  )}
                                >
                                  <SidebarMenuSubButton asChild>
                                    <Link to={subItem.url}>
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
          )}
        </SidebarContent>
      </Sidebar>
    </div>
  )
}
