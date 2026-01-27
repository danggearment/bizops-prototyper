import { RushProductVariant } from "@gearment/nextapi/api/pod/v1/product_admin_pb"
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from "@gearment/ui3"
import { PlusIcon } from "lucide-react"
import { useMemo } from "react"
import { useProductGroupStore } from "./modal-product-group-store"

interface SelectProductProps {
  rushProducts: RushProductVariant[]
}

export default function SelectProduct({ rushProducts }: SelectProductProps) {
  const { productGroup, actions } = useProductGroupStore()
  const handleSelectProduct = (option: {
    label: string
    value: string
    productId: string
    rushProduct: RushProductVariant
  }) => {
    const listRushVariant = option.rushProduct.listRushVariant.map((item) => ({
      ...item,
      selected: !item.rushProductGroupId,
      disabled: !!item.rushProductGroupId,
    }))

    actions.addProduct({
      ...option.rushProduct,
      listRushVariant: listRushVariant,
    })
  }

  const dataOptions = useMemo(() => {
    return (rushProducts || []).map((item) => ({
      label: `${item.productName} - ${item.productSku}`,
      value: `${item.productId}::${item.productName} - ${item.productSku}`,
      productId: item.productId,
      rushProduct: item,
    }))
  }, [rushProducts, productGroup])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="link" className="px-0">
          <PlusIcon className="w-4 h-4" />
          Add product
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "p-0 min-w-[var(--radix-popover-trigger-width)] max-h-[var(--radix-popover-content-available-height)]",
        )}
        portal={false}
      >
        <Command
          filter={(value, search) => {
            const label = value.toLowerCase()
            const searchTerm = search.toLowerCase()
            return label.includes(searchTerm) ? 1 : 0
          }}
          className="w-full"
        >
          <CommandInput placeholder="Search for a product" />
          <CommandList>
            <CommandEmpty></CommandEmpty>
            <CommandGroup>
              {dataOptions?.map((option) => {
                const isSelected = productGroup.some(
                  (product) => product.productId === option.productId,
                )
                if (isSelected) {
                  return null
                }
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelectProduct(option)}
                  >
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
