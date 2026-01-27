import { useQueryIntegration } from "@/services/connect-rpc/transport"
import {
  staffListVendorAPICallLog,
  staffListWebhookCallLog,
  staffListStoreAPICallLog,
  staffListStoreWebhookCallLog,
  staffListFinanceAPICallLog,
} from "@gearment/nextapi/api/integration/v1/call_log-CallLogIntegrationAPI_connectquery"
import type { APICallLogFilter } from "@gearment/nextapi/api/integration/v1/call_log_pb"
import type { Paging } from "@gearment/nextapi/common/type/v1/paging_pb"

export const useVendorAPICallLogsQuery = ({
  paging,
  filter,
}: {
  paging: Paging
  filter?: APICallLogFilter
}) => {
  return useQueryIntegration(
    staffListVendorAPICallLog,
    {
      paging,
      filter,
    },
    {
      select: (response) => ({
        data: response.data.map((item) => ({
          id: item.id,
          requestId: item.id,
          responseId: item.id,
          orderId: undefined,
          teamId: "",
          teamName: "",
          storeId: undefined,
          storeName: undefined,
          method: item.payload?.method || "",
          url:
            item.payload?.hostName && item.payload?.path
              ? `https://${item.payload.hostName}${item.payload.path}`
              : "",
          statusCode: item.payload?.statusCode || 0,
          statusText: getStatusText(item.payload?.statusCode || 0),
          duration: Number(item.payload?.durationMs || 0),
          createdAt: item.createdAt?.toDate().toISOString() || "",
          requestHeaders: item.payload?.requestHeader || {},
          requestBody: item.payload?.requestBody,
          responseHeaders: {},
          responseBody: item.payload?.responseBody,
          errorMessage: item.payload?.responseError,
          curlCommand: item.payload?.curlCommand || "",
        })),
        pagination: {
          page: response.paging?.page || 1,
          limit: response.paging?.limit || 100,
          total: Number(response.paging?.total || 0),
          totalPage: response.paging?.totalPage || 0,
        },
      }),
    },
  )
}

export const useWebhookCallLogsQuery = ({
  paging,
  filter,
}: {
  paging: Paging
  filter?: APICallLogFilter
}) => {
  return useQueryIntegration(
    staffListWebhookCallLog,
    {
      paging,
      filter,
    },
    {
      select: (response) => ({
        data: response.data.map((item) => ({
          id: item.id,
          requestId: item.id,
          responseId: item.id,
          orderId: undefined,
          teamId: "",
          teamName: "",
          storeId: undefined,
          storeName: undefined,
          method: item.payload?.method || "",
          url:
            item.payload?.hostName && item.payload?.path
              ? `https://${item.payload.hostName}${item.payload.path}`
              : "",
          statusCode: item.payload?.statusCode || 0,
          statusText: getStatusText(item.payload?.statusCode || 0),
          duration: Number(item.payload?.durationMs || 0),
          createdAt: item.createdAt?.toDate().toISOString() || "",
          requestHeaders: item.payload?.requestHeader || {},
          requestBody: item.payload?.requestBody,
          responseHeaders: {},
          responseBody: item.payload?.responseBody,
          errorMessage: item.payload?.responseError,
          curlCommand: item.payload?.curlCommand || "",
        })),
        pagination: {
          page: response.paging?.page || 1,
          limit: response.paging?.limit || 100,
          total: Number(response.paging?.total || 0),
          totalPage: response.paging?.totalPage || 0,
        },
      }),
    },
  )
}

export const useStoreAPICallLogsQuery = ({
  paging,
  filter,
}: {
  paging: Paging
  filter?: APICallLogFilter
}) => {
  return useQueryIntegration(
    staffListStoreAPICallLog,
    {
      paging,
      filter,
    },
    {
      select: (response) => ({
        data: response.data.map((item) => ({
          id: item.id,
          requestId: item.id,
          responseId: item.id,
          orderId: undefined,
          teamId: "",
          teamName: "",
          storeId: undefined,
          storeName: undefined,
          method: item.payload?.method || "",
          url:
            item.payload?.hostName && item.payload?.path
              ? `https://${item.payload.hostName}${item.payload.path}`
              : "",
          statusCode: item.payload?.statusCode || 0,
          statusText: getStatusText(item.payload?.statusCode || 0),
          duration: Number(item.payload?.durationMs || 0),
          createdAt: item.createdAt?.toDate().toISOString() || "",
          requestHeaders: item.payload?.requestHeader || {},
          requestBody: item.payload?.requestBody,
          responseHeaders: {},
          responseBody: item.payload?.responseBody,
          errorMessage: item.payload?.responseError,
          curlCommand: item.payload?.curlCommand || "",
        })),
        pagination: {
          page: response.paging?.page || 1,
          limit: response.paging?.limit || 100,
          total: Number(response.paging?.total || 0),
          totalPage: response.paging?.totalPage || 0,
        },
      }),
    },
  )
}

export const useStoreWebhookCallLogsQuery = ({
  paging,
  filter,
}: {
  paging: Paging
  filter?: APICallLogFilter
}) => {
  return useQueryIntegration(
    staffListStoreWebhookCallLog,
    {
      paging,
      filter,
    },
    {
      select: (response) => ({
        data: response.data.map((item) => ({
          id: item.id,
          requestId: item.id,
          responseId: item.id,
          orderId: undefined,
          teamId: "",
          teamName: "",
          storeId: undefined,
          storeName: undefined,
          method: item.payload?.method || "",
          url:
            item.payload?.hostName && item.payload?.path
              ? `https://${item.payload.hostName}${item.payload.path}`
              : "",
          statusCode: item.payload?.statusCode || 0,
          statusText: getStatusText(item.payload?.statusCode || 0),
          duration: Number(item.payload?.durationMs || 0),
          createdAt: item.createdAt?.toDate().toISOString() || "",
          requestHeaders: item.payload?.requestHeader || {},
          requestBody: item.payload?.requestBody,
          responseHeaders: {},
          responseBody: item.payload?.responseBody,
          errorMessage: item.payload?.responseError,
          curlCommand: item.payload?.curlCommand || "",
        })),
        pagination: {
          page: response.paging?.page || 1,
          limit: response.paging?.limit || 100,
          total: Number(response.paging?.total || 0),
          totalPage: response.paging?.totalPage || 0,
        },
      }),
    },
  )
}

export const useFinanceAPICallLogsQuery = ({
  paging,
  filter,
}: {
  paging: Paging
  filter?: APICallLogFilter
}) => {
  return useQueryIntegration(
    staffListFinanceAPICallLog,
    {
      paging,
      filter,
    },
    {
      select: (response) => ({
        data: response.data.map((item) => ({
          id: item.id,
          requestId: item.id,
          responseId: item.id,
          orderId: undefined,
          teamId: "",
          teamName: "",
          storeId: undefined,
          storeName: undefined,
          method: item.payload?.method || "",
          url:
            item.payload?.hostName && item.payload?.path
              ? `https://${item.payload.hostName}${item.payload.path}`
              : "",
          statusCode: item.payload?.statusCode || 0,
          statusText: getStatusText(item.payload?.statusCode || 0),
          duration: Number(item.payload?.durationMs || 0),
          createdAt: item.createdAt?.toDate().toISOString() || "",
          requestHeaders: item.payload?.requestHeader || {},
          requestBody: item.payload?.requestBody,
          responseHeaders: {},
          responseBody: item.payload?.responseBody,
          errorMessage: item.payload?.responseError,
          curlCommand: item.payload?.curlCommand || "",
        })),
        pagination: {
          page: response.paging?.page || 1,
          limit: response.paging?.limit || 100,
          total: Number(response.paging?.total || 0),
          totalPage: response.paging?.totalPage || 0,
        },
      }),
    },
  )
}

function getStatusText(statusCode: number): string {
  const statusTexts: Record<number, string> = {
    200: "OK",
    201: "Created",
    202: "Accepted",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
  }
  return statusTexts[statusCode] || `Status ${statusCode}`
}
