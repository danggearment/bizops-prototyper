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
  toast,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"

import { passwordHint } from "@/constants/validation.ts"
import {
  CreateNewStaffType,
  CreateNewStaftSchema,
} from "@/schemas/schemas/create-new-staff.ts"
import { FilterSchema } from "@/schemas/schemas/member.ts"
import { useMutationIam } from "@/services/connect-rpc/transport.tsx"
import { staffCreateNewStaffAccount } from "@gearment/nextapi/api/iam/v1/staff_account-StaffAccountAPI_connectquery.ts"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

const RoleIdList = ["Admin"]

const roleOptions = RoleIdList.map((role) => ({
  value: role,
  label: role,
  text: role,
}))

export default function NewUserForm() {
  const navigate = useNavigate()
  const form = useForm<CreateNewStaffType>({
    defaultValues: {
      email: "",
      fullName: "",
      username: "",
      password: "",
      repeatPassword: "",
      roleId: "",
    },
    resolver: zodResolver(CreateNewStaftSchema),
  })

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = form

  const [toggleEyes, setToggleEyes] = useState({
    password: false,
    repeatPassword: false,
  })

  const handleToggleEye = (type: keyof typeof toggleEyes) => {
    setToggleEyes((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  const mutation = useMutationIam(staffCreateNewStaffAccount, {
    onSuccess: () => {
      toast({
        title: "Sign up",
        description: "Sign up successfully",
      })
      reset()
      setValue("roleId", "")
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Sign up",
        description: error.rawMessage,
      })
    },
  })

  const onCancel = () => {
    reset()
    navigate({ to: "/system/members", search: FilterSchema.parse({}) })
  }

  const onSubmit: SubmitHandler<CreateNewStaffType> = async (values) => {
    await mutation.mutateAsync(values)
  }

  const loading = mutation.isPending

  return (
    <Form {...form}>
      <form
        className="p-6 rounded-xl bg-white dark:bg-dark-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center lg:items-start lg:flex-row gap-[80px] m-[4px]">
          <div className="w-full lg:w-unset flex-1 space-y-4">
            <FormField
              control={control}
              name={"email"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Email</FormLabel>
                  <FormControl>
                    <InputField placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={"fullName"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fullname</FormLabel>
                  <FormControl>
                    <InputField placeholder="Enter fullname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={"username"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <InputField placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={"password"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputField
                      type={toggleEyes.password ? "type" : "password"}
                      placeholder="Enter your password"
                      {...field}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => handleToggleEye("password")}
                        >
                          {toggleEyes.password ? (
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

            {!errors.password?.message && (
              <p className={"body-small"}>{passwordHint}</p>
            )}

            <FormField
              control={control}
              name={"repeatPassword"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <InputField
                      type={toggleEyes.repeatPassword ? "type" : "password"}
                      placeholder="Re-enter your password"
                      {...field}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => handleToggleEye("repeatPassword")}
                        >
                          {toggleEyes.repeatPassword ? (
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
              control={control}
              name={"roleId"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={"Select Role"} />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((o) => {
                          return (
                            <SelectItem key={o.value} value={o.value}>
                              {o.text}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" disabled={loading} onClick={onCancel}>
            Cancel
          </Button>
          <Button
            disabled={!isDirty || loading}
            type="submit"
            loading={loading}
          >
            Add User
          </Button>
        </div>
      </form>
    </Form>
  )
}
