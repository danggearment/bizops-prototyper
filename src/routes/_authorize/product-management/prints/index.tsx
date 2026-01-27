import { PrintLocationSearchSchema } from "@/schemas/schemas/prints"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authorize/product-management/prints/")({
  beforeLoad: async () => {
    throw redirect({
      to: "/product-management/prints/location",
      search: PrintLocationSearchSchema.parse({}),
      replace: true,
    })
  },
  component: () => <></>,
})
