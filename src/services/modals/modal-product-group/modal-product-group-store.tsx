import { create } from "zustand"

export interface RushVariant {
  variantId: string
  variantName: string
  variantSku: string
  selected: boolean
  disabled: boolean
}

export interface ProductGroup {
  productId: string
  productName: string
  productSku: string
  listRushVariant: RushVariant[]
}
export interface ProductInfo {
  name: string
  quantity: number
  description: string
  platforms: string[]
}

interface ProductGroupStore {
  open: boolean
  productGroup: ProductGroup[]
  productGroupId: string
  callback: () => void
  actions: {
    setOpen: (open: boolean, callback?: () => void) => void
    addProduct: (product: ProductGroup) => void
    deleteProductGroup: (productId: string) => void
    updateSelected: (
      productId: string,
      variantId: string,
      selected: boolean,
    ) => void
    setProductGroup: (productGroup: ProductGroup[]) => void
    setProductGroupId: (productGroupId: string) => void
  }
}

export const useProductGroupStore = create<ProductGroupStore>((set) => ({
  open: false,
  productGroup: [],
  productGroupId: "",
  callback: () => {},
  actions: {
    setOpen: (open, callback) => set({ open, callback }),
    addProduct: (product) =>
      set((state) => ({
        productGroup: [...state.productGroup, product],
      })),
    deleteProductGroup: (productId) =>
      set((state) => ({
        productGroup: state.productGroup.filter(
          (product) => product.productId !== productId,
        ),
      })),
    setProductGroup: (productGroup) => set({ productGroup }),
    setProductGroupId: (productGroupId) => set({ productGroupId }),
    updateSelected: (productId, variantId, selected) =>
      set((state) => ({
        productGroup: state.productGroup.map((product) =>
          product.productId === productId
            ? {
                ...product,
                listRushVariant: product.listRushVariant.map((variant) =>
                  variant.variantId === variantId
                    ? { ...variant, selected }
                    : variant,
                ),
              }
            : product,
        ),
      })),
  },
}))
