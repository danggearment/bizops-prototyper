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
  TextareaField,
  toast,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { useModalConfirmPaid } from "./modal-confirm-paid-store"

import {
  ConfirmShippingPlanPaidSchema,
  ConfirmShippingPlanPaidType,
} from "@/schemas/schemas/shipping-plan"
import { queryClient } from "@/services/react-query"
import {
  staffConfirmShippingPlanPaid,
  staffGetShippingPlan,
} from "@gearment/nextapi/api/ffm/v1/cross_dock_admin-CrossDockingFulfillmentAdminAPI_connectquery"

export function ModalConfirmPaid() {
  const { open, shippingPlanId, actions } = useModalConfirmPaid((state) => ({
    open: state.open,
    shippingPlanId: state.shippingPlanId,
    actions: state.actions,
  }))

  const form = useForm<ConfirmShippingPlanPaidType>({
    values: {
      shippingPlanId: shippingPlanId,
      paymentReferenceId: "",
      paymentNote: "",
    },
    resolver: zodResolver(ConfirmShippingPlanPaidSchema),
  })

  const mutation = useMutationFfm(staffConfirmShippingPlanPaid, {
    onSuccess: () => {
      toast({
        title: "Confirm shipping plan paid success",
        description: "Confirm shipping plan paid successfully",
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
        title: "Confirm shipping plan paid failed",
        description: err.rawMessage,
      })
    },
  })

  const onSubmit: SubmitHandler<ConfirmShippingPlanPaidType> = async (data) => {
    try {
      await mutation.mutateAsync({
        shippingPlanId: shippingPlanId,
        paymentReferenceId: data.paymentReferenceId,
        paymentNote: data.paymentNote,
      })
      actions.onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit form. Please try again.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={actions.onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirm shipping plan paid</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="paymentReferenceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Payment reference ID</FormLabel>
                  <FormControl>
                    <InputField {...field} placeholder="Payment reference ID" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Payment note</FormLabel>
                  <FormControl>
                    <TextareaField
                      {...field}
                      placeholder="Payment note"
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2">
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
