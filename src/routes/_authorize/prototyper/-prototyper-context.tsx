import { createContext, useContext, type ReactNode } from "react"
import type { PrototypeType, CaseStudyType } from "./-components/table/columns"

const MOCK_CASE_STUDIES: CaseStudyType[] = [
  {
    id: "CS-001",
    prototypeId: "PROTO-001",
    title: "Real-time Dashboard Implementation",
    description:
      "How we built a real-time analytics dashboard for a major e-commerce client",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    content:
      "This case study demonstrates the implementation of a real-time dashboard using WebSocket connections and React Query for data synchronization. We achieved sub-second data updates with minimal server load.",
    order: 1,
    createdAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "CS-002",
    prototypeId: "PROTO-001",
    title: "Scaling to 1M+ Daily Users",
    description:
      "Performance optimization strategies that enabled our dashboard to handle massive traffic",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    content:
      "Through strategic code-splitting, lazy loading, and aggressive caching, we reduced initial load time by 70% while supporting 1M+ daily active users.",
    order: 2,
    createdAt: "2024-01-17T14:30:00Z",
  },
  {
    id: "CS-003",
    prototypeId: "PROTO-002",
    title: "Multi-Provider Payment Integration",
    description:
      "Seamlessly integrating 5+ payment providers with fallback mechanisms",
    thumbnail:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    content:
      "Our payment gateway prototype successfully integrated Stripe, PayPal, Square, Authorize.net, and local payment providers with automatic fallback and retry logic.",
    order: 1,
    createdAt: "2024-01-19T09:15:00Z",
  },
  {
    id: "CS-004",
    prototypeId: "PROTO-002",
    title: "PCI DSS Compliance Journey",
    description: "Achieving Level 1 PCI DSS compliance for payment processing",
    thumbnail:
      "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&q=80",
    content:
      "Complete documentation of our security implementation, encryption strategies, and compliance process for handling sensitive payment data.",
    order: 2,
    createdAt: "2024-01-20T11:45:00Z",
  },
  {
    id: "CS-005",
    prototypeId: "PROTO-003",
    title: "360° Customer View Implementation",
    description:
      "Building a comprehensive customer profile system with unified data",
    thumbnail:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    content:
      "We created a unified customer profile system that aggregates data from multiple sources including orders, support tickets, and preferences.",
    order: 1,
    createdAt: "2024-01-21T13:20:00Z",
  },
]

const MOCK_DATA: PrototypeType[] = [
  {
    id: "PROTO-001",
    name: "E-commerce Dashboard",
    description:
      "Main dashboard for e-commerce platform with sales analytics and product management",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    content: "Comprehensive e-commerce dashboard solution",
    caseStudies: MOCK_CASE_STUDIES.filter(
      (cs) => cs.prototypeId === "PROTO-001",
    ),
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "PROTO-002",
    name: "Payment Gateway Integration",
    description:
      "Prototype for integrating multiple payment providers with transaction monitoring",
    thumbnail:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80",
    content: "Multi-provider payment integration system",
    caseStudies: MOCK_CASE_STUDIES.filter(
      (cs) => cs.prototypeId === "PROTO-002",
    ),
    createdAt: "2024-01-18T14:20:00Z",
  },
  {
    id: "PROTO-003",
    name: "Customer Profile Management",
    description:
      "Customer profile page with order history, preferences, and support tickets",
    thumbnail:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
    content: "Unified customer profile system",
    caseStudies: MOCK_CASE_STUDIES.filter(
      (cs) => cs.prototypeId === "PROTO-003",
    ),
    createdAt: "2024-01-20T09:15:00Z",
  },
  {
    id: "PROTO-004",
    name: "Inventory Management System",
    description:
      "Real-time inventory tracking with stock alerts and supplier management",
    caseStudies: [],
    createdAt: "2024-01-22T16:45:00Z",
  },
  {
    id: "PROTO-005",
    name: "Reporting & Analytics Module",
    description:
      "Comprehensive reporting system with customizable charts and data export features",
    caseStudies: [],
    createdAt: "2024-01-25T11:00:00Z",
  },
  {
    id: "PROTO-006",
    name: "Order Fulfillment Workflow",
    description:
      "End-to-end order processing from placement to delivery tracking",
    caseStudies: [],
    createdAt: "2024-01-28T13:30:00Z",
  },
  {
    id: "PROTO-007",
    name: "Marketing Campaign Builder",
    description:
      "Visual campaign builder with email templates and customer segmentation",
    caseStudies: [],
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "PROTO-008",
    name: "Product Catalog Manager",
    description:
      "Product management interface with bulk editing, categories, and variant support",
    caseStudies: [],
    createdAt: "2024-02-05T15:20:00Z",
  },
]

interface PrototyperContextType {
  prototypes: PrototypeType[]
  loading: boolean
  total: number
  caseStudies: CaseStudyType[]
  addCaseStudy: (caseStudy: Omit<CaseStudyType, "id" | "createdAt">) => void
  updateCaseStudy: (id: string, updates: Partial<CaseStudyType>) => void
  deleteCaseStudy: (id: string) => void
}

const PrototyperContext = createContext<PrototyperContextType | null>(null)

export default function PrototyperProvider({
  children,
}: {
  children: ReactNode
}) {
  // TODO: Replace with real API hook from @gearment/nextapi
  const prototypes = MOCK_DATA
  const loading = false
  const caseStudies = MOCK_CASE_STUDIES

  const addCaseStudy = (caseStudy: Omit<CaseStudyType, "id" | "createdAt">) => {
    console.log("Adding case study:", caseStudy)
    // TODO: Implement API call
  }

  const updateCaseStudy = (id: string, updates: Partial<CaseStudyType>) => {
    console.log("Updating case study:", id, updates)
    // TODO: Implement API call
  }

  const deleteCaseStudy = (id: string) => {
    console.log("Deleting case study:", id)
    // TODO: Implement API call
  }

  return (
    <PrototyperContext.Provider
      value={{
        prototypes,
        loading,
        total: prototypes.length,
        caseStudies,
        addCaseStudy,
        updateCaseStudy,
        deleteCaseStudy,
      }}
    >
      {children}
    </PrototyperContext.Provider>
  )
}

export function usePrototyperContext() {
  const ctx = useContext(PrototyperContext)
  if (!ctx)
    throw new Error(
      "usePrototyperContext must be used within PrototyperProvider",
    )
  return ctx
}
