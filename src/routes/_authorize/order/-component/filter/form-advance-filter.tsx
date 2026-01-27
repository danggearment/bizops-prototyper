import {
  Button,
  CheckboxField,
  ComboboxField,
  ComboboxMultiField,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  toast,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import {
  AllOrderLocationAllOrder,
  CreationMethodOptionsAllOrder,
  GiftMessageOptionsAllOrder,
  IOSSOptionsAllOrder,
  MarkFulfilledOptionsAllOrder,
  OrderLocationOptionsAllOrder,
  PlatformOptionsAllOrder,
  ProcessingStatusComboboxOptionsAllOrder,
  UncompletedOrderOptionValue,
  UnCompleteOrderStatuses,
} from "@/constants/order"
import { AllOrderSearchSchema } from "@/schemas/schemas/all-orders"
import { OrderDraftSearchSchema } from "@/schemas/schemas/order-draft.ts"
import { useLocation } from "@tanstack/react-router"
import { useMemo } from "react"
import { OrderDuplicatedOptionsSaleOrder } from "./option.ts"

const Divider = () => <div className="border-t border-border" />

type AdvanceFilterType = z.infer<typeof AllOrderSearchSchema>

function hasAllUncompletedStatusesSelected(values: string[]) {
  return UnCompleteOrderStatuses.every((status) => values.includes(status))
}

function toSelectedValuesFromNumeric(numericValues: number[]) {
  const hasUncompletedStatuses = UnCompleteOrderStatuses.every((status) =>
    numericValues.includes(Number(status)),
  )

  return [
    ...numericValues.map((v) => v.toString()),
    ...(hasUncompletedStatuses ? [UncompletedOrderOptionValue] : []),
  ]
}

function normalizeProcessingStatusesChange(
  newValues: string[],
  prevSelectedValues: string[],
) {
  let updated = [...newValues]

  const hasUncompleted = updated.includes(UncompletedOrderOptionValue)
  const hadUncompletedBefore = prevSelectedValues.includes(
    UncompletedOrderOptionValue,
  )

  if (hasUncompleted && !hadUncompletedBefore) {
    updated = [...new Set([...updated, ...UnCompleteOrderStatuses])]
  } else if (!hasUncompleted && hadUncompletedBefore) {
    updated = updated.filter((v) => !UnCompleteOrderStatuses.includes(v))
  } else if (hasUncompleted && hadUncompletedBefore) {
    if (!hasAllUncompletedStatusesSelected(updated)) {
      updated = updated.filter((v) => v !== UncompletedOrderOptionValue)
    }
  }

  return updated
    .filter((v) => v !== UncompletedOrderOptionValue)
    .map((v) => Number(v))
}

export const DEFAULT_ADVANCE_FILTER: Partial<AdvanceFilterType> = {
  platforms: [],
  createdMethods: [],
  productIds: [],
  colorCodes: [],
  sizeCodes: [],
  shippingMethods: [],
  options: [],
  positionPrint: [],
  orderLocation: AllOrderLocationAllOrder.ORDER_LOCATION_UNKNOWN,
  carrier: [],
  productType: undefined,
  priority: "",
  refundStatus: [],
  ioss: "",
  variant: "",
  storeId: "",
  fulfillmentVendors: [],
  processingStatuses: [],
  markFulfilled: undefined,
}

interface FormAdvanceFilter {
  onCloseFilter: () => void
  search: any
  handleSetFilter: (
    filter: any,
    resetRowState?: boolean,
    replace?: boolean,
  ) => void
  shippingMethodsOption: any[]
  products: any[]
  colors: any[]
  carriers: any[]
  productTypes: any[]
  sizes: any[]
  printPositions: any[]
  priorityTypes: any[]
  refundStatus: any[]
  fulfillmentVendors?: any[]
}

export default function FormAdvanceFilter({
  onCloseFilter,
  search,
  handleSetFilter,
  shippingMethodsOption,
  products,
  colors,
  carriers,
  productTypes,
  sizes,
  printPositions,
  priorityTypes,
  refundStatus,

  fulfillmentVendors,
}: FormAdvanceFilter) {
  const location = useLocation()

  const schema = location.pathname.includes("/draft-orders")
    ? OrderDraftSearchSchema
    : AllOrderSearchSchema

  const form = useForm<AdvanceFilterType>({
    values: {
      ...DEFAULT_ADVANCE_FILTER,
      ...search,
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: AdvanceFilterType) => {
    try {
      const newFilter = {
        ...search,
        ...values,
        page: 1,
      }
      handleSetFilter(newFilter)
      onCloseFilter()
    } catch (_error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Some things went wrong",
      })
    }
  }

  const handleClearAll = () => {
    handleSetFilter({
      ...schema.parse(DEFAULT_ADVANCE_FILTER),
    })
  }

  const colorsOptions = useMemo(() => {
    return colors.map((color) => ({
      label: color.name,
      value: color.value,
    }))
  }, [colors])

  const productTypesOptions = useMemo(() => {
    return productTypes.map((productType) => ({
      label: productType.name,
      value: productType.value.toString(),
    }))
  }, [productTypes])

  const productOptions = useMemo(() => {
    return products.flatMap((product) =>
      product.product.map((item: any) => ({
        label: item.name,
        value: item.value,
        productType: product.productType,
      })),
    )
  }, [products])

  const sizeOptions = useMemo(() => {
    return sizes.map((size) => ({
      label: size.name,
      value: size.value,
    }))
  }, [sizes])

  const trackingCarrierOptions = useMemo(() => {
    return carriers.map((tracking) => ({
      label: tracking.name,
      value: tracking.value,
    }))
  }, [carriers])

  const printPositionsOptions = useMemo(() => {
    return printPositions.map((print) => ({
      label: print.name,
      value: print.value,
    }))
  }, [printPositions])

  const priorityTypesOptions = useMemo(() => {
    return priorityTypes.map((priority) => ({
      label: priority.name,
      value: priority.value,
    }))
  }, [priorityTypes])

  const refundStatusOptions = useMemo(() => {
    return refundStatus.map((refund) => ({
      label: refund.name,
      value: refund.value.toString(),
    }))
  }, [refundStatus])

  const fulfillmentVendorsOptions = useMemo(() => {
    return fulfillmentVendors?.map((vendor) => ({
      label: vendor.name,
      value: vendor.value.toString(),
    }))
  }, [fulfillmentVendors])

  return (
    <Form {...form}>
      <form
        className="space-y-6 relative"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-12 gap-3">
          <label className="body-small font-semibold text-secondary-text col-span-12">
            Platforms
          </label>
          {PlatformOptionsAllOrder.map((platform) => (
            <div key={platform.value} className="col-span-6">
              <FormField
                control={form.control}
                name="platforms"
                render={({ field }) => (
                  <FormItem className="flex items-center flex-row">
                    <FormControl>
                      <CheckboxField
                        checked={field.value?.includes(platform.value)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...(field.value || []), platform.value]
                            : field.value?.filter((v) => v !== platform.value)
                          field.onChange(newValue)
                        }}
                      />
                    </FormControl>
                    <FormLabel>{platform.text}</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <Divider />

        <div className="grid grid-cols-12 gap-3">
          <label className="body-small font-semibold text-secondary-text col-span-12">
            Creation methods
          </label>
          {CreationMethodOptionsAllOrder.map((method) => (
            <div key={method.value} className="col-span-6">
              <FormField
                control={form.control}
                name="createdMethods"
                render={({ field }) => (
                  <FormItem className="flex items-center flex-row">
                    <FormControl>
                      <CheckboxField
                        checked={field.value?.includes(method.value)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...(field.value || []), method.value]
                            : field.value?.filter((v) => v !== method.value)
                          field.onChange(newValue)
                        }}
                      />
                    </FormControl>
                    <FormLabel>{method.text}</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <Divider />

        <div className="space-y-3">
          <div className="body-small font-semibold text-secondary-text col-span-12">
            Tracking & carrier
          </div>
          <Controller
            control={form.control}
            name="carrier"
            render={({ field: { onChange, value } }) => (
              <ComboboxField
                value={value?.length ? value[0] : ""}
                onChange={(newValue) => onChange(newValue ? [newValue] : [])}
                placeholder="Select tracking & carrier"
                options={trackingCarrierOptions}
                modal
              />
            )}
          />
        </div>

        <Divider />

        <div className="space-y-3">
          <div className="body-small font-semibold text-secondary-text col-span-12">
            Order product type
          </div>
          <Controller
            control={form.control}
            name="productType"
            render={({ field: { onChange, value } }) => {
              return (
                <ComboboxField
                  value={value || ""}
                  onChange={(newValue) => onChange(newValue)}
                  placeholder="Select order product type"
                  options={productTypesOptions}
                  modal
                />
              )
            }}
          />
        </div>

        <Divider />

        <div className="space-y-3">
          <div className="body-small font-semibold text-secondary-text col-span-12">
            Priority
          </div>
          <Controller
            control={form.control}
            name="priority"
            render={({ field: { onChange, value } }) => (
              <ComboboxField
                value={value || ""}
                onChange={onChange}
                placeholder="Select priority"
                options={priorityTypesOptions}
                modal
              />
            )}
          />
        </div>

        {refundStatusOptions.length > 0 && (
          <>
            <Divider />
            <div className="space-y-3">
              <div className="body-small font-semibold text-secondary-text col-span-12">
                Refund Status
              </div>
              <Controller
                control={form.control}
                name="refundStatus"
                render={({ field: { onChange, value } }) => (
                  <ComboboxField
                    value={value?.length ? value[0].toString() : ""}
                    onChange={(newValue) => {
                      onChange(newValue ? [Number(newValue)] : [])
                    }}
                    placeholder="Select refund status"
                    options={refundStatusOptions}
                    modal
                  />
                )}
              />
            </div>
          </>
        )}

        <>
          <Divider />
          <div className="space-y-3">
            <div className="body-small font-semibold text-secondary-text col-span-12">
              Order Status
            </div>
            <Controller
              control={form.control}
              name="processingStatuses"
              render={({ field: { onChange, value } }) => {
                const numericValues = value || []
                const selectedValues =
                  toSelectedValuesFromNumeric(numericValues)

                return (
                  <ComboboxMultiField
                    value={selectedValues}
                    onChange={(newValue) => {
                      const normalized = normalizeProcessingStatusesChange(
                        newValue,
                        selectedValues,
                      )
                      onChange(normalized)
                    }}
                    placeholder="Select order status"
                    options={ProcessingStatusComboboxOptionsAllOrder}
                    modal
                  />
                )
              }}
            />
          </div>
        </>

        {MarkFulfilledOptionsAllOrder.length > 0 && (
          <div className="space-y-3">
            <div className="body-small font-semibold text-secondary-text col-span-12">
              Mark Fulfilled
            </div>
            <Controller
              control={form.control}
              name="markFulfilled"
              render={({ field: { onChange, value } }) => (
                <ComboboxField
                  value={value || ""}
                  onChange={(newValue) => {
                    onChange(newValue ? newValue : null)
                  }}
                  placeholder="Select mark fulfilled"
                  options={MarkFulfilledOptionsAllOrder}
                  modal
                />
              )}
            />
          </div>
        )}

        <Divider />

        <div className="space-y-3">
          <div className="body-small font-semibold text-secondary-text col-span-12">
            Product
          </div>
          <Controller
            control={form.control}
            name="productIds"
            render={({ field: { onChange, value } }) => (
              <ComboboxMultiField
                value={value || []}
                onChange={onChange}
                placeholder="Select product"
                options={productOptions}
                allowClear
                modal
                size="sm"
              />
            )}
          />

          <div className="body-small font-semibold text-secondary-text col-span-12">
            Color
          </div>
          <Controller
            control={form.control}
            name="colorCodes"
            render={({ field: { onChange, value } }) => (
              <ComboboxMultiField
                value={value || []}
                onChange={onChange}
                placeholder="Select colors"
                options={colorsOptions}
                allowClear
                modal
              />
            )}
          />

          <div className="body-small font-semibold text-secondary-text col-span-12">
            Size
          </div>
          <Controller
            control={form.control}
            name="sizeCodes"
            render={({ field: { onChange, value } }) => (
              <ComboboxMultiField
                value={value || []}
                onChange={onChange}
                placeholder="Select sizes"
                options={sizeOptions}
                allowClear
                modal
              />
            )}
          />

          <div className="body-small font-semibold text-secondary-text col-span-12">
            Position print
          </div>
          <Controller
            control={form.control}
            name="positionPrint"
            render={({ field: { onChange, value } }) => (
              <ComboboxMultiField
                value={value || []}
                onChange={onChange}
                placeholder="Select position print"
                options={printPositionsOptions}
                allowClear
                modal
                size="sm"
              />
            )}
          />
        </div>

        <Divider />
        <div className="space-y-3">
          <div className="body-small font-semibold text-secondary-text col-span-12">
            Fulfillment vendor
          </div>
          <Controller
            control={form.control}
            name="fulfillmentVendors"
            render={({ field: { onChange, value } }) => (
              <ComboboxMultiField
                value={value || []}
                onChange={onChange}
                placeholder="Select fulfillment vendor"
                options={fulfillmentVendorsOptions || []}
                allowClear
                modal
                size="sm"
              />
            )}
          />
        </div>
        <Divider />

        <div className="grid grid-cols-12 gap-3">
          <label className="body-small font-semibold text-secondary-text col-span-12">
            Shipping methods
          </label>
          {shippingMethodsOption.map((method) => (
            <div key={method.value} className="col-span-6">
              <FormField
                control={form.control}
                name="shippingMethods"
                render={({ field }) => (
                  <FormItem className="flex items-center flex-row">
                    <FormControl>
                      <CheckboxField
                        checked={field.value?.includes(method.value)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...(field.value || []), method.value]
                            : field.value?.filter((v) => v !== method.value)
                          field.onChange(newValue)
                        }}
                      />
                    </FormControl>
                    <FormLabel>{method.name}</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
        <Divider />

        <div className="grid grid-cols-12 gap-3">
          <label className="body-small font-semibold text-secondary-text col-span-12">
            Order Location
          </label>
          {OrderLocationOptionsAllOrder.map((location) => (
            <div key={location.value} className="col-span-6">
              <FormField
                control={form.control}
                name="orderLocation"
                render={({ field }) => (
                  <FormItem className="flex items-center flex-row">
                    <FormControl>
                      <CheckboxField
                        checked={field.value === location.value}
                        onCheckedChange={() => {
                          field.onChange(location.value)
                        }}
                      />
                    </FormControl>
                    <FormLabel>{location.text}</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
        <Divider />

        <div className="grid grid-cols-12 gap-3">
          <label className="body-small font-semibold text-secondary-text col-span-12">
            IOSS Number
          </label>
          {IOSSOptionsAllOrder.map((ioss) => (
            <div key={ioss.value} className="col-span-6">
              <FormField
                control={form.control}
                name="options"
                render={({ field }) => (
                  <FormItem className="flex items-center flex-row">
                    <FormControl>
                      <CheckboxField
                        checked={field.value?.includes(ioss.value)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...(field.value || []), ioss.value]
                            : field.value?.filter((v) => v !== ioss.value)
                          field.onChange(newValue)
                        }}
                      />
                    </FormControl>
                    <FormLabel>{ioss.text}</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
        <Divider />

        <div className="grid grid-cols-12 gap-3">
          <label className="body-small font-semibold col-span-12">
            Order duplicated
          </label>
          {OrderDuplicatedOptionsSaleOrder.map((duplicate) => (
            <div key={duplicate.value} className="col-span-6">
              <FormField
                control={form.control}
                name="options"
                render={({ field }) => (
                  <FormItem className="flex items-center flex-row">
                    <FormControl>
                      <CheckboxField
                        checked={field.value?.includes(duplicate.value)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...(field.value || []), duplicate.value]
                            : field.value?.filter((v) => v !== duplicate.value)
                          field.onChange(newValue)
                        }}
                      />
                    </FormControl>
                    <FormLabel>{duplicate.text}</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <Divider />

        <div className="grid grid-cols-12 gap-3">
          <label className="body-small font-semibold text-secondary-text col-span-12">
            Gift message
          </label>
          {GiftMessageOptionsAllOrder.map((giftMessage) => (
            <div key={giftMessage.value} className="col-span-6">
              <FormField
                control={form.control}
                name="options"
                render={({ field }) => (
                  <FormItem className="flex items-center flex-row">
                    <FormControl>
                      <CheckboxField
                        checked={field.value?.includes(giftMessage.value)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...(field.value || []), giftMessage.value]
                            : field.value?.filter(
                                (v) => v !== giftMessage.value,
                              )
                          field.onChange(newValue)
                        }}
                      />
                    </FormControl>
                    <FormLabel>{giftMessage.text}</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className="flex sticky bottom-0 z-10 pb-3 px-6 -mx-6 justify-between bg-white pt-4 border-t border-border">
          <Button
            onClick={handleClearAll}
            type="button"
            variant="outline"
            size="sm"
          >
            Reset all
          </Button>
          <div className="flex gap-3">
            <Button
              onClick={onCloseFilter}
              size="sm"
              type="button"
              variant="outline"
              className="border-primary text-primary"
            >
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Apply filter
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
