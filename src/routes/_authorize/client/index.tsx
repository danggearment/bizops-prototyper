import { PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { useState, useCallback } from "react"
import { ClientSearchSchema } from "@/schemas/schemas/client"
import ClientProvider, { useClientContext } from "./-client-context"
import Filter from "./-components/filter/filter"
import Table from "./-components/table/table"
import ClientDialog from "./-components/client-dialog"
import type { ClientType } from "./-components/table/columns"
import type { ClientFormType } from "@/schemas/schemas/client"

export const Route = createFileRoute("/_authorize/client/")({ 
  validateSearch: zodValidator(ClientSearchSchema),
  search: {
    middlewares: [stripSearchParams(ClientSearchSchema.parse({}))],
  },
  component: () => (
    <ClientProvider>
      <Index />
    </ClientProvider>
  ),
  beforeLoad: () => ({
    breadcrumb: [{ link: "/client", name: "Client" }],
  }),
})

function Index() {
  const { createClient, updateClient } = useClientContext()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientType | null>(null)

  const handleCreateClick = useCallback(() => {
    setEditingClient(null)
    setDialogOpen(true)
  }, [])

  const handleEditClick = useCallback((client: ClientType) => {
    setEditingClient(client)
    setDialogOpen(true)
  }, [])

  const handleSubmit = useCallback(
    (data: ClientFormType) => {
      if (editingClient) {
        updateClient(editingClient.id, data)
      } else {
        createClient(data)
      }
    },
    [editingClient, createClient, updateClient]
  )

  return (
    <>
      <PageHeader>
        <PageHeader.Title>Client</PageHeader.Title>
      </PageHeader>
      <div className="space-y-4">
        <Filter onCreateClick={handleCreateClick} />
        <Table onEdit={handleEditClick} />
      </div>
      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={editingClient}
        onSubmit={handleSubmit}
      />
    </>
  )
}