import { GMAttributeSelectionType } from "@/services/connect-rpc/types"
import { ErrorResponse, getBusinessCode } from "@/utils"
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
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
  RadioGroup,
  RadioGroupItem,
  TextareaField,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useModalAttributeGroup } from "./modal-attribute-group-store"

const AttributeGroupSchema = z
  .object({
    name: z.string().min(1, "Group name is required"),
    description: z.string().optional(),
    selectionType: z.nativeEnum(GMAttributeSelectionType),
    maxSelection: z
      .number({
        invalid_type_error: "Max selection must be a number",
        required_error: "Max selection is required",
      })
      .optional(),
    minSelection: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.selectionType ===
      GMAttributeSelectionType.GM_ATTRIBUTE_SELECTION_TYPE_MULTIPLE
    ) {
      if (data.maxSelection === undefined || Number.isNaN(data.maxSelection)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["maxSelection"],
          message:
            "Please enter the maximum number of selections allowed (Max selection) (numeric value)",
        })
      }
    }
    if (
      data.maxSelection !== undefined &&
      data.maxSelection !== null &&
      data.maxSelection < 2 &&
      data.selectionType ===
        GMAttributeSelectionType.GM_ATTRIBUTE_SELECTION_TYPE_MULTIPLE
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["maxSelection"],
        message: "Max selection must be greater than or equal to 2",
      })
    }
  })

export type AttributeGroupType = z.infer<typeof AttributeGroupSchema>

const SELECTION_TYPE_OPTIONS = [
  {
    value:
      GMAttributeSelectionType.GM_ATTRIBUTE_SELECTION_TYPE_SINGLE.toString(),
    text: "Single select",
    description: "User can select only one value (Dropdown / Radio)",
  },
  {
    value:
      GMAttributeSelectionType.GM_ATTRIBUTE_SELECTION_TYPE_MULTIPLE.toString(),
    text: "Multiple select",
    description:
      "User can select multiple values from the list (Tag / Checkbox)",
  },
]
export function ModalAttributeGroup() {
  const {
    open,
    actions,
    onConfirm,
    defaultValues,
    title,
    description,
    confirmText,
    modifyText,
  } = useModalAttributeGroup()
  const [loading, setLoading] = useState(false)

  const form = useForm<AttributeGroupType>({
    defaultValues,
    resolver: zodResolver(AttributeGroupSchema),
  })

  const handleSubmit = async (values: AttributeGroupType) => {
    setLoading(true)
    try {
      await onConfirm({
        ...values,
        maxSelection:
          values.selectionType ===
          GMAttributeSelectionType.GM_ATTRIBUTE_SELECTION_TYPE_MULTIPLE
            ? values.maxSelection
            : 1,
        minSelection: 1,
      })
    } catch (error) {
      const businessErrorCode = getBusinessCode(
        error as unknown as ErrorResponse,
      )
      if (businessErrorCode?.code === "103-2101") {
        form.setError("name", {
          message: "Group name already exists. Please choose another name",
        })
        form.setFocus("name")
      }
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Group name</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      readOnly={!!defaultValues?.name}
                      className={cn(
                        !!defaultValues?.name && "cursor-not-allowed",
                      )}
                      placeholder="e.g., Nutrition type, Brand, Function, etc."
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
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <TextareaField
                      {...field}
                      rows={5}
                      className="text-sm"
                      placeholder="Brief description of this attribute group"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selectionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Selection type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value.toString()}
                      onValueChange={(value) => {
                        field.onChange(Number(value))
                        if (
                          value ===
                            GMAttributeSelectionType.GM_ATTRIBUTE_SELECTION_TYPE_SINGLE.toString() &&
                          !form.getValues("maxSelection")
                        ) {
                          form.setValue("maxSelection", 1)
                        }
                      }}
                    >
                      <div className="space-y-2">
                        {SELECTION_TYPE_OPTIONS.map((option) => (
                          <label
                            className={cn(
                              "flex gap-2.5 cursor-pointer p-3 rounded-lg",
                              field.value.toString() === option.value.toString()
                                ? "bg-primary/10 ring-primary/50 ring-2 ring-offset-2"
                                : "bg-transparent",
                            )}
                            key={option.value.toString()}
                          >
                            <RadioGroupItem
                              value={option.value.toString()}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{option.text}</p>
                              <p className="text-xs text-foreground/80">
                                {option.description}
                              </p>
                              <div
                                className={cn(
                                  field.value.toString() ===
                                    option.value.toString() &&
                                    option.value.toString() ===
                                      GMAttributeSelectionType.GM_ATTRIBUTE_SELECTION_TYPE_MULTIPLE.toString()
                                    ? "mt-2"
                                    : "sr-only",
                                )}
                              >
                                <div className="pl-3">
                                  <FormField
                                    control={form.control}
                                    name="maxSelection"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>
                                          Max items selectable (for multiple
                                          select type)
                                        </FormLabel>
                                        <FormControl>
                                          <>
                                            <InputField
                                              {...field}
                                              onChange={(e) => {
                                                const num = parseInt(
                                                  e.target.value,
                                                  10,
                                                )
                                                field.onChange(
                                                  Number.isNaN(num)
                                                    ? undefined
                                                    : num,
                                                )
                                              }}
                                              className="bg-background"
                                              type="number"
                                              placeholder="Max items selectable"
                                            />
                                            <span className="text-xs text-foreground/80">
                                              Maximum number of attributes that
                                              can be selected from this group.
                                            </span>
                                          </>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {modifyText && (
              <div className="text-sm text-foreground/80 pt-2 border-t border-border">
                {modifyText}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={actions.onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} loading={loading}>
                {confirmText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
