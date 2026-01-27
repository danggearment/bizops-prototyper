import { ShippingParcelStatusLabel } from "@/constants/enum-label"
import {
  UpdateShippingPlanStatusSchema,
  UpdateShippingPlanStatusType,
} from "@/schemas/schemas/shipping-plan"
import { useMutationFfm } from "@/services/connect-rpc/transport"
import { queryClient } from "@/services/react-query"
import {
  staffGetShippingPlan,
  staffUpdateShippingParcelHandled,
} from "@gearment/nextapi/api/ffm/v1/cross_dock_admin-CrossDockingFulfillmentAdminAPI_connectquery"
import { ShippingParcel_Status } from "@gearment/nextapi/api/ffm/v1/cross_dock_pb"
import {
  Button,
  ComboboxField,
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
  toast,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { useUpdateParcelModal } from "./modal-update-parcel-store"

const ShippingPlanStatusOptions = [
  {
    label: ShippingParcelStatusLabel[ShippingParcel_Status.NEW],
    value: ShippingParcel_Status.NEW.toString(),
  },
  {
    label: ShippingParcelStatusLabel[ShippingParcel_Status.UNDER_REVIEW],
    value: ShippingParcel_Status.UNDER_REVIEW.toString(),
  },
  {
    label: ShippingParcelStatusLabel[ShippingParcel_Status.AWAITING_PACKING],
    value: ShippingParcel_Status.AWAITING_PACKING.toString(),
  },
  {
    label: ShippingParcelStatusLabel[ShippingParcel_Status.READY_FOR_SHIPPING],
    value: ShippingParcel_Status.READY_FOR_SHIPPING.toString(),
  },
  {
    label: ShippingParcelStatusLabel[ShippingParcel_Status.COMPLETED],
    value: ShippingParcel_Status.COMPLETED.toString(),
  },

  {
    label: ShippingParcelStatusLabel[ShippingParcel_Status.RECEIVED],
    value: ShippingParcel_Status.RECEIVED.toString(),
  },
  {
    label: ShippingParcelStatusLabel[ShippingParcel_Status.SHIPPED],
    value: ShippingParcel_Status.SHIPPED.toString(),
  },
  {
    label: ShippingParcelStatusLabel[ShippingParcel_Status.EXCEPTION],
    value: ShippingParcel_Status.EXCEPTION.toString(),
  },
  {
    label: ShippingParcelStatusLabel[ShippingParcel_Status.CANCELED],
    value: ShippingParcel_Status.CANCELED.toString(),
  },
]

export function UpdateParcelModal() {
  const { open, shippingPlanId, shippingParcelId, actions } =
    useUpdateParcelModal((state) => ({
      open: state.open,
      shippingPlanId: state.shippingPlanId,
      shippingParcelId: state.shippingParcelId,
      actions: state.actions,
    }))

  const form = useForm<UpdateShippingPlanStatusType>({
    defaultValues: {
      status: ShippingParcel_Status.NEW,
    },
    resolver: zodResolver(UpdateShippingPlanStatusSchema),
  })

  const mutation = useMutationFfm(staffUpdateShippingParcelHandled, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          staffGetShippingPlan.service.typeName,
          staffGetShippingPlan.name,
        ],
      })
      toast({
        title: "Update parcel status success",
        description: "Update parcel status successfully",
        variant: "success",
      })
    },
    onError: (err) => {
      toast({
        variant: "error",
        title: "Update parcel status failed",
        description: err.rawMessage,
      })
    },
  })

  const onSubmit: SubmitHandler<UpdateShippingPlanStatusType> = async (
    data,
  ) => {
    try {
      await mutation.mutateAsync({
        shippingPlanId: shippingPlanId,
        shippingParcelId: shippingParcelId,
        status: data.status as ShippingParcel_Status,
      })
      form.reset()
      actions.onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={actions.onClose}>
      <DialogContent className="max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Parcel: #{shippingParcelId}</DialogTitle>
          <DialogDescription>Update the status of the parcel</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <ComboboxField
                      {...field}
                      value={field.value.toString()}
                      placeholder="Select status"
                      options={ShippingPlanStatusOptions}
                      onChange={(value) => {
                        field.onChange(Number(value))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                size={"sm"}
                variant={"outline"}
                onClick={() => {
                  form.reset()
                  actions.onClose()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size={"sm"} variant="default">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
