import {
  passwordHint,
  passwordValidation,
  passwordValidationMessage,
} from "@/constants/validation.ts"
import { useMutationIam } from "@/services/connect-rpc/transport.tsx"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { ErrorResponse, getBusinessCode, handleClearSession } from "@/utils"
import { staffLogout } from "@gearment/nextapi/api/iam/v1/staff_account-StaffAccountAPI_connectquery"
import { staffResetPassword } from "@gearment/nextapi/api/iam/v1/staff_account-StaffAccountAPI_connectquery.ts"
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
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
import { _debounce } from "@gearment/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .regex(passwordValidation, { message: passwordValidationMessage }),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password does not match",
        path: ["confirmPassword"],
      })
    }
  })

type ChangePasswordType = z.infer<typeof ChangePasswordSchema>

interface Props {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ModalChangePassword({
  openModal,
  setOpenModal,
}: Props) {
  const [setOpenConfirm, closeConfirm] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])
  const [toggleEyes, setToggleEyes] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  const form = useForm<ChangePasswordType>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(ChangePasswordSchema),
  })

  const mutationLogout = useMutationIam(staffLogout, {
    onSuccess: () => {
      handleClearSession()
      window.location.href = `/login`
    },
    onError: () => {
      handleClearSession()
      closeConfirm()
      window.location.href = `/login`
    },
  })

  const handleLogout = _debounce(async () => {
    await mutationLogout.mutateAsync({})
  }, 3000)

  const mutationUpdatePassword = useMutationIam(staffResetPassword, {
    onSuccess: () => {
      closeConfirm()
      toast({
        variant: "success",
        title: "Password updated",
        description:
          "Password changed successfully. You will be signed out in 3 seconds.",
      })
      handleLogout()
    },
    onError: (error) => {
      closeConfirm()
      const businessErrorCode = getBusinessCode(
        error as unknown as ErrorResponse,
      )
      if (businessErrorCode?.code === "102-0104") {
        const { dismiss } = toast({
          variant: "destructive",
          title: "Invalid password",
          description: error.rawMessage,
          action: (
            <div>
              <Button
                onClick={() => {
                  dismiss()
                }}
                className="p-0 h-auto"
                size={"sm"}
                variant={"link"}
              >
                Got it
              </Button>
            </div>
          ),
        })
      } else {
        toast({
          variant: "destructive",
          title: "Change password",
          description: error.rawMessage,
        })
      }
    },
  })

  const handleToggleEye = (type: keyof typeof toggleEyes) => {
    setToggleEyes((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  const onSubmit: SubmitHandler<ChangePasswordType> = async (values) => {
    setOpenConfirm({
      type: "info",
      title: "Change password",
      description:
        "Are you sure you want to update your password? You will be signed out on all devices and need to sign in again with the new password.",
      onConfirm: async () => {
        await mutationUpdatePassword.mutateAsync({
          oldPassword: values.currentPassword.trim(),
          newPassword: values.newPassword.trim(),
        })
      },
    })
  }

  useEffect(() => {
    if (openModal) {
      form.reset()
    }
  }, [openModal])

  return (
    <Dialog open={openModal} onOpenChange={() => setOpenModal(false)}>
      <DialogContent>
        <DialogTitle>Change password</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name={"currentPassword"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <InputField
                        type={toggleEyes.currentPassword ? "text" : "password"}
                        placeholder="Enter your current password"
                        {...field}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => handleToggleEye("currentPassword")}
                          >
                            {toggleEyes.currentPassword ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </button>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"newPassword"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <InputField
                        type={toggleEyes.newPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        {...field}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => handleToggleEye("newPassword")}
                          >
                            {toggleEyes.newPassword ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </button>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!form.formState.errors.newPassword?.message && (
                <p className={"body-small"}>{passwordHint}</p>
              )}
              <FormField
                control={form.control}
                name={"confirmPassword"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <InputField
                        type={toggleEyes.confirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        {...field}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => handleToggleEye("confirmPassword")}
                          >
                            {toggleEyes.confirmPassword ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </button>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex justify-end gap-3 mt-4">
              <Button
                className="shadow"
                size="sm"
                variant="ghost"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Button>
              <Button size="sm" type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
