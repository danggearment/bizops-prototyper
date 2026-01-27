import { PageHeader } from "@gearment/ui3"
import { createFileRoute } from "@tanstack/react-router"
import { FinanceConfiguration } from "./-components/finance-configuration"
import { SystemConfigurationProvider } from "./-system-configuration-context"

export const Route = createFileRoute(
  "/_authorize/global-configuration/finance/",
)({
  staticData: {
    breadcrumb: [
      {
        name: "Global configuration",
        link: "/global-configuration",
      },
      {
        name: "Finance configuration",
        link: "/global-configuration/finance",
      },
    ],
  },
  component: () => (
    <SystemConfigurationProvider>
      <Index />
    </SystemConfigurationProvider>
  ),
})

function Index() {
  return (
    <div className="space-y-6">
      <PageHeader>
        <PageHeader.Title>Finance configuration</PageHeader.Title>
      </PageHeader>

      <FinanceConfiguration />
    </div>
  )
}
