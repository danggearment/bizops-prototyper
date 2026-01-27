import {
  Button,
  Form,
  FormField,
  FormItem,
  FormMessage,
  InputField,
  toast,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { SearchIcon } from "lucide-react"
import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"

const SearchSchema = z.object({
  searchText: z.string(),
})

type SearchType = z.infer<typeof SearchSchema>

interface Props {
  onSubmit: (values: SearchType) => void
  placeholder: string
  value?: string
}
export default function FormSearch({ onSubmit, placeholder, value }: Props) {
  const form = useForm({
    defaultValues: {
      searchText: value || "",
    },
    resolver: zodResolver(SearchSchema),
  })
  useEffect(() => {
    form.reset({ searchText: value })
  }, [value])

  const hanldeSubmit: SubmitHandler<SearchType> = async (values) => {
    try {
      onSubmit(values)
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Some things went wrong",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(hanldeSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="searchText"
          render={({ field }) => (
            <FormItem className="w-full">
              <InputField
                placeholder={placeholder}
                {...field}
                rightIcon={<SearchIcon size={16} />}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Search</Button>
      </form>
    </Form>
  )
}
