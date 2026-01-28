import { createContext, useContext, type ReactNode } from "react"
import type { PrototypeType } from "./-components/table/columns"

const MOCK_DATA: PrototypeType[] = [
  {
    id: "PROTO-001",
    name: "E-commerce Dashboard",
    description: "Main dashboard for e-commerce platform with sales analytics and product management",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "PROTO-002",
    name: "Payment Gateway Integration",
    description: "Prototype for integrating multiple payment providers with transaction monitoring",
    createdAt: "2024-01-18T14:20:00Z",
  },
  {
    id: "PROTO-003",
    name: "Customer Profile Management",
    description: "Customer profile page with order history, preferences, and support tickets",
    createdAt: "2024-01-20T09:15:00Z",
  },
  {
    id: "PROTO-004",
    name: "Inventory Management System",
    description: "Real-time inventory tracking with stock alerts and supplier management",
    createdAt: "2024-01-22T16:45:00Z",
  },
  {
    id: "PROTO-005",
    name: "Reporting & Analytics Module",
    description: "Comprehensive reporting system with customizable charts and data export features",
    createdAt: "2024-01-25T11:00:00Z",
  },
  {
    id: "PROTO-006",
    name: "Order Fulfillment Workflow",
    description: "End-to-end order processing from placement to delivery tracking",
    createdAt: "2024-01-28T13:30:00Z",
  },
  {
    id: "PROTO-007",
    name: "Marketing Campaign Builder",
    description: "Visual campaign builder with email templates and customer segmentation",
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "PROTO-008",
    name: "Product Catalog Manager",
    description: "Product management interface with bulk editing, categories, and variant support",
    createdAt: "2024-02-05T15:20:00Z",
  },
]

interface PrototyperContextType {
  prototypes: PrototypeType[]
  loading: boolean
  total: number
}

const PrototyperContext = createContext<PrototyperContextType | null>(null)

export default function PrototyperProvider({ children }: { children: ReactNode }) {
  // TODO: Replace with real API hook from @gearment/nextapi
  const prototypes = MOCK_DATA
  const loading = false

  return (
    <PrototyperContext.Provider value={{ prototypes, loading, total: prototypes.length }}>
      {children}
    </PrototyperContext.Provider>
  )
}

export function usePrototyperContext() {
  const ctx = useContext(PrototyperContext)
  if (!ctx) throw new Error("usePrototyperContext must be used within PrototyperProvider")
  return ctx
}