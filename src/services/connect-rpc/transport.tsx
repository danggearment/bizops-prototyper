import makeRequest from "@/api/axios"
import { appTimezone, handleClearSession } from "@/utils"
import { baseUrl } from "@/utils/base-url"
import { header } from "@/utils/header"
import {
  ConnectTransportOptions,
  createConnectTransport,
} from "@connectrpc/connect-web"
import { toast } from "@gearment/ui3"
import { queryClient } from "../react-query"
import {
  useInfiniteQueryConnectRpc,
  useMutationConnectRpc,
  useQueryConnectRpc,
} from "./connectrpc"

const interceptors: ConnectTransportOptions["interceptors"] = [
  (next) => async (req) => {
    Object.keys(header.data).forEach((key) => {
      req.header.append(key, header.data[key])
    })
    req.header.append(
      header.headerKeys["X-Timezone"],
      appTimezone.getTimezone(),
    )
    const res = await next(req)
    return res
  },
]

const UNAUTHORIZE_PATHNAME = [
  "/login",
  "/sign-up",
  "/reset-password",
  "/forgot-password",
  "/activation",
  "/complete-invite",
]

let accessTokenRefeshing = false

const customFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  if (init?.method === "GET") {
    const TIMEOUT = import.meta.env.VITE_TIMEOUT_NUMBER || 10000
    const controller = new AbortController()
    timeoutId = setTimeout(() => {
      controller.abort()
      toast({
        duration: 5000,
        variant: "error",
        title: "Something went wrong",
        description: (
          <div>
            <p>
              The request took too long to complete. Please try again later or
              contact support if the issue persists.
            </p>
            <span> </span>
            <button
              onClick={() => {
                window.location.reload()
              }}
              className="py-2 text-primary cursor-pointer"
            >
              Try again
            </button>
          </div>
        ),
      })
    }, TIMEOUT)

    const timeoutSignal = controller.signal
    init.signal = timeoutSignal
  }
  const res = await fetch(input, init)
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  switch (res.status) {
    case 401: {
      if (accessTokenRefeshing) {
        break
      }

      accessTokenRefeshing = true
      await makeRequest
        .post("/api.iam.v1.StaffAccountAPI/StaffRefreshAccessToken", {})
        .then(async (res) => {
          const accessToken = res.data.accessToken
          queryClient.invalidateQueries()
          if (accessToken) {
            localStorage.setItem("access_token", accessToken)
          }
          const location = window.location
          const pathname = location.pathname
          if (UNAUTHORIZE_PATHNAME.some((p) => p === pathname)) {
            window.location.href = "/"
          }
        })
        .catch(() => {
          // TODO: monitor
          const location = window.location
          const pathname = location.pathname
          handleClearSession()
          if (!UNAUTHORIZE_PATHNAME.some((p) => p === pathname)) {
            window.location.href = "/login"
          }
        })
        .finally(() => {
          accessTokenRefeshing = false
        })
      break
    }
    case 403: {
      console.error("Forbidden")
      break
    }
  }
  return res
}
export const transportPod = (options?: Partial<ConnectTransportOptions>) =>
  createConnectTransport({
    baseUrl: baseUrl.pod,
    credentials: "include",
    useHttpGet: true,
    interceptors: interceptors,
    fetch: customFetch,
    ...options,
  })

const transportStore = createConnectTransport({
  baseUrl: baseUrl.store,
  credentials: "include",
  useHttpGet: true,
  interceptors: interceptors,
  fetch: customFetch,
})

const transportIam = createConnectTransport({
  baseUrl: baseUrl.iam,
  credentials: "include",
  useHttpGet: true,
  interceptors: interceptors,
  fetch: customFetch,
})

export const transportProduct = createConnectTransport({
  baseUrl: baseUrl.product,
  credentials: "include",
  useHttpGet: true,
  interceptors: interceptors,
  fetch: customFetch,
})

const transportSeller = createConnectTransport({
  baseUrl: baseUrl.seller,
  credentials: "include",
  useHttpGet: true,
  interceptors: interceptors,
  fetch: customFetch,
})

const transportFinance = createConnectTransport({
  baseUrl: baseUrl.finance,
  credentials: "include",
  useHttpGet: true,
  interceptors: interceptors,
  fetch: customFetch,
})
const transportStudio = createConnectTransport({
  baseUrl: baseUrl.studio,
  credentials: "include",
  useHttpGet: true,
  interceptors: interceptors,
  fetch: customFetch,
})

const transportOrder = createConnectTransport({
  baseUrl: baseUrl.order,
  credentials: "include",
  useHttpGet: true,
  interceptors: interceptors,
  fetch: customFetch,
})

const transportAudit = createConnectTransport({
  baseUrl: baseUrl.audit,
  credentials: "include",
  useHttpGet: true,
  interceptors: interceptors,
  fetch: customFetch,
})

const transportFfm = createConnectTransport({
  baseUrl: baseUrl.ffm,
  credentials: "include",
  useHttpGet: true,
  interceptors: interceptors,
  fetch: customFetch,
})

const transportMigration = createConnectTransport({
  baseUrl: baseUrl.migration,
  credentials: "include",
  useHttpGet: true,
  interceptors: interceptors,
  fetch: customFetch,
})

const transportIntegration = createConnectTransport({
  baseUrl: baseUrl.integration,
  credentials: "include",
  useHttpGet: true,
  interceptors: interceptors,
  fetch: customFetch,
})

export const transportDefault = transportIam

// iam
export const useQueryIam: typeof useQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useQueryConnectRpc(methodSig, input, {
    transport: transportIam,
    ...options,
  })
}
export const useMutationIam: typeof useMutationConnectRpc = (
  methodSig,
  options,
) => {
  return useMutationConnectRpc(methodSig, {
    transport: transportIam,
    ...options,
  })
}

// Product
export const useQueryProduct: typeof useQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useQueryConnectRpc(methodSig, input, {
    transport: transportProduct,
    ...options,
  })
}

// seller
export const useQuerySeller: typeof useQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useQueryConnectRpc(methodSig, input, {
    transport: transportSeller,
    ...options,
  })
}

export const useMutationSeller: typeof useMutationConnectRpc = (
  methodSig,
  options,
) => {
  return useMutationConnectRpc(methodSig, {
    transport: transportSeller,
    ...options,
  })
}

// finance
export const useQueryFinance: typeof useQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useQueryConnectRpc(methodSig, input, {
    transport: transportFinance,
    ...options,
  })
}

export const useMutationFinance: typeof useMutationConnectRpc = (
  methodSig,
  options,
) => {
  return useMutationConnectRpc(methodSig, {
    transport: transportFinance,
    ...options,
  })
}

// studio

export const useQueryStudio: typeof useQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useQueryConnectRpc(methodSig, input, {
    transport: transportStudio,
    ...options,
  })
}

export const useMutationStudio: typeof useMutationConnectRpc = (
  methodSig,
  options,
) => {
  return useMutationConnectRpc(methodSig, {
    transport: transportStudio,
    ...options,
  })
}

// studio

export const useQueryOrder: typeof useQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useQueryConnectRpc(methodSig, input, {
    transport: transportOrder,
    ...options,
  })
}

export const useMutationOrder: typeof useMutationConnectRpc = (
  methodSig,
  options,
) => {
  return useMutationConnectRpc(methodSig, {
    transport: transportOrder,
    ...options,
  })
}

//Pod
export const useQueryPod: typeof useQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useQueryConnectRpc(methodSig, input, {
    transport: transportPod(),
    ...options,
  })
}

export const useInfiniteQueryPod: typeof useInfiniteQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useInfiniteQueryConnectRpc(methodSig, input, {
    transport: transportPod(),
    ...options,
  })
}

// store
export const useQueryStore: typeof useQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useQueryConnectRpc(methodSig, input, {
    transport: transportStore,
    ...options,
  })
}

export const useMutationStore: typeof useMutationConnectRpc = (
  methodSig,
  options,
) => {
  return useMutationConnectRpc(methodSig, {
    transport: transportStore,
    ...options,
  })
}

export const useInfiniteQueryStore: typeof useInfiniteQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useInfiniteQueryConnectRpc(methodSig, input, {
    transport: transportStore,
    ...options,
  })
}

export const useInfiniteQueryIam: typeof useInfiniteQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useInfiniteQueryConnectRpc(methodSig, input, {
    transport: transportIam,
    ...options,
  })
}

export const useQueryAudit: typeof useQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useQueryConnectRpc(methodSig, input, {
    transport: transportAudit,
    ...options,
  })
}

export const useInfiniteQueryAudit: typeof useInfiniteQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useInfiniteQueryConnectRpc(methodSig, input, {
    transport: transportAudit,
    ...options,
  })
}

export const useMutationPod: typeof useMutationConnectRpc = (
  methodSig,
  options,
) => {
  return useMutationConnectRpc(methodSig, {
    transport: transportPod(),
    ...options,
  })
}

// ffm
export const useQueryFfm: typeof useQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useQueryConnectRpc(methodSig, input, {
    transport: transportFfm,
    ...options,
  })
}

export const useMutationFfm: typeof useMutationConnectRpc = (
  methodSig,
  options,
) => {
  return useMutationConnectRpc(methodSig, {
    transport: transportFfm,
    ...options,
  })
}

// Migration
export const useQueryMigration: typeof useQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useQueryConnectRpc(methodSig, input, {
    transport: transportMigration,
    ...options,
  })
}

export const useMutationMigration: typeof useMutationConnectRpc = (
  methodSig,
  options,
) => {
  return useMutationConnectRpc(methodSig, {
    transport: transportMigration,
    ...options,
  })
}

// integration
export const useQueryIntegration: typeof useQueryConnectRpc = (
  methodSig,
  input,
  options,
) => {
  return useQueryConnectRpc(methodSig, input, {
    transport: transportIntegration,
    ...options,
  })
}

export const useMutationIntegration: typeof useMutationConnectRpc = (
  methodSig,
  options,
) => {
  return useMutationConnectRpc(methodSig, {
    transport: transportIntegration,
    ...options,
  })
}
