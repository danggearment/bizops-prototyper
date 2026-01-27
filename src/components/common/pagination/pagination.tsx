import {
  Pagination as PaginationComponent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gearment/ui3"

const DEFAULT_LIMIT = [10, 20, 30, 50, 100]
const DEFAULT_LIMIT_OPTIONS = DEFAULT_LIMIT.map((l) => ({
  text: l.toString(),
  value: l.toString(),
}))

interface Props {
  pageSize: number
  pageIndex: number
  totalRecords: number
  handleChangePage: ({
    pageSize,
    pageIndex,
  }: {
    pageSize: Props["pageSize"]
    pageIndex: Props["pageIndex"]
  }) => void
}
export default function Pagination({
  pageSize,
  handleChangePage,
  pageIndex,
  totalRecords,
}: Props) {
  return (
    <div className="flex justify-between py-4 items-center text-secondary-text text-sm">
      <div>
        <span className="text-sm">
          {totalRecords < pageSize && totalRecords}
          {totalRecords >= pageSize &&
            (pageIndex * pageSize > totalRecords
              ? totalRecords
              : pageIndex * pageSize)}{" "}
          of {totalRecords} records
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span>View</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            handleChangePage({ pageIndex: 1, pageSize: Number(value) })
          }}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Select page limit" />
          </SelectTrigger>
          <SelectContent>
            {DEFAULT_LIMIT_OPTIONS.map((option) => (
              <SelectItem value={option.value} key={option.value}>
                {option.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="whitespace-nowrap">records per page</span>
      </div>

      <PaginationComponent
        currentPage={pageIndex}
        pageSize={pageSize}
        totalRecords={totalRecords || 0}
        onChangePage={(page) => {
          handleChangePage({ pageIndex: page, pageSize: pageSize })
        }}
      />
    </div>
  )
}
