import AuthorizeLayout from "@/routes/_unauthorize/login/-components/authorize-layout.tsx"
import { useMutationIam } from "@/services/connect-rpc/transport.tsx"
import { queryClient } from "@/services/react-query.ts"
import {
  staffGetSelfProfile,
  staffLogin,
} from "@gearment/nextapi/api/iam/v1/staff_account-StaffAccountAPI_connectquery.ts"
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  InputField,
  toast,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Please enter your password"),
})

type LoginType = z.infer<typeof schema>

export default function Login() {
  const form = useForm<LoginType>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(schema),
  })
  const { handleSubmit } = form
  const navigate = useNavigate()

  const [toggleEye, setToggleEye] = useState(false)

  const mutation = useMutationIam(staffLogin, {
    onSuccess: async (data) => {
      localStorage.setItem("access_token", data.accessToken)

      await queryClient.invalidateQueries({
        queryKey: [
          staffGetSelfProfile.service.typeName,
          staffGetSelfProfile.name,
        ],
      })
      navigate({ to: "/" })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Sign in",
        description: "Username or Password is incorrect",
      })
    },
  })

  const onSubmit: SubmitHandler<LoginType> = async (values) => {
    console.log("Form submitted with values:", values)
    try {
      await mutation.mutateAsync({
        username: values.username.trim(),
        password: values.password.trim(),
      })
      console.log("Login successful, navigating to home page.")
    } catch (error) {
      console.log("Error during login:", error)
    }
  }

  const loading = mutation.isPending

  return (
    <AuthorizeLayout>
      <div className="max-w-[370px] mx-auto ">
        <h2 className="mb-[6px] text-center text-[30px] font-bold  mt-[50px]">
          Welcome Staff!
        </h2>
        <p className=" mb-9 dark:text-dark-6">
          Just a few steps to get back to your designs
        </p>
        <Form {...form}>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputField {...field} placeholder="Enter your username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputField
                      {...field}
                      placeholder="Enter your password"
                      type={toggleEye ? "type" : "password"}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setToggleEye((prev) => !prev)}
                        >
                          {toggleEye ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" disabled={loading} type="submit">
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    </AuthorizeLayout>
  )
}
