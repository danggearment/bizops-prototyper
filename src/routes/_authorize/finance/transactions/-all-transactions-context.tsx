import {
  AllTransactionSearchKeys,
  AllTransactionSearchSchema,
  AllTransactionSearchType,
} from "@/schemas/schemas/payment"
import { useQueryFinance } from "@/services/connect-rpc/transport"
import { formatDateForCallApi } from "@/utils"
import {
  staffCountTransactionType,
  staffListTransaction,
  staffListTransactionFilterCriteria,
} from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import {
  PaymentCriteria,
  StaffCountTransactionTypeResponse,
  StaffListTransactionResponse,
} from "@gearment/nextapi/api/payment/v1/payment_admin_pb"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { RowSelectionState } from "@tanstack/react-table"
import {
  createContext,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react"

interface AllTransactionsContext {
  search: AllTransactionSearchType
  setRowSelection: React.Dispatch<SetStateAction<RowSelectionState>>
  rowSelection: RowSelectionState
  handleSetFilter: (
    search: AllTransactionSearchType,
    resetRowState?: boolean,
  ) => void
  transactions: StaffListTransactionResponse["data"]
  total: number
  totalPage: number
  loading: boolean
  paymentMethods: PaymentCriteria[]
  approvalBy: PaymentCriteria[]
  handleRefetchData: () => Promise<void>
  countTransactionType: StaffCountTransactionTypeResponse["data"]
}

const AllTransactionsContext = createContext<AllTransactionsContext>({
  search: AllTransactionSearchSchema.parse({}),
  rowSelection: {},
  setRowSelection: () => {},
  handleSetFilter: () => {},
  transactions: [],
  total: 0,
  totalPage: 0,
  loading: false,
  paymentMethods: [],
  approvalBy: [],
  handleRefetchData: () => Promise.resolve(),
  countTransactionType: [],
})

interface Props {
  children: React.ReactNode
}

export default function AllTransactionsProvider({ children }: Props) {
  const search = useSearch({
    from: "/_authorize/finance/transactions/",
  })
  const navigate = useNavigate({
    from: "/finance/transactions",
  })

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { data: countTransactionType } = useQueryFinance(
    staffCountTransactionType,
    {
      filter: {
        methodCode: search.methodCode,
        approvalBy: search.approvalBy,
        from: search.from ? formatDateForCallApi(search.from) : undefined,
        to: search.to ? formatDateForCallApi(search.to, "endOfDay") : undefined,
      },
      search: {
        search: search.searchKey
          ? {
              case:
                search.searchKey ||
                AllTransactionSearchKeys.Values.transactionId,
              value: search.searchText,
            }
          : undefined,
      },
    },
    {
      select: (data) => {
        return data
      },
    },
  )

  const { data, isPending, refetch } = useQueryFinance(
    staffListTransaction,
    {
      page: search.page,
      limit: search.limit,
      filter: {
        type: search.type,
        methodCode: search.methodCode,
        approvalBy: search.approvalBy,
        from: search.from ? formatDateForCallApi(search.from) : undefined,
        to: search.to ? formatDateForCallApi(search.to, "endOfDay") : undefined,
      },
      search: {
        search: search.searchKey
          ? {
              case:
                search.searchKey ||
                AllTransactionSearchKeys.Values.transactionId,
              value: search.searchText,
            }
          : undefined,
      },
    },
    {
      select: (data) => {
        return {
          transactions: data.data,
          total: Number(data.total),
          totalPage: Number(data.totalPage),
        }
      },
    },
  )

  const { data: transactionFilterCriteria } = useQueryFinance(
    staffListTransactionFilterCriteria,
    {},
    {
      select: (data) => {
        return data
      },
    },
  )

  const handleSetFilter = useCallback(
    (newFilter: AllTransactionSearchType, resetRowState = true) => {
      navigate({
        search: (old) => ({
          ...old,
          ...newFilter,
        }),
        replace: true,
      })
      if (resetRowState) {
        setRowSelection({})
      }
    },
    [navigate],
  )

  const handleRefetchData = useCallback(async () => {
    await Promise.all([refetch()])
  }, [refetch])

  return (
    <AllTransactionsContext.Provider
      value={{
        search,
        setRowSelection,
        handleSetFilter,
        rowSelection,
        transactions: data?.transactions || [],
        loading: isPending,
        total: Number(data?.total || 0),
        totalPage: data?.totalPage || 0,
        paymentMethods: transactionFilterCriteria?.paymentMethods || [],
        approvalBy: transactionFilterCriteria?.approvalBy || [],
        handleRefetchData: handleRefetchData,
        countTransactionType: countTransactionType?.data || [],
      }}
    >
      {children}
    </AllTransactionsContext.Provider>
  )
}

export const useAllTransaction = () => {
  const context = useContext(AllTransactionsContext)
  if (!context) {
    throw new Error("No context provided")
  }

  return context
}
