import {
  LoadingCircle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gearment/ui3"

import { useSystemConfiguration } from "../-system-configuration-context"
import AutoApproveDepositTab from "./auto-approve-deposit-tab"

export function FinanceConfiguration() {
  const { isLoadingFinance, isLoadingPaymentMethod } = useSystemConfiguration()

  if (isLoadingFinance || isLoadingPaymentMethod) {
    return (
      <div className="h-48 flex items-center justify-center">
        <LoadingCircle />
      </div>
    )
  }

  return (
    <Tabs defaultValue="auto-approve-deposit">
      <TabsList className="bg-sidebar">
        <TabsTrigger value="auto-approve-deposit">
          Auto approve deposit config
        </TabsTrigger>
      </TabsList>

      <TabsContent value="auto-approve-deposit">
        <AutoApproveDepositTab />
      </TabsContent>
    </Tabs>
  )
}
