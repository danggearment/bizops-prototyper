import {
  GMProduct_ShippingPolicy_Variant,
  GMProduct_TeamProductDetail_Category,
} from "@/services/connect-rpc/types"
import { formatPrice } from "@/utils"

export interface Category extends GMProduct_TeamProductDetail_Category {
  children?: Category[]
}

export function buildCategoryTree(
  flat: GMProduct_TeamProductDetail_Category[],
): Category[] {
  const items = flat.map((item) => ({
    ...item,
    categoryId: BigInt(item.categoryId),
    parentId: BigInt(item.parentId),
  }))

  function recurse(parentId: bigint): Category[] {
    return items
      .filter((item) => item.parentId === parentId)
      .map((item) => {
        const childCategories = recurse(item.categoryId)
        if (childCategories.length > 0) {
          return {
            ...item,
            children: childCategories,
          } as Category
        } else {
          return {
            ...item,
            children: undefined,
          } as Category
        }
      })
  }

  const tree = recurse(BigInt(0))
  return tree
}

interface LeafPath {
  path: Category[]
  leaf: Category
  pathId: string
}

export function findAllLeafPaths(
  categories: Category[],
  currentPath: Category[] = [],
): LeafPath[] {
  const leafPaths: LeafPath[] = []

  for (const category of categories) {
    const newPath = [...currentPath, category]
    const hasChildren = category.children && category.children.length > 0

    if (hasChildren) {
      leafPaths.push(...findAllLeafPaths(category.children!, newPath))
    } else {
      const pathId = newPath.map((c) => c.categoryId.toString()).join("-")
      leafPaths.push({
        path: newPath,
        leaf: category,
        pathId,
      })
    }
  }

  return leafPaths
}

export enum ShippingServiceCode {
  STANDARD = "standard",
  GROUND = "ground",
  FASTSHIP = "fastship",
  STAMP = "stamp",
}

export enum InternationalShippingServiceCode {
  IN_STAMP = "in_stamp",
  IN_STANDARD = "in_standard",
}

export const handleProductShippingFee = (
  variants: GMProduct_ShippingPolicy_Variant[],
  domesticCode: ShippingServiceCode,
  isAdditional = false,
  isInternational = false,
  internationalCode?: InternationalShippingServiceCode,
) => {
  const price = variants[0]?.servicePrices.find(
    (v) =>
      v.serviceCode === (isInternational ? internationalCode : domesticCode) &&
      (isAdditional ? v.isAdditional : !v.isAdditional),
  )?.price

  const formattedPrice = price ? formatPrice(price) : "--"

  return formattedPrice === "$0.00" ? "--" : formattedPrice
}

export const handleHTMLUnescape = (html: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  return doc.body.textContent || ""
}
