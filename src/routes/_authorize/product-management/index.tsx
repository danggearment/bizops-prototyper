import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authorize/product-management/")({
  component: () => <></>,
  beforeLoad: async () => {
    throw redirect({
      to: "/product-management/categories",
      replace: true,
    })
  },
})
