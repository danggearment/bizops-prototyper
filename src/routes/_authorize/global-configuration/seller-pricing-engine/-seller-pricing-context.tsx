import {
  PricingSummaryStats,
  SellerPricingSearchType,
  SellerProduct,
} from "@/schemas/schemas/seller-pricing"
import { useNavigate } from "@tanstack/react-router"
import { RowSelectionState } from "@tanstack/react-table"
import { createContext, useCallback, useContext, useState } from "react"

interface SellerPricingContextValue {
  // Row selection state
  rowSelection: RowSelectionState
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>

  // Expanded rows state (for product -> variant expansion)
  expandedRows: Record<string, boolean>
  toggleRowExpansion: (productId: string) => void

  // Filter handling
  handleSetFilter: (search: SellerPricingSearchType) => void

  // Summary stats (mock for now - would come from API)
  summaryStats: PricingSummaryStats

  // Products data (mock for now)
  products: SellerProduct[]
}

const SellerPricingContext = createContext<SellerPricingContextValue | null>(
  null,
)

interface Props {
  children: React.ReactNode
}

export function SellerPricingProvider({ children }: Props) {
  const navigate = useNavigate({
    from: "/global-configuration/seller-pricing-engine",
  })

  // Row selection state
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // Expanded rows for showing variants
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  // Toggle row expansion
  const toggleRowExpansion = useCallback((productId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }, [])

  // Filter handling with navigation
  const handleSetFilter = useCallback(
    (search: SellerPricingSearchType) => {
      setRowSelection({})
      navigate({
        search: () => search,
        replace: true,
      })
    },
    [navigate],
  )

  // Mock summary stats - in production, this would come from API
  const summaryStats: PricingSummaryStats = {
    totalProducts: 1248,
    totalVariants: 8932,
    inheritedPricing: 7156,
    pricingOverrides: 1776,
  }

  // Mock products data - in production, this would come from API
  const products: SellerProduct[] = generateMockProducts()

  return (
    <SellerPricingContext.Provider
      value={{
        rowSelection,
        setRowSelection,
        expandedRows,
        toggleRowExpansion,
        handleSetFilter,
        summaryStats,
        products,
      }}
    >
      {children}
    </SellerPricingContext.Provider>
  )
}

export function useSellerPricing() {
  const context = useContext(SellerPricingContext)
  if (!context) {
    throw new Error(
      "useSellerPricing must be used within a SellerPricingProvider",
    )
  }
  return context
}

// Mock data generator for demo purposes
function generateMockProducts(): SellerProduct[] {
  return [
    {
      productId: "prod-001",
      productName: "Classic Cotton T-Shirt",
      productCode: "TSH-001",
      productImage: "https://placehold.co/60x60/e2e8f0/475569?text=T",
      productType: "T-Shirt",
      rspMin: 18.99,
      rspMax: 24.99,
      totalVariants: 12,
      overrideCount: 3,
      status: "active" as const,
      lastUpdated: new Date("2025-01-28"),
      variants: [
        {
          variantId: "var-001-1",
          sku: "TSH-001-RED-S",
          options: { Color: "Red", Size: "S" },
          rsp: 18.99,
          pricingSource: "inherited" as const,
          tierDiscount: 10,
          customDiscount: 0,
          fixedAddons: 2.5,
          finalSellerPrice: 19.59,
          status: "active" as const,
        },
        {
          variantId: "var-001-2",
          sku: "TSH-001-RED-M",
          options: { Color: "Red", Size: "M" },
          rsp: 19.99,
          pricingSource: "inherited" as const,
          tierDiscount: 10,
          customDiscount: 0,
          fixedAddons: 2.5,
          finalSellerPrice: 20.49,
          status: "active" as const,
        },
        {
          variantId: "var-001-3",
          sku: "TSH-001-BLUE-L",
          options: { Color: "Blue", Size: "L" },
          rsp: 21.99,
          pricingSource: "override" as const,
          tierDiscount: 10,
          customDiscount: 5,
          fixedAddons: 2.5,
          finalSellerPrice: 21.19,
          status: "active" as const,
        },
        {
          variantId: "var-001-4",
          sku: "TSH-001-BLUE-XL",
          options: { Color: "Blue", Size: "XL" },
          rsp: 24.99,
          pricingSource: "override" as const,
          tierDiscount: 10,
          customDiscount: 5,
          fixedAddons: 3.0,
          finalSellerPrice: 24.24,
          status: "active" as const,
        },
      ],
    },
    {
      productId: "prod-002",
      productName: "Premium Heavyweight Hoodie",
      productCode: "HOD-002",
      productImage: "https://placehold.co/60x60/e2e8f0/475569?text=H",
      productType: "Hoodie",
      rspMin: 42.99,
      rspMax: 54.99,
      totalVariants: 8,
      overrideCount: 1,
      status: "active" as const,
      lastUpdated: new Date("2025-01-27"),
      variants: [
        {
          variantId: "var-002-1",
          sku: "HOD-002-BLK-M",
          options: { Color: "Black", Size: "M" },
          rsp: 42.99,
          pricingSource: "inherited" as const,
          tierDiscount: 15,
          customDiscount: 0,
          fixedAddons: 4.0,
          finalSellerPrice: 40.54,
          status: "active" as const,
        },
        {
          variantId: "var-002-2",
          sku: "HOD-002-BLK-XXL",
          options: { Color: "Black", Size: "XXL" },
          rsp: 54.99,
          pricingSource: "override" as const,
          tierDiscount: 15,
          customDiscount: 3,
          fixedAddons: 5.0,
          finalSellerPrice: 50.09,
          status: "active" as const,
        },
      ],
    },
    {
      productId: "prod-003",
      productName: "Ceramic Photo Mug",
      productCode: "MUG-003",
      productImage: "https://placehold.co/60x60/e2e8f0/475569?text=M",
      productType: "Mug",
      rspMin: 12.99,
      rspMax: 16.99,
      totalVariants: 4,
      overrideCount: 0,
      status: "active" as const,
      lastUpdated: new Date("2025-01-26"),
      variants: [
        {
          variantId: "var-003-1",
          sku: "MUG-003-11OZ",
          options: { Size: "11oz" },
          rsp: 12.99,
          pricingSource: "inherited" as const,
          tierDiscount: 5,
          customDiscount: 0,
          fixedAddons: 1.5,
          finalSellerPrice: 13.84,
          status: "active" as const,
        },
        {
          variantId: "var-003-2",
          sku: "MUG-003-15OZ",
          options: { Size: "15oz" },
          rsp: 14.99,
          pricingSource: "inherited" as const,
          tierDiscount: 5,
          customDiscount: 0,
          fixedAddons: 2.0,
          finalSellerPrice: 16.24,
          status: "active" as const,
        },
      ],
    },
    {
      productId: "prod-004",
      productName: "Canvas Wall Poster",
      productCode: "PST-004",
      productImage: "https://placehold.co/60x60/e2e8f0/475569?text=P",
      productType: "Poster",
      rspMin: 19.99,
      rspMax: 89.99,
      totalVariants: 6,
      overrideCount: 2,
      status: "inactive" as const,
      lastUpdated: new Date("2025-01-20"),
      variants: [
        {
          variantId: "var-004-1",
          sku: "PST-004-12X18",
          options: { Size: '12"x18"' },
          rsp: 19.99,
          pricingSource: "inherited" as const,
          tierDiscount: 10,
          customDiscount: 0,
          fixedAddons: 3.0,
          finalSellerPrice: 20.99,
          status: "inactive" as const,
        },
        {
          variantId: "var-004-2",
          sku: "PST-004-24X36",
          options: { Size: '24"x36"' },
          rsp: 49.99,
          pricingSource: "override" as const,
          tierDiscount: 10,
          customDiscount: 8,
          fixedAddons: 5.0,
          finalSellerPrice: 46.0,
          status: "inactive" as const,
        },
      ],
    },
    {
      productId: "prod-005",
      productName: "Silicone Phone Case",
      productCode: "PHC-005",
      productImage: "https://placehold.co/60x60/e2e8f0/475569?text=C",
      productType: "Phone Case",
      rspMin: 14.99,
      rspMax: 19.99,
      totalVariants: 15,
      overrideCount: 5,
      status: "active" as const,
      lastUpdated: new Date("2025-01-25"),
      variants: [
        {
          variantId: "var-005-1",
          sku: "PHC-005-IP15-CLR",
          options: { Model: "iPhone 15", Color: "Clear" },
          rsp: 14.99,
          pricingSource: "inherited" as const,
          tierDiscount: 10,
          customDiscount: 0,
          fixedAddons: 1.0,
          finalSellerPrice: 14.49,
          status: "active" as const,
        },
        {
          variantId: "var-005-2",
          sku: "PHC-005-IP15P-BLK",
          options: { Model: "iPhone 15 Pro", Color: "Black" },
          rsp: 17.99,
          pricingSource: "override" as const,
          tierDiscount: 10,
          customDiscount: 5,
          fixedAddons: 1.0,
          finalSellerPrice: 16.29,
          status: "active" as const,
        },
      ],
    },
  ]
}
