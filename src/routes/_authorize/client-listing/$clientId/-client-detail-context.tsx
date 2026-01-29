import { createContext, useContext, type ReactNode } from "react"

export interface ClientOrder {
  id: string
  orderNumber: string
  status: "pending" | "processing" | "completed" | "cancelled"
  items: number
  total: number
  createdAt: string
}

export interface ClientPayment {
  id: string
  transactionId: string
  method: "credit_card" | "bank_transfer" | "paypal"
  amount: number
  status: "completed" | "pending" | "failed" | "refunded"
  createdAt: string
}

export interface ClientNote {
  id: string
  author: string
  content: string
  createdAt: string
}

export interface ClientDetail {
  id: string
  name: string
  email: string
  phone: string
  type: "enterprise" | "small-business" | "individual"
  status: "active" | "inactive" | "pending"
  company: string | null
  address: string
  city: string
  country: string
  postalCode: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate: string | null
  createdAt: string
  updatedAt: string
  orders: ClientOrder[]
  payments: ClientPayment[]
  notes: ClientNote[]
}

const MOCK_CLIENT: ClientDetail = {
  id: "CLT-001",
  name: "Acme Corporation",
  email: "contact@acmecorp.com",
  phone: "+1 (555) 123-4567",
  type: "enterprise",
  status: "active",
  company: "Acme Corporation Inc.",
  address: "123 Business Avenue, Suite 500",
  city: "San Francisco",
  country: "United States",
  postalCode: "94102",
  totalOrders: 47,
  totalSpent: 125750.0,
  averageOrderValue: 2676.6,
  lastOrderDate: "2024-01-10T14:30:00Z",
  createdAt: "2023-03-15T09:00:00Z",
  updatedAt: "2024-01-10T14:30:00Z",
  orders: [
    {
      id: "ORD-001",
      orderNumber: "ORD-2024-0147",
      status: "completed",
      items: 5,
      total: 3250.0,
      createdAt: "2024-01-10T14:30:00Z",
    },
    {
      id: "ORD-002",
      orderNumber: "ORD-2024-0098",
      status: "completed",
      items: 3,
      total: 1875.5,
      createdAt: "2024-01-05T11:20:00Z",
    },
    {
      id: "ORD-003",
      orderNumber: "ORD-2023-0892",
      status: "processing",
      items: 8,
      total: 4520.0,
      createdAt: "2023-12-28T16:45:00Z",
    },
    {
      id: "ORD-004",
      orderNumber: "ORD-2023-0756",
      status: "completed",
      items: 2,
      total: 890.0,
      createdAt: "2023-12-15T09:30:00Z",
    },
    {
      id: "ORD-005",
      orderNumber: "ORD-2023-0621",
      status: "cancelled",
      items: 4,
      total: 2100.0,
      createdAt: "2023-12-01T13:00:00Z",
    },
  ],
  payments: [
    {
      id: "PAY-001",
      transactionId: "TXN-20240110-001",
      method: "credit_card",
      amount: 3250.0,
      status: "completed",
      createdAt: "2024-01-10T14:35:00Z",
    },
    {
      id: "PAY-002",
      transactionId: "TXN-20240105-002",
      method: "bank_transfer",
      amount: 1875.5,
      status: "completed",
      createdAt: "2024-01-05T11:25:00Z",
    },
    {
      id: "PAY-003",
      transactionId: "TXN-20231228-003",
      method: "credit_card",
      amount: 4520.0,
      status: "pending",
      createdAt: "2023-12-28T16:50:00Z",
    },
    {
      id: "PAY-004",
      transactionId: "TXN-20231215-004",
      method: "paypal",
      amount: 890.0,
      status: "completed",
      createdAt: "2023-12-15T09:35:00Z",
    },
    {
      id: "PAY-005",
      transactionId: "TXN-20231201-005",
      method: "credit_card",
      amount: 2100.0,
      status: "refunded",
      createdAt: "2023-12-01T13:05:00Z",
    },
  ],
  notes: [
    {
      id: "NOTE-001",
      author: "John Smith",
      content:
        "Client requested priority shipping for all future orders. Approved by management.",
      createdAt: "2024-01-08T10:00:00Z",
    },
    {
      id: "NOTE-002",
      author: "Sarah Johnson",
      content:
        "Discussed annual contract renewal. Client interested in volume discount for 2024.",
      createdAt: "2023-12-20T15:30:00Z",
    },
    {
      id: "NOTE-003",
      author: "Mike Davis",
      content:
        "Resolved billing issue from November. Client confirmed satisfaction with resolution.",
      createdAt: "2023-12-05T11:45:00Z",
    },
  ],
}

interface ClientDetailContextType {
  client: ClientDetail
  loading: boolean
}

const ClientDetailContext = createContext<ClientDetailContextType | null>(null)

export default function ClientDetailProvider({
  children,
}: {
  children: ReactNode
}) {
  // TODO: Replace with real API hook from @gearment/nextapi
  // const { data: client, isLoading } = useGetClient(clientId)
  const client = MOCK_CLIENT
  const loading = false

  return (
    <ClientDetailContext.Provider value={{ client, loading }}>
      {children}
    </ClientDetailContext.Provider>
  )
}

export function useClientDetailContext() {
  const ctx = useContext(ClientDetailContext)
  if (!ctx)
    throw new Error(
      "useClientDetailContext must be used within ClientDetailProvider",
    )
  return ctx
}
