import { NoRecordExportMessages } from "@/constants/payment"
import { AllListTeamTransactionSearchKeys } from "@/schemas/schemas/payment"
import { useMutationFinance } from "@/services/connect-rpc/transport"
import {
  ExportContentType,
  ExportTransactionsType,
  ExportType,
  useExportTransactions,
} from "@/services/modals/modal-export-transactions"
import { ModalExportTransactions } from "@/services/modals/modal-export-transactions/modal-export-transactions.tsx"
import { formatDateForCallApi } from "@/utils/format-date"
import { staffExportTeamTransaction } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  toast,
} from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"

interface Props {
  filteredRecordCount: number
  allRecordCount: number
  teamId: string
}

function Export({ filteredRecordCount, allRecordCount, teamId }: Props) {
  const navigate = useNavigate()

  const search = useSearch({
    from: "/_authorize/system/teams/$teamId/transactions/",
  })

  const [setOpenExport, onCloseExport] = useExportTransactions((state) => [
    state.setOpen,
    state.onClose,
  ])

  const mutationExportTransactions = useMutationFinance(
    staffExportTeamTransaction,
    {
      onSuccess: () => {
        handleSuccessExportTransaction()
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Export transactions",
          description: error.rawMessage,
        })
      },
    },
  )

  const handleSuccessExportTransaction = () => {
    onCloseExport()
    const { dismiss } = toast({
      description:
        "Your XLSX file has been successfully exported. Large files may take anywhere from a few minutes to several hours to generate, and you will be able to download them once ready.",
      action: (
        <div>
          <Button
            className="gap-1 p-0 h-auto body-small font-medium text-green-dark"
            size={"sm"}
            variant={"link"}
            onClick={() => {
              dismiss()
              navigate({
                to: "/logs/export-transactions",
                search: { page: 1, limit: 10 },
              })
            }}
          >
            View Progress
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    })
  }

  const getExportPayload = () => ({
    teamId,
    limit: search.limit,
    page: search.page,
    filter: {
      from: search.from ? formatDateForCallApi(search.from) : undefined,
      to: search.to ? formatDateForCallApi(search.to, "endOfDay") : undefined,
      type: search.type,
    },
    search: {
      search: search.searchText
        ? {
            case:
              search.searchKey || AllListTeamTransactionSearchKeys.Values.txnId,
            value: search.searchText,
          }
        : undefined,
    },
  })

  const handleSubmit = async (values: ExportTransactionsType) => {
    try {
      const message = NoRecordExportMessages[values.exportType]

      if (values.exportType === ExportType.ALL_RECORDS) {
        if (allRecordCount == 0) {
          toast({
            variant: "destructive",
            ...message,
          })
          return
        }
        await mutationExportTransactions.mutateAsync({
          teamId,
          limit: search.limit,
          page: search.page,
        })
      } else {
        if (filteredRecordCount == 0) {
          toast({
            variant: "destructive",
            ...message,
          })
          return
        }
        await mutationExportTransactions.mutateAsync(getExportPayload())
      }
    } catch (error) {
      console.error("Export transaction failed:", error)
    }
  }

  const handleOpenModalExportTransactions = (type: ExportContentType) => {
    setOpenExport({
      allRecordsLength: allRecordCount,
      filteredLength: filteredRecordCount,
      onSave: handleSubmit,
      type,
    })
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button className="flex items-center gap-[10px]">
            Export <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => handleOpenModalExportTransactions("transaction")}
          >
            Export Transactions
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModalExportTransactions />
    </>
  )
}

export default Export
