import {
  Order_StaffSortCriterion_SortBy,
  Order_StaffSortCriterion_SortDirection,
} from "@/services/connect-rpc/types"
import { toast } from "@gearment/ui3"

export const handleDownloadPDF = (fileUrl: string, fileName: string = "") => {
  fetch(fileUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${fileName || fileUrl}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast({
        title: "Download file",
        description: `Download file successfully`,
      })
    })
    .catch(() => {
      toast({
        variant: "destructive",
        title: "Download file",
        description: `Download file error`,
      })
    })
}

export const handleHighlightRecord = (
  listIds: string[],
  isSuccess: boolean,
) => {
  // TODO: bug highlight when change page
  setTimeout(() => {
    listIds.forEach((ids) => {
      const tr = document.getElementById(`${ids}`)
      if (tr) {
        if (isSuccess) {
          tr.setAttribute("style", "color:#1a8245; text-decoration: underline;")
        } else {
          tr.setAttribute("style", "color:#e10e0e; text-decoration: underline;")
        }

        setTimeout(() => {
          tr.setAttribute("style", "")
        }, 5000)
      }
    })
  })
}

export const sortByMapping: Record<string, Order_StaffSortCriterion_SortBy> = {
  paidAt: Order_StaffSortCriterion_SortBy.PAID_AT,
  updatedAt: Order_StaffSortCriterion_SortBy.UPDATED_AT,
}

export const sortDirectionMapping: Record<
  string,
  Order_StaffSortCriterion_SortDirection
> = {
  asc: Order_StaffSortCriterion_SortDirection.ASC,
  desc: Order_StaffSortCriterion_SortDirection.DESC,
}
