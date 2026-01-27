import { InputField, Switch } from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useOpenFeatureModal } from "./modal-open-feature-store"

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@gearment/ui3"

const FlagSchema = z.object({
  flagName: z.string().min(1, "Flag name is required"),
  whitelist: z.string().min(1, "Whitelist is required"),
  defaultVersion: z.string().optional(),
  whitelistVersion: z.string().optional(),
  defaultActive: z.boolean(),
})

export type FlagType = z.infer<typeof FlagSchema>

export function ModalOpenFeature() {
  const { open, actions, onSave, title, defaultValues } = useOpenFeatureModal()
  const [loading, setLoading] = useState(false)

  const form = useForm<FlagType>({
    defaultValues,
    values: defaultValues,
    resolver: zodResolver(FlagSchema),
  })

  const handleSubmit = async (values: FlagType) => {
    try {
      if (onSave.constructor.name === "AsyncFunction") {
        setLoading(true)
        await onSave(values)
      } else {
        onSave(values)
      }
    } finally {
      if (onSave.constructor.name === "AsyncFunction") {
        setLoading(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={actions.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="flagName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Flag name</FormLabel>
                  <FormControl>
                    <InputField {...field} placeholder="Enter flag name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whitelist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Whitelist email</FormLabel>
                  <FormControl>
                    <InputField {...field} placeholder="Enter whitelist" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultVersion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default version</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      placeholder="Enter default version"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whitelistVersion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Whitelist version</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      placeholder="Enter whitelist version"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultActive"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="">Active flag for default member</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => actions.onClose()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} loading={loading}>
                  Save
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
