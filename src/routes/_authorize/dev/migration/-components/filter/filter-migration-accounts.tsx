import {
  MigrationSearchKeys,
  MigrationSearchType,
} from "@/schemas/schemas/migration"
import { queryClient } from "@/services/react-query"
import { staffListMigrationAccount } from "@gearment/nextapi/api/migration/v1/migration-MigrationOperationAPI_connectquery"
import {
  Button,
  cn,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { RefreshCcwIcon } from "lucide-react"
import { useMigration } from "../../-migration-context"

const SearchKeyOptions = [
  {
    text: "Next User ID",
    value: MigrationSearchKeys.Enum.nextUserId,
  },
  {
    text: "Customer ID",
    value: MigrationSearchKeys.Enum.cusId,
  },
] as const

export default function FilterMigrationAccounts() {
  const search = useSearch({ from: "/_authorize/dev/migration/" })
  const navigate = useNavigate({ from: "/dev/migration" })
  const { isPendingAccount } = useMigration()

  const handleChangeSearch = (search: MigrationSearchType) => {
    navigate({
      search: (old) => ({ ...old, ...search }),
      replace: true,
    })
  }

  return (
    <div className="space-y-4 bg-background rounded-lg p-4">
      <div className="flex items-center">
        <Select
          value={search.searchKey}
          onValueChange={(value) => {
            const key = value as MigrationSearchType["searchKey"]
            handleChangeSearch({
              ...search,
              page: 1,
              searchKey: key,
              searchText: search.searchText ?? "",
            })
          }}
        >
          <SelectTrigger className="w-[200px] rounded-tr-none rounded-br-none border-r-transparent py-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SearchKeyOptions.map((option) => (
              <SelectItem value={option.value} key={option.value}>
                {option.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="w-full flex items-center gap-2">
          <Input
            placeholder="Search"
            className="rounded-tl-none rounded-bl-none bg-background-secondary"
            defaultValue={search.searchText}
            onChange={(e) =>
              handleChangeSearch({
                ...search,
                page: 1,
                searchKey: search.searchKey,
                searchText: e.target.value,
              })
            }
          />
          <Button
            onClick={() =>
              handleChangeSearch({
                ...search,
                page: 1,
                searchKey: search.searchKey,
                searchText: search.searchText ?? "",
              })
            }
          >
            Search
          </Button>
          <Button
            variant={"outline"}
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: [
                  staffListMigrationAccount.service.typeName,
                  staffListMigrationAccount.name,
                ],
              })
            }}
            disabled={isPendingAccount}
          >
            <RefreshCcwIcon
              className={cn(isPendingAccount && "animate-spin")}
            />
          </Button>
        </div>
      </div>
    </div>
  )
}
