import * as z from "zod"
import {
  passwordValidation,
  passwordValidationMessage,
} from "@/constants/validation.ts"

export const CreateNewStaftSchema = z
  .object({
    email: z.string().email(),
    fullName: z.string().min(1, "Full name is required"),
    username: z.string().min(1, "Username is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .regex(passwordValidation, {
        message: passwordValidationMessage,
      })
      .max(100, "The maximum character limit is 100"),
    repeatPassword: z.string().max(100, "The maximum character limit is 100"),
    roleId: z.string().min(1, "Role is required"),
  })
  .superRefine(({ repeatPassword, password }, ctx) => {
    if (repeatPassword !== password || repeatPassword.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["repeatPassword"],
      })
    }
  })

export type CreateNewStaffType = z.infer<typeof CreateNewStaftSchema>
