import {
  OrderOnHoldReason,
  OrderOnHoldReasonCategory,
} from "@/services/connect-rpc/types"

export const groupReasons = (
  reasons: OrderOnHoldReason[],
  categories: OrderOnHoldReasonCategory[],
) => {
  const categoryMap: Record<string, string> = {}
  categories.forEach((cat) => {
    categoryMap[cat.categoryId] = cat.categoryName
  })

  const groups: Record<
    string,
    { group: string; reasons: OrderOnHoldReason[]; hasCustom: boolean }
  > = {}
  reasons.forEach((reason) => {
    const groupName = categoryMap[reason.categoryId] || reason.categoryId
    if (!groups[groupName]) {
      groups[groupName] = { group: groupName, reasons: [], hasCustom: false }
    }
    groups[groupName].reasons.push(reason)
    if (reason.isCustom) {
      groups[groupName].hasCustom = true
    }
  })

  const allGroups = Object.values(groups)
  const nonCustomGroups = allGroups
    .filter((g) => !g.hasCustom)
    .sort((a, b) => a.group.localeCompare(b.group))
  const customGroups = allGroups
    .filter((g) => g.hasCustom)
    .sort((a, b) => a.group.localeCompare(b.group))

  return [...nonCustomGroups, ...customGroups]
}
