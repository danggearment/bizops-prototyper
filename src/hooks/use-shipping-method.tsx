import { useQueryPod } from "@/services/connect-rpc/transport.tsx"
import { staffListShippingMethod } from "@gearment/nextapi/api/pod/v1/policy-PolicyAPI_connectquery"
import { useMemo } from "react"

export default function useShippingMethod() {
  const { data: shippingMethods } = useQueryPod(
    staffListShippingMethod,
    {},
    {
      select: (data) => data.shippingMethods,
    },
  )
  const getShippingMethodName = (shippingCode: string) => {
    return (shippingMethods || []).find(
      (shippingMethod) => shippingCode === shippingMethod.code,
    )?.name
  }

  const shippingMethodsOption = useMemo(() => {
    return (shippingMethods || []).map((shippingMethod) => ({
      value: shippingMethod.code,
      text: shippingMethod.name,
    }))
  }, [shippingMethods])

  return {
    shippingMethods,
    getShippingMethodName,
    shippingMethodsOption,
  }
}
