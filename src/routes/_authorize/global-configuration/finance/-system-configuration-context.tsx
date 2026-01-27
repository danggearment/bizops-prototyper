import { useQueryFinance } from "@/services/connect-rpc/transport"
import {
  AutoApproveDepositConfig,
  PaymentMethod_StaffConfig,
} from "@/services/connect-rpc/types"
import {
  staffListPaymentMethodConfig,
  staffListSystemConfiguration,
} from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import { createContext, useContext } from "react"

interface SystemConfigurationContextValue {
  autoApproveDepositConfig?: AutoApproveDepositConfig
  paymentMethodConfig?: PaymentMethod_StaffConfig[]
  isLoadingFinance: boolean
  isLoadingPaymentMethod: boolean
}
const SystemConfigurationContext =
  createContext<SystemConfigurationContextValue | null>(null)

export function SystemConfigurationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: financeSystemConfiguration, isLoading: isLoadingFinance } =
    useQueryFinance(
      staffListSystemConfiguration,
      {},
      {
        select: (data) => data,
      },
    )

  const { data: paymentMethodConfig, isLoading: isLoadingPaymentMethod } =
    useQueryFinance(
      staffListPaymentMethodConfig,
      {},
      {
        select: (data) => data?.data || [],
      },
    )

  return (
    <SystemConfigurationContext.Provider
      value={{
        autoApproveDepositConfig:
          financeSystemConfiguration?.autoApproveDepositConfig,
        paymentMethodConfig: paymentMethodConfig,
        isLoadingFinance,
        isLoadingPaymentMethod,
      }}
    >
      {children}
    </SystemConfigurationContext.Provider>
  )
}

export function useSystemConfiguration() {
  const ctx = useContext(SystemConfigurationContext)
  if (!ctx)
    throw new Error(
      "useSystemConfiguration must be used within SystemConfigurationProvider",
    )
  return ctx
}
