import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  InputField,
} from "@gearment/ui3"
import { useFormContext } from "react-hook-form"
import { UpdateTiktokStoreType } from "./form-store.tsx"

export default function FieldsTiktok() {
  const form = useFormContext<UpdateTiktokStoreType>()
  return (
    <>
      <FormField
        control={form.control}
        name="storeUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL store</FormLabel>
            <FormControl>
              <InputField
                {...field}
                placeholder="Enter your store url"
                disabled
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  )
}
