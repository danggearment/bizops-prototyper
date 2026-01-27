import {
  useMutationConnectRpc,
  useQueryConnectRpc,
} from "@/services/connect-rpc/connectrpc"
import { staffListStaffRole } from "@gearment/nextapi/api/iam/v1/staff_access-StaffAccessAPI_connectquery"
import { staffInviteNewStaff } from "@gearment/nextapi/api/iam/v1/staff_account-StaffAccountAPI_connectquery"
import {
  Button,
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
import { createFileRoute } from "@tanstack/react-router"
import { useMemo } from "react"
import { Form, SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"

export const Route = createFileRoute("/_authorize/users/create")({
  component: Index,
})

const InviteMemberSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  username: z.string().min(1, "Username is required"),
  roleId: z.string().min(1, "Role is required"),
})

type InviteStaffType = z.infer<typeof InviteMemberSchema>

function Index() {
  const { data } = useQueryConnectRpc(staffListStaffRole)
  const form = useForm<InviteStaffType>({
    defaultValues: {
      email: "",
      username: "",
      roleId: "",
    },
    resolver: zodResolver(InviteMemberSchema),
  })
  const { handleSubmit } = form
  const mutation = useMutationConnectRpc(staffInviteNewStaff)

  const onSubmit: SubmitHandler<InviteStaffType> = async (values) => {
    try {
      await mutation.mutateAsync(values)
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Some things went wrong",
      })
    }
  }

  const options = useMemo(() => {
    if (data?.data) {
      return data.data.map((d) => ({
        text: d.name,
        value: d.roleId,
      }))
    }
    return []
  }, [data])

  const loading = mutation.isPending

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className=" text-2xl font-semibold ">Create new member</h2>
      </div>
      <div className="bg-white dark:bg-dark-2">
        <div className="flex flex-wrap items-stretch">
          <div className="w-full lg:w-1/2">
            <div className="w-full px-6 py-6">
              <Form {...form}>
                <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <InputField {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <InputField {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Select {...field}>
                            <SelectTrigger>
                              <SelectValue></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {options.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                  {o.text}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={loading} type="submit">
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
