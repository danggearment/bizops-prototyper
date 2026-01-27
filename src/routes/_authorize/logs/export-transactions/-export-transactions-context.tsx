import { staffListTransactionExportSession } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { createContext, useCallback, useContext } from "react"
import { ExportTransactionsSearchType } from "@/schemas/schemas/export-transactions"
import { useQueryFinance } from "@/services/connect-rpc/transport"
import { TransactionExportSession } from "@/services/connect-rpc/types"
import { formatDateForCallApi } from "@/utils/format-date"

interface ExportTransactionsContext {
  loading: boolean
  exportTransactions: TransactionExportSession[]
  rowCount: number
  pageCount: number
  handleChangeSearch: (search: ExportTransactionsSearchType) => void
}

const ExportTransactionsContext = createContext<ExportTransactionsContext>({
  loading: false,
  exportTransactions: [],
  rowCount: 0,
  pageCount: 0,
  handleChangeSearch: () => {},
})

interface Props {
  children: React.ReactNode
}

export default function ExportTransactionsProvider({ children }: Props) {
  const navigate = useNavigate({
    from: "/logs/export-transactions",
  })
  const search = useSearch({
    from: "/_authorize/logs/export-transactions/",
  })

  const { data, isPending } = useQueryFinance(
    staffListTransactionExportSession,
    {
      paging: {
        page: search.page,
        limit: search.limit,
      },
      filter: {
        createdAtFrom: search.from
          ? formatDateForCallApi(search.from)
          : undefined,
        createdAtTo: search.to
          ? formatDateForCallApi(search.to, "endOfDay")
          : undefined,
        status: search.status,
      },
    },
    {
      select: (data) => ({
        data: data.data,
        rowCount: Number(data.pagination?.total),
        pageCount: data.pagination?.totalPage,
      }),
    },
  )

  const handleChangeSearch = useCallback(
    (search: ExportTransactionsSearchType) => {
      navigate({
        search: (old) => ({
          ...old,
          ...search,
        }),
        replace: true,
      })
    },
    [],
  )

  return (
    <ExportTransactionsContext.Provider
      value={{
        loading: isPending,
        exportTransactions: data?.data || [],
        rowCount: data?.rowCount || 0,
        pageCount: data?.pageCount || 0,
        handleChangeSearch,
      }}
    >
      {children}
    </ExportTransactionsContext.Provider>
  )
}

export const useExportTransactions = () => {
  const content = useContext(ExportTransactionsContext)
  if (!content) {
    throw Error("ExportTransactionsContext is not created")
  }

  return content
}
