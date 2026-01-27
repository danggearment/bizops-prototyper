import { useQueryStore } from "@/services/connect-rpc/transport.tsx"
import {
  staffGetStore,
  staffListMarketplace,
} from "@gearment/nextapi/api/store/v1/admin_api-StoreAdminAPI_connectquery"
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useParams } from "@tanstack/react-router"
import { useEffect, useMemo } from "react"

import { AllPlatform } from "@/constants/platform.ts"
import FieldsTiktok from "@/routes/_authorize/system/teams/$teamId/store/$storeId/-component/fields-tiktok.tsx"
import { Store, StoreStatus } from "@/services/connect-rpc/types"

const schema = z.object({
  storeId: z.string().min(1, "StoreId is required"),
  storeName: z.string().min(1, "Store name is required"),
  platform: z.nativeEnum(AllPlatform),
  status: z.enum([
    StoreStatus[StoreStatus.ACTIVE],
    StoreStatus[StoreStatus.INACTIVE],
    StoreStatus[StoreStatus.UNKNOWN],
  ]),
})

const tiktokSchema = z
  .object({
    storeUrl: z.string().min(1, "Url store is required"),
  })
  .merge(schema)

interface UpdateStoreType extends z.infer<typeof schema> {}

export interface UpdateTiktokStoreType extends z.infer<typeof tiktokSchema> {}
export type FormValues = UpdateStoreType | UpdateTiktokStoreType

const getSchema = (store?: Store) => {
  switch (store?.platform) {
    case AllPlatform.TIKTOKSHOP: {
      return tiktokSchema
    }
    default: {
      return schema
    }
  }
}

export default function FormStore() {
  const params = useParams({
    from: "/_authorize/system/teams/$teamId/store/$storeId/",
  })

  const { data: store } = useQueryStore(
    staffGetStore,
    {
      teamId: params.teamId,
      storeId: params.storeId,
    },
    {
      select: (data) => data.store,
    },
  )

  const form = useForm<FormValues>({
    defaultValues: {
      storeId: "",
      storeName: "",
      status: "",
      platform: undefined,
    },
    resolver: zodResolver(getSchema(store)),
  })

  const { data: marketplaces } = useQueryStore(
    staffListMarketplace,
    undefined,
    {
      select: (data) => data.marketplace,
    },
  )

  const initFormData = (store: Store) => {
    switch (store.platform) {
      case AllPlatform.TIKTOKSHOP: {
        form.reset({
          storeId: store.storeId,
          storeName: store.name,
          status: StoreStatus[store.status],
          platform: store.platform,
          storeUrl: store.platformData?.tiktokshop?.storeUrl,
        })
        break
      }
      default: {
        form.reset({
          storeId: store.storeId,
          storeName: store.name,
          status: StoreStatus[store.status],
          platform: store.platform,
        })
      }
    }
  }

  useEffect(() => {
    if (store) {
      initFormData(store)
    }
  }, [store])

  const maketplacesOptions = useMemo(() => {
    return (marketplaces || []).map((marketplace) => ({
      text: marketplace.apps?.appName || "Gearment",
      value: marketplace.platform.toString(),
    }))
  }, [marketplaces])

  const handleChangeStatus = (checked: boolean) => {
    if (checked) {
      form.setValue("status", StoreStatus[StoreStatus.ACTIVE], {
        shouldValidate: true,
        shouldDirty: true,
      })
    } else {
      form.setValue("status", StoreStatus[StoreStatus.INACTIVE], {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }

  const status = form.watch("status")

  return (
    <div className="p-4 bg-background rounded-lg">
      <h2 className="">Main info</h2>
      <p className="mb-6 body-smal">Store code: #{store?.storeId}</p>
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    value={field.value?.toString()}
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {maketplacesOptions.map((m) => (
                        <SelectItem value={m.value} key={m.value}>
                          {m.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store name</FormLabel>
                <FormControl>
                  <InputField {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {store?.platform === AllPlatform.TIKTOKSHOP && <FieldsTiktok />}
          <div className="flex items-center gap-2">
            <Switch
              onCheckedChange={handleChangeStatus}
              checked={StoreStatus[StoreStatus.ACTIVE] === status}
              disabled={store?.isDefault}
            />
            <span>Active store</span>
          </div>

          <div>
            <div className="mt-10 mb-6 h-px bg-stroke dark:bg-dark-3"></div>
            <div className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Save changes</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
