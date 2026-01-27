import { AuthProvider } from "@/services/auth"
import { queryClient, QueryClientProvider } from "@/services/react-query"
import { TransportProvider } from "@connectrpc/connect-query"
import { createConnectTransport } from "@connectrpc/connect-web"
import Clarity from "@microsoft/clarity"
import * as Sentry from "@sentry/react"
import { PropsWithChildren } from "react"
import "./styles/index.css"
import { getEnvironment } from "./utils"

const baseURL = import.meta.env.VITE_BASE_URL

const finalTransport = createConnectTransport({
  baseUrl: baseURL,
  credentials: "include",
  useHttpGet: true,
})

// Make sure to add your actual project id instead of "yourProjectId".
if (getEnvironment() === "production") {
  const projectId = "t5a5g7l3zy"
  Clarity.init(projectId)
}

Sentry.init({
  environment: getEnvironment(),
  dsn: "https://befc725669b2f42c64a5b523e9e01a95@o4508832345161728.ingest.us.sentry.io/4509041816698880",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [/^https:\/\/.*\.gearment\.com/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

function AppContext(props: PropsWithChildren) {
  return (
    <TransportProvider transport={finalTransport}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <>{props.children}</>
        </AuthProvider>
      </QueryClientProvider>
    </TransportProvider>
  )
}
export default AppContext
