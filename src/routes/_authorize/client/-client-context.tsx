import { createContext, useContext, useState, type ReactNode } from "react"
import type { ClientType } from "./-components/table/columns"

// TODO: Replace with real API hook from @gearment/nextapi
const MOCK_DATA: ClientType[] = [
  { id: "CLT001", name: "Acme Corporation" },
  { id: "CLT002", name: "TechStart Inc." },
  { id: "CLT003", name: "Global Ventures Ltd." },
  { id: "CLT004", name: "Digital Solutions Co." },
  { id: "CLT005", name: "Innovation Labs" },
  { id: "CLT006", name: "Summit Enterprises" },
  { id: "CLT007", name: "NextGen Systems" },
  { id: "CLT008", name: "Prime Analytics" },
]

interface ClientContextType {
  clients: ClientType[]
  loading: boolean
  total: number
  createClient: (data: { name: string }) => void
  updateClient: (id: string, data: { name: string }) => void
}

const ClientContext = createContext<ClientContextType | null>(null)

export default function ClientProvider({ children }: { children: ReactNode }) {
  // TODO: Replace with real API hooks from @gearment/nextapi
  const [clients, setClients] = useState<ClientType[]>(MOCK_DATA)
  const loading = false

  const createClient = (data: { name: string }) => {
    // TODO: Replace with real API mutation
    const newClient: ClientType = {
      id: `CLT${String(clients.length + 1).padStart(3, "0")}`,
      name: data.name,
    }
    setClients((prev) => [newClient, ...prev])
  }

  const updateClient = (id: string, data: { name: string }) => {
    // TODO: Replace with real API mutation
    setClients((prev) =>
      prev.map((client) =>
        client.id === id ? { ...client, name: data.name } : client,
      ),
    )
  }

  return (
    <ClientContext.Provider
      value={{
        clients,
        loading,
        total: clients.length,
        createClient,
        updateClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}

export function useClientContext() {
  const ctx = useContext(ClientContext)
  if (!ctx)
    throw new Error("useClientContext must be used within ClientProvider")
  return ctx
}
