import { createContext, useContext, type ReactNode } from "react"
import type { ProductType } from "./-components/table/columns"

// TODO: Replace with real API hook from @gearment/nextapi
const MOCK_DATA: ProductType[] = [
  {
    id: "PRD-001",
    name: "Classic White T-Shirt",
    sku: "TSH-WHT-001",
    category: "Apparel",
    price: 29.99,
    stock: 150,
    status: "active",
    imageUrl: "https://placehold.co/100x100/e2e8f0/64748b?text=T-Shirt",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "PRD-002",
    name: "Premium Hoodie - Navy Blue",
    sku: "HOD-NAV-002",
    category: "Apparel",
    price: 59.99,
    stock: 75,
    status: "active",
    imageUrl: "https://placehold.co/100x100/e2e8f0/64748b?text=Hoodie",
    createdAt: "2024-01-18T14:20:00Z",
  },
  {
    id: "PRD-003",
    name: "Vintage Baseball Cap",
    sku: "CAP-VNT-003",
    category: "Accessories",
    price: 24.99,
    stock: 200,
    status: "active",
    imageUrl: "https://placehold.co/100x100/e2e8f0/64748b?text=Cap",
    createdAt: "2024-01-20T09:15:00Z",
  },
  {
    id: "PRD-004",
    name: "Organic Cotton Joggers",
    sku: "JOG-ORG-004",
    category: "Apparel",
    price: 49.99,
    stock: 0,
    status: "draft",
    imageUrl: "https://placehold.co/100x100/e2e8f0/64748b?text=Joggers",
    createdAt: "2024-01-22T16:45:00Z",
  },
  {
    id: "PRD-005",
    name: "Canvas Tote Bag",
    sku: "BAG-CVS-005",
    category: "Accessories",
    price: 19.99,
    stock: 320,
    status: "active",
    imageUrl: "https://placehold.co/100x100/e2e8f0/64748b?text=Tote",
    createdAt: "2024-01-25T11:00:00Z",
  },
  {
    id: "PRD-006",
    name: "Graphic Print Sweatshirt",
    sku: "SWT-GRP-006",
    category: "Apparel",
    price: 44.99,
    stock: 45,
    status: "active",
    imageUrl: "https://placehold.co/100x100/e2e8f0/64748b?text=Sweatshirt",
    createdAt: "2024-01-28T13:30:00Z",
  },
  {
    id: "PRD-007",
    name: "Leather Wallet - Brown",
    sku: "WAL-LTH-007",
    category: "Accessories",
    price: 39.99,
    stock: 85,
    status: "archived",
    imageUrl: "https://placehold.co/100x100/e2e8f0/64748b?text=Wallet",
    createdAt: "2024-02-01T08:20:00Z",
  },
  {
    id: "PRD-008",
    name: "Summer Dress - Floral",
    sku: "DRS-FLR-008",
    category: "Apparel",
    price: 64.99,
    stock: 60,
    status: "active",
    imageUrl: "https://placehold.co/100x100/e2e8f0/64748b?text=Dress",
    createdAt: "2024-02-05T15:10:00Z",
  },
]

interface ProductListingContextType {
  products: ProductType[]
  loading: boolean
  total: number
}

const ProductListingContext = createContext<ProductListingContextType | null>(
  null,
)

export default function ProductListingProvider({
  children,
}: {
  children: ReactNode
}) {
  // TODO: Replace with real API hooks from @gearment/nextapi
  const products = MOCK_DATA
  const loading = false

  return (
    <ProductListingContext.Provider
      value={{ products, loading, total: products.length }}
    >
      {children}
    </ProductListingContext.Provider>
  )
}

export function useProductListingContext() {
  const ctx = useContext(ProductListingContext)
  if (!ctx)
    throw new Error(
      "useProductListingContext must be used within ProductListingProvider",
    )
  return ctx
}
