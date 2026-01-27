import { slugify } from "@/utils/format-string"
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
  InputField,
  TextareaField,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SelectGroup } from "./-components/select-group"
import { useModalAttributeValue } from "./modal-attribute-value-store"

const MAX_ATTRIBUTE_VALUE_LENGTH = 50

const AttributeValueSchema = z.object({
  value: z
    .string()
    .min(1, "Value is required")
    .max(
      MAX_ATTRIBUTE_VALUE_LENGTH,
      `Value must be at most ${MAX_ATTRIBUTE_VALUE_LENGTH} characters`,
    ),
  attributeGroupKeys: z.array(z.string()).optional(),
  code: z.string().optional(),
  description: z.string().optional(),
})

export type AttributeValueType = z.infer<typeof AttributeValueSchema>

export function ModalAttributeValue() {
  const {
    open,
    actions,
    onConfirm,
    defaultValues,
    title,
    submitText,
    hasCreateNewAttributeGroup,
  } = useModalAttributeValue()
  const [loading, setLoading] = useState(false)

  const form = useForm<AttributeValueType>({
    defaultValues,
    resolver: zodResolver(AttributeValueSchema),
  })

  const handleSubmit = async (values: AttributeValueType) => {
    setLoading(true)
    try {
      await onConfirm(values)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    form.reset(defaultValues)
  }, [open, defaultValues])

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
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attribute name</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      readOnly={!!defaultValues?.code}
                      disabled={!!defaultValues?.code}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value)
                        // if (defaultValues?.code) {
                        //   return
                        // }
                        const slug = slugify(value)
                        form.setValue("code", slug, {
                          shouldDirty: true,
                        })
                      }}
                      placeholder="e.g., Brand, Material, Origin Country"
                    />
                  </FormControl>
                  {form.formState.errors.value ? (
                    <FormMessage />
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      {`${form.getValues("value").length}/${MAX_ATTRIBUTE_VALUE_LENGTH} characters`}
                    </span>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Attribute code</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      readOnly={!!defaultValues?.code}
                      disabled={!!defaultValues?.code}
                      placeholder="e.g., brand, material, origin_country"
                    />
                  </FormControl>
                  {form.formState.errors.code ? (
                    <FormMessage />
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Unique identifier (lowercase, underscores allowed)
                    </span>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attributeGroupKeys"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attribute groups</FormLabel>
                  <FormControl>
                    <SelectGroup
                      defaultValues={defaultValues?.attributeGroupKeys || []}
                      attrCode={defaultValues?.code || ""}
                      onChange={field.onChange}
                      hasCreateNewAttributeGroup={hasCreateNewAttributeGroup}
                    />
                  </FormControl>
                  {form.formState.errors.description ? (
                    <FormMessage />
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Optional - Select one or more groups. Leave empty for
                      ungrouped attributes.
                    </span>
                  )}
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
                      rows={5}
                      className="text-sm"
                      placeholder="Describe the purpose of this attribute..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={actions.onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} loading={loading}>
                  {submitText}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
