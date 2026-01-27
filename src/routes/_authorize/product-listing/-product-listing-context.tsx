import { createContext, useContext, type ReactNode } from "react"
import type { ProductType } from "./-components/table/columns"

// TODO: Replace with real API hook from @gearment/nextapi
const MOCK_DATA: ProductType[] = [
  {
    id: "PRD-001",
    sku: "SKU-TSH-BLK-M",
    name: "Classic Black T-Shirt",
    category: "Apparel",
    price: 29.99,
    stock: 150,
    status: "active",
    imageUrl: "https://placehold.co/80x80/1a1a1a/ffffff?text=T",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "PRD-002",
    sku: "SKU-MUG-WHT-01",
    name: "White Ceramic Mug",
    category: "Drinkware",
    price: 14.99,
    stock: 320,
    status: "active",
    imageUrl: "https://placehold.co/80x80/f5f5f5/333333?text=M",
    createdAt: "2024-01-18T14:20:00Z",
  },
  {
    id: "PRD-003",
    sku: "SKU-CAP-NVY-L",
    name: "Navy Blue Baseball Cap",
    category: "Accessories",
    price: 24.99,
    stock: 0,
    status: "inactive",
    imageUrl: "https://placehold.co/80x80/1e3a5f/ffffff?text=C",
    createdAt: "2024-01-20T09:15:00Z",
  },
  {
    id: "PRD-004",
    sku: "SKU-HOD-GRY-XL",
    name: "Gray Hoodie",
    category: "Apparel",
    price: 54.99,
    stock: 85,
    status: "active",
    imageUrl: "https://placehold.co/80x80/6b7280/ffffff?text=H",
    createdAt: "2024-02-01T11:45:00Z",
  },
  {
    id: "PRD-005",
    sku: "SKU-TOT-CAN-01",
    name: "Canvas Tote Bag",
    category: "Bags",
    price: 19.99,
    stock: 200,
    status: "active",
    imageUrl: "https://placehold.co/80x80/d4a574/333333?text=B",
    createdAt: "2024-02-05T16:30:00Z",
  },
  {
    id: "PRD-006",
    sku: "SKU-PHN-CS-IP15",
    name: "iPhone 15 Phone Case",
    category: "Accessories",
    price: 34.99,
    stock: 45,
    status: "draft",
    imageUrl: "https://placehold.co/80x80/ec4899/ffffff?text=P",
    createdAt: "2024-02-10T08:00:00Z",
  },
  {
    id: "PRD-007",
    sku: "SKU-PST-A3-01",
    name: "Abstract Art Poster A3",
    category: "Wall Art",
    price: 12.99,
    stock: 500,
    status: "active",
    imageUrl: "https://placehold.co/80x80/8b5cf6/ffffff?text=A",
    createdAt: "2024-02-12T13:20:00Z",
  },
  {
    id: "PRD-008",
    sku: "SKU-NTB-A5-LN",
    name: "Lined Notebook A5",
    category: "Stationery",
    price: 8.99,
    stock: 1200,
    status: "active",
    imageUrl: "https://placehold.co/80x80/059669/ffffff?text=N",
    createdAt: "2024-02-15T10:10:00Z",
  },
]

interface ProductListingContextType {
  products: ProductType[]
  loading: boolean
  total: number
}

const ProductListingContext = createContext<ProductListingContextType | null>(null)

export default function ProductListingProvider({ children }: { children: ReactNode }) {
  // TODO: Replace with real API hooks from @gearment/nextapi
  const products = MOCK_DATA
  const loading = false

  return (
    <ProductListingContext.Provider value={{ products, loading, total: products.length }}>
      {children}
    </ProductListingContext.Provider>
  )
}

export function useProductListingContext() {
  const ctx = useContext(ProductListingContext)
  if (!ctx) throw new Error("useProductListingContext must be used within ProductListingProvider")
  return ctx
}