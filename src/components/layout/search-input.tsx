import { useMutationPod } from "@/services/connect-rpc/transport"
import { staffListOrder } from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery"
import { staffListOrderDraft } from "@gearment/nextapi/api/pod/v1/order_draft_admin-OrderDraftAdminAPI_connectquery"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  LoadingCircle,
  toast,
} from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
const SearchSchema = z.object({
  ["search-global"]: z.string().optional(),
})

type SearchType = z.infer<typeof SearchSchema>

export default function SearchInput() {
  const form = useForm<SearchType>({
    resolver: zodResolver(SearchSchema),
  })
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()

  const handleKeyDown = (event: KeyboardEvent) => {
    // Check for Command+K (Mac) or Ctrl+K (Windows/Linux)
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault()
      // Focus the search input
      const searchInput = document.querySelector(
        'input[name="search-global"]',
      ) as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const mutationListDraftOrder = useMutationPod(staffListOrderDraft, {
    onSuccess: (data) => {
      if (data.data.length === 1) {
        navigate({
          to: "/order/draft-orders/$orderId",
          params: {
            orderId: data.data[0]?.draftId || "",
          },
        })
        form.reset()
      }
    },
  })
  const mutationListOrder = useMutationPod(staffListOrder, {
    onSuccess: (data) => {
      if (data.data.length === 1) {
        navigate({
          to: "/order/$orderId",
          params: {
            orderId: data.data[0]?.orderId || "",
          },
        })
        form.reset()
      }
    },
  })

  const verifyOrderId = async (data: SearchType) => {
    try {
      const orderIdRegex = /^\d{6}[A-Z]-[A-Z0-9]{6,7}-[A-Z0-9]{8}$/
      const twOrderIdRegex = /^TW-\d{10,}$/
      const dataSearch = data["search-global"]?.trim()
      const isOrderId =
        dataSearch &&
        (orderIdRegex.test(dataSearch) || twOrderIdRegex.test(dataSearch))
      if (isOrderId) {
        await Promise.allSettled([
          mutationListDraftOrder.mutateAsync({
            page: 1,
            limit: 10,
            search: {
              search: {
                value: dataSearch,
                case: "draftId",
              },
            },
          }),
          mutationListOrder.mutateAsync({
            page: 1,
            limit: 10,
            search: {
              search: {
                value: dataSearch,
                case: "orderId",
              },
            },
          }),
        ])
      } else {
        toast({
          title: "Invalid order ID",
          description: "Please enter a valid order ID",
          variant: "error",
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
  const debounceSearch = _debounce(verifyOrderId, 500)

  const onSubmit = (data: SearchType) => {
    try {
      verifyOrderId(data)
    } catch (error) {
      console.log(error)
    }
  }
  const loading =
    mutationListDraftOrder.isPending || mutationListOrder.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="search-global"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex items-center gap-2">
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      debounceSearch({
                        "search-global": e.target.value,
                      })
                    }}
                    value={field.value || ""}
                    placeholder="Search..."
                    className="md:w-full md:min-w-[300px] w-auto"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                  <div className="absolute right-2 flex items-center gap-1 text-xs text-muted-foreground">
                    {loading && <LoadingCircle size="sm" />}
                    {!isFocused && (
                      <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">
                        ⌘ + K
                      </kbd>
                    )}
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
