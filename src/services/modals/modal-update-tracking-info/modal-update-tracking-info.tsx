import { useMutationFfm } from "@/services/connect-rpc/transport"
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
  toast,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { useUpdateTrackingInfoModal } from "./modal-update-tracking-info-store"

import {
  UpdateShippingParcelTrackingInfoSchema,
  UpdateShippingParcelTrackingInfoType,
} from "@/schemas/schemas/shipping-plan"
import { queryClient } from "@/services/react-query"
import {
  staffGetShippingPlan,
  staffUpdateShippingParcelTrackingInfo,
} from "@gearment/nextapi/api/ffm/v1/cross_dock_admin-CrossDockingFulfillmentAdminAPI_connectquery"

export function UpdateTrackingInfoModal() {
  const { open, shippingPlanId, shippingParcelId, actions, trackingInfo } =
    useUpdateTrackingInfoModal((state) => ({
      open: state.open,
      shippingPlanId: state.shippingPlanId,
      shippingParcelId: state.shippingParcelId,
      actions: state.actions,
      trackingInfo: state.trackingInfo,
    }))

  const form = useForm<UpdateShippingParcelTrackingInfoType>({
    values: trackingInfo,
    resolver: zodResolver(UpdateShippingParcelTrackingInfoSchema),
  })

  const mutation = useMutationFfm(staffUpdateShippingParcelTrackingInfo, {
    onSuccess: () => {
      toast({
        title: "Update tracking info success",
        description: "Update tracking info successfully",
        variant: "success",
      })
      queryClient.invalidateQueries({
        queryKey: [
          staffGetShippingPlan.service.typeName,
          staffGetShippingPlan.name,
        ],
      })
    },
    onError: (err) => {
      toast({
        variant: "error",
        title: "Update tracking info failed",
        description: err.rawMessage,
      })
    },
  })

  const onSubmit: SubmitHandler<UpdateShippingParcelTrackingInfoType> = async (
    data,
  ) => {
    try {
      await mutation.mutateAsync({
        shippingPlanId: shippingPlanId,
        shippingParcelId: shippingParcelId,
        trackingInfo: {
          ...data,
        },
      })
      form.reset()
      actions.onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={actions.onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update shipping plan status</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="labelUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Label URL</FormLabel>
                  <FormControl>
                    <InputField {...field} placeholder="Label URL" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trackingUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tracking URL</FormLabel>
                  <FormControl>
                    <InputField {...field} placeholder="Tracking carrier" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trackingCarrier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tracking carrier</FormLabel>
                  <FormControl>
                    <InputField {...field} placeholder="Tracking URL" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trackingService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tracking service</FormLabel>
                  <FormControl>
                    <InputField {...field} placeholder="Tracking service" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trackingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Tracking number</FormLabel>
                  <FormControl>
                    <InputField {...field} placeholder="Tracking number" />
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
