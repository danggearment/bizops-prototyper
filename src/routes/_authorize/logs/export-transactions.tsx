import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authorize/logs/export-transactions")({
  staticData: {
    breadcrumb: [
      {
        name: "Logs",
        link: "#",
      },
      {
        name: "Export transactions",
        link: "/logs/export-transactions",
      },
    ],
  },
})
