import NewUserForm from "@/routes/_authorize/system/members/-component/new-user-form/new-user-form.tsx"
import { FilterSchema } from "@/schemas/schemas/member.ts"
import { Button, PageHeader } from "@gearment/ui3"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"

export const Route = createFileRoute("/_authorize/system/members/new-user")({
  beforeLoad: () => ({
    breadcrumb: [
      {
        link: "/system/members",
        name: "Members",
        search: undefined,
      },
      {
        link: "/system/members/new-user",
        name: "New User",
        search: undefined,
      },
    ],
  }),
  component: Index,
})

function Index() {
  return (
    <>
      <PageHeader>
        <div className={"flex items-center justify-center"}>
          <Link
            to="/system/members"
            className={"mr-4 items-center flex"}
            search={FilterSchema.parse({})}
          >
            <Button size={"icon"} variant={"outline"}>
              <ArrowLeftIcon width={16} height={16} />
            </Button>
          </Link>
          <PageHeader.Title>Add Member</PageHeader.Title>
        </div>
      </PageHeader>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NewUserForm />
      </div>
    </>
  )
}
