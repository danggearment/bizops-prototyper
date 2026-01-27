import {
  CatalogOption_Group_Status,
  GMProductOption_OptionType,
} from "@/services/connect-rpc/types"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputField,
  SelectField,
  Switch,
  TextareaField,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useModalOptionGroup } from "./modal-option-group-store"

const optionGroupSchema = z.object({
  groupName: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.nativeEnum(CatalogOption_Group_Status),
  type: z.nativeEnum(GMProductOption_OptionType),
})

export type OptionGroupType = z.infer<typeof optionGroupSchema>

export function ModalOptionGroup() {
  const {
    open,
    actions,
    title,
    description,
    confirmText,
    defaultValues,
    onConfirm,
    disabledChangeType,
  } = useModalOptionGroup()

  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<OptionGroupType>({
    defaultValues,
    resolver: zodResolver(optionGroupSchema),
  })

  const options = [
    { value: GMProductOption_OptionType.COLOR.toString(), text: "Color" },
    { value: GMProductOption_OptionType.SIZE.toString(), text: "Size" },
    { value: GMProductOption_OptionType.MATERIAL.toString(), text: "Material" },
  ]

  const handleSubmit = async (values: OptionGroupType) => {
    setLoading(true)
    try {
      await onConfirm(values)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      form.reset(defaultValues)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={actions.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Group name</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      placeholder="e.g., Color, Size, Material, etc."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <TextareaField
                      {...field}
                      className="placeholder:text-sm text-sm"
                      placeholder="Fabric and material types"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Type</FormLabel>
                  <FormControl>
                    <SelectField
                      disabled={disabledChangeType}
                      options={options}
                      value={field.value.toString()}
                      onChange={(value) => field.onChange(Number(value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel>
                      <div className="space-y-1">
                        <div>Status</div>
                        <span className="text-sm text-muted-foreground/80">
                          Active group are available for product assignment
                        </span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Switch
                        {...field}
                        checked={
                          field.value ===
                          CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_ACTIVE
                        }
                        onCheckedChange={(value) => {
                          field.onChange(
                            value
                              ? CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_ACTIVE
                              : CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_INACTIVE,
                          )
                        }}
                      />
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={actions.onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} loading={loading}>
                {confirmText}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
