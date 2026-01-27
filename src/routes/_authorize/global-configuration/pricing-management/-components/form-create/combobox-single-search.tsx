import {
  Button,
  cn,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  LoadingCircle,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@gearment/ui3"
import { CheckIcon, ChevronsUpDown } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

interface Option {
  label: string
  value: string
}

interface Props {
  label: string
  placeholder: string
  options: (Option & {
    icon?: (props: { className: string }) => React.ReactNode
  })[]
  defaultOptionSelected?: Option | null
  defaultValue?: string | null
  onChange?: (value?: string) => void
  disabled?: boolean
  observer?: (node: HTMLDivElement) => void
  onSearch?: (value: string) => void
  loading: boolean
  hasMore: boolean
  fetchNextPage: () => void
  size?: "sm" | "lg" | "default" | "icon" | null | undefined
}

export function ComboboxSingleSearch({
  label,
  placeholder,
  options,
  defaultValue = null,
  defaultOptionSelected = null,
  onChange,
  disabled,
  onSearch,
  fetchNextPage,
  loading,
  hasMore,
  size = "default",
}: Props) {
  const [open, setOpen] = useState(false)
  const optionsRef = useRef<HTMLDivElement>(null)

  const initialValue = defaultValue ?? defaultOptionSelected?.value ?? null
  const [selectedValue, setSelectedValue] = useState<string | null>(
    initialValue,
  )

  const selectedOption = useMemo(() => {
    if (!selectedValue) return null
    return (
      options.find((o) => o.value === selectedValue) ||
      (defaultOptionSelected && defaultOptionSelected.value === selectedValue
        ? defaultOptionSelected
        : null)
    )
  }, [options, selectedValue, defaultOptionSelected])

  useEffect(() => {
    const newInitial = defaultValue ?? defaultOptionSelected?.value ?? null
    setSelectedValue((prev) => (prev === null ? newInitial : prev))
  }, [defaultOptionSelected, defaultValue])

  useEffect(() => {
    onChange?.(selectedValue ?? undefined)
  }, [selectedValue, onChange])

  const handleScroll = () => {
    if (optionsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = optionsRef.current
      if (scrollTop + clientHeight >= scrollHeight - 8 && hasMore && !loading) {
        fetchNextPage()
      }
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (!value) onSearch && onSearch("")
      }}
    >
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          size={size}
          className="w-full justify-between"
          name={label}
        >
          <div className="flex items-center gap-2 w-full">
            <div className="flex items-center flex-1 gap-2">
              {selectedOption ? (
                <div className="flex items-center gap-1 flex-1">
                  <div className="flex items-center rounded-lg px-2 py-1 pointer-events-none">
                    <span className="text-sm">{selectedOption.label}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1 flex-1">
                  <div className="flex items-center rounded-lg px-2 py-1">
                    <span className="text-sm">{placeholder}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <ChevronsUpDown className="opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput placeholder={placeholder} onValueChange={onSearch} />
          {!loading && options.length === 0 && (
            <div className="py-6 text-center text-sm">No results found.</div>
          )}
          <CommandList
            ref={optionsRef}
            onScroll={handleScroll}
            className="max-h-64 overflow-auto"
          >
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValue === option.value
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const next = isSelected ? null : option.value
                      setSelectedValue(next)
                      setOpen(false)
                    }}
                    className={cn(
                      "cursor-pointer",
                      isSelected && "bg-gray-100",
                    )}
                  >
                    <span className="break-all">{option.label}</span>
                    {isSelected && <CheckIcon className="ml-auto" />}
                  </CommandItem>
                )
              })}
              {loading && (
                <div className="flex justify-center">
                  <LoadingCircle size="sm" />
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
