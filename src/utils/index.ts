import { AllPositionOfClothes } from "@/constants/position-of-clothes.ts"
import { Money } from "@/services/connect-rpc/types"
import { MyUppyFile } from "@/services/uploader/uppy.ts"
import {
  BusinessError,
  InternalError,
} from "@gearment/nextapi/common/error/v1/bizerr_pb.ts"
import { MediaUsage } from "@gearment/nextapi/common/media/v1/media_pb"
import { formatCurrency, generateUniqueId } from "@gearment/utils"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

interface BusinessErrorItem {
  type: "common.error.v1.BusinessError"
  value: string
  debug: BusinessError
}
interface InternalErrorItem {
  type: "common.error.v1.InternalError"
  value: string
  debug: InternalError
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleClearSession() {}

export interface ErrorResponse {
  code: string
  message: string
  details: (BusinessErrorItem | InternalErrorItem)[]
}

export function getBusinessCode(error: ErrorResponse) {
  const businessErrorCode = error.details.find(
    (e) => e.type === "common.error.v1.BusinessError",
  )?.debug

  return businessErrorCode as BusinessError | undefined
}

export function formatPrice(price: Money | undefined) {
  if (!price) return ""
  const positiveNanos = Math.abs(price.nanos).toString().padStart(2, "0")
  return `${formatCurrency(Number(price.units), { maximumFractionDigits: 0 })}.${positiveNanos}`
}

export function getPrice(price: Money | undefined) {
  if (!price) return 0
  return Number(`${price.units}.${price.nanos}`)
}

interface BasePrintingOption {
  printLocationCode: string
  designFile?: {
    fileUrl: string
  }
  originUrl?: string
}

export function sortPrintingOptions<T extends BasePrintingOption>(
  printingOptions: T[],
) {
  const printingOptionsIndex: Record<string, number> = {
    [AllPositionOfClothes.Front]: 0,
    [AllPositionOfClothes.Back]: 1,
    [AllPositionOfClothes.Pocket]: 2,
    [AllPositionOfClothes.LeftSleeve]: 3,
    [AllPositionOfClothes.RightSleeve]: 4,
    [AllPositionOfClothes.InsideLabel]: 5,
    [AllPositionOfClothes.OutsideLabel]: 6,
    [AllPositionOfClothes.Whole]: 7,
  }

  return Object.values(
    printingOptions.reduce((result: Record<number, T>, current) => {
      result[printingOptionsIndex[current.printLocationCode]] = current
      return result
    }, {}),
  )
}

type MediaUsageType =
  | "payment"
  | "artwork"
  | "userAvatar"
  | "teamAvatar"
  | "productImport"
  | "orderBarcode"
  | "orderImport"
  | "orderLabel"

export type FileType = "media" | "document"
export function formatUploadData(
  file: MyUppyFile,
  mediaUsageType: MediaUsageType,
  type: FileType = "media",
) {
  const uniqueId = generateUniqueId()

  let mediaUsage = MediaUsage.TEAM_ARTWORK_UPLOAD
  switch (mediaUsageType) {
    case "artwork": {
      mediaUsage = MediaUsage.TEAM_ARTWORK_UPLOAD
      break
    }
    case "payment": {
      mediaUsage = MediaUsage.TEAM_DOCUMENT_UPLOAD_PAYMENT_EVIDENCE
      break
    }
    case "userAvatar": {
      mediaUsage = MediaUsage.USER_AVATAR_UPLOAD
      break
    }
    case "teamAvatar": {
      mediaUsage = MediaUsage.TEAM_AVATAR_UPLOAD
      break
    }
    case "productImport": {
      mediaUsage = MediaUsage.TEAM_DOCUMENT_UPLOAD_PRODUCT_IMPORT
      break
    }
    case "orderBarcode": {
      mediaUsage = MediaUsage.TEAM_DOCUMENT_UPLOAD_ORDER_BARCODE
      break
    }
    case "orderImport": {
      mediaUsage = MediaUsage.TEAM_DOCUMENT_UPLOAD_ORDER_IMPORT
      break
    }
    case "orderLabel": {
      mediaUsage = MediaUsage.TEAM_DOCUMENT_UPLOAD_ORDER_LABEL
      break
    }
  }
  if (type === "document") {
    const uploadData = {
      documentKey: `${uniqueId}`,
      fileName: file.name,
      fileSize: BigInt(file.size ?? 0),
      mediaUsage: mediaUsage,
    }
    return uploadData
  }

  const uploadData = {
    mediaKey: `${uniqueId}`,
    fileName: file.name,
    fileSize: BigInt(file.size ?? 0),
    mediaUsage: mediaUsage,
  }
  return uploadData
}
export * from "./format-date"

/**
 * Tải xuống tệp Excel
 * @param response - Response từ API
 * @param defaultFilename - Tên tệp mặc định nếu không có content-disposition header
 * @returns Promise<void>
 */
export const downloadExcelFile = async (
  response: any,
  defaultFilename: string,
): Promise<void> => {
  if (response.status !== 200) {
    throw new Error(`Failed to fetch Excel file: ${response.statusText}`)
  }

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  const blobUrl = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = blobUrl

  const contentDisposition = response.headers["content-disposition"]
  const filename = contentDisposition
    ? contentDisposition.split("filename=")[1].replace(/"/g, "")
    : defaultFilename

  link.setAttribute("download", filename)
  link.click()

  // Cleanup
  link.remove()
  window.URL.revokeObjectURL(blobUrl)
}

export function staffFormatUploadData(
  file: MyUppyFile,
  mediaUsageType: MediaUsageType,
  type: FileType = "media",
  teamId: string,
) {
  const uniqueId = generateUniqueId()

  let mediaUsage = MediaUsage.TEAM_ARTWORK_UPLOAD
  switch (mediaUsageType) {
    case "artwork": {
      mediaUsage = MediaUsage.TEAM_ARTWORK_UPLOAD
      break
    }
    case "payment": {
      mediaUsage = MediaUsage.TEAM_DOCUMENT_UPLOAD_PAYMENT_EVIDENCE
      break
    }
    case "userAvatar": {
      mediaUsage = MediaUsage.USER_AVATAR_UPLOAD
      break
    }
    case "teamAvatar": {
      mediaUsage = MediaUsage.TEAM_AVATAR_UPLOAD
      break
    }
    case "productImport": {
      mediaUsage = MediaUsage.TEAM_DOCUMENT_UPLOAD_PRODUCT_IMPORT
      break
    }
    case "orderBarcode": {
      mediaUsage = MediaUsage.TEAM_DOCUMENT_UPLOAD_ORDER_BARCODE
      break
    }
    case "orderImport": {
      mediaUsage = MediaUsage.TEAM_DOCUMENT_UPLOAD_ORDER_IMPORT
      break
    }
    case "orderLabel": {
      mediaUsage = MediaUsage.TEAM_DOCUMENT_UPLOAD_ORDER_LABEL
      break
    }
  }
  if (type === "document") {
    const uploadData = {
      mediaKey: `${uniqueId}`,
      documentKey: `${uniqueId}`,
      fileName: file.name,
      fileSize: BigInt(file.size ?? 0),
      mediaUsage: mediaUsage,
      teamId: teamId,
    }
    return uploadData
  }

  const uploadData = {
    mediaKey: `${uniqueId}`,
    fileName: file.name,
    fileSize: BigInt(file.size ?? 0),
    mediaUsage: mediaUsage,
    teamId: teamId,
  }
  return uploadData
}

const baseURL = import.meta.env.VITE_BASE_URL

export const getEnvironment = () => {
  switch (baseURL) {
    case "https://api.dev.geadev.com":
      return "development"
    case "https://api.gearmentinc.com":
      return "staging"
    default:
      return "production"
  }
}
