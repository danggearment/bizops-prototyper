import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 1000 * 60 * 60 * 12, // miliseconds => 12h
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

export { QueryClientProvider, queryClient }
