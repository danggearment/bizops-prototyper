import { z } from "zod"

export const CallLogType = z.enum(["vendor-api", "webhook"])

export const HttpStatus = z.enum([
  "2xx",
  "4xx",
  "5xx",
  "200",
  "201",
  "400",
  "401",
  "403",
  "404",
  "422",
  "429",
  "500",
  "502",
  "503",
  "504",
])

export const CallLogsTab = z.enum([
  "vendor-api",
  "webhook",
  "store-api",
  "store-webhook",
  "finance-api",
])

export type CallLogsTabType = z.infer<typeof CallLogsTab>

export const CallLogsSearchSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  search: z.string().optional(),
  callLogType: CallLogType.optional().default(CallLogType.Values["vendor-api"]),
  statuses: z.array(HttpStatus).optional().default([]),
  teamIds: z.array(z.string()).optional().default([]),
  storeIds: z.array(z.string()).optional().default([]),
  requestIds: z.array(z.string()).optional().default([]),
  responseIds: z.array(z.string()).optional().default([]),
  anyOrderIds: z.array(z.string()).optional().default([]),
  clientKey: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  sortBy: z.array(z.string()).optional(),
  sortDirection: z.array(z.string()).optional(),
  tab: CallLogsTab.optional().default(CallLogsTab.Values["vendor-api"]),
})

export type CallLogsSearchType = z.infer<typeof CallLogsSearchSchema>
export type CallLogTypeType = z.infer<typeof CallLogType>
export type HttpStatusType = z.infer<typeof HttpStatus>

// Mock data types for the call logs
export interface CallLogEntry {
  id: string
  requestId: string
  responseId?: string
  orderId?: string
  teamId: string
  teamName: string
  storeId?: string
  storeName?: string
  method: string
  url: string
  statusCode: number
  statusText: string
  duration: number // in milliseconds
  createdAt: string
  requestHeaders: Record<string, string>
  requestBody?: string
  responseHeaders: Record<string, string>
  responseBody?: string
  errorMessage?: string
  curlCommand: string
}

export interface CallLogsResponse {
  data: CallLogEntry[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPage: number
  }
}
