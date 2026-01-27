import { header } from "@/utils/header"
import { Ability, AbilityBuilder } from "@casl/ability"
import { staffGetSelfProfile } from "@gearment/nextapi/api/iam/v1/staff_account-StaffAccountAPI_connectquery.ts"
import { LoadingSquare } from "@gearment/ui3"
import { createContext, useContext, useMemo } from "react"
import ability, { AllActions, AllSubjects } from "./acl"
import { useQueryIam } from "./connect-rpc/transport"

interface UserInfo {
  email: string
  staffId: string
  username: string
}

export interface AuthContext {
  user?: UserInfo
}

const AuthContext = createContext<AuthContext | null>(null)

interface Props {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  const { data: user, isPending } = useQueryIam(
    staffGetSelfProfile,
    undefined,
    {
      select: (data) => {
        if (!data || !data.staff) {
          return undefined
        }

        return {
          email: data.staff.email,
          username: data.staff.username,
          staffId: data.staff.staffId,
        }
      },
    },
  )

  const values = useMemo(() => {
    const xteamId = localStorage.getItem("x-team-id")
    if (xteamId) {
      header.add(header.headerKeys["x-team-id"], xteamId)
    }
    if (user) {
      const { can, rules } = new AbilityBuilder(Ability)
      can(AllActions, AllSubjects)
      ability.update(rules)
    }

    return {
      user: user,
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        ...values,
      }}
    >
      {isPending ? (
        <div className="flex fixed top-0 left-0 right-0 bottom-0 z-50 items-center bg-white dark:bg-dark justify-center min-h-screen w-full">
          <LoadingSquare />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
