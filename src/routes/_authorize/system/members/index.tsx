import Filter from "@/routes/_authorize/system/members/-component/filter/filter.tsx"
import TableStaff from "@/routes/_authorize/system/members/-component/table-staff/table-staff.tsx"
import { FilterSchema } from "@/schemas/schemas/member.ts"
import { Button, PageHeader } from "@gearment/ui3"
import { createFileRoute, Link } from "@tanstack/react-router"
import { PlusIcon } from "lucide-react"

export const Route = createFileRoute("/_authorize/system/members/")({
  validateSearch: (search) => FilterSchema.parse(search),
  beforeLoad: () => ({
    breadcrumb: [
      {
        link: "#",
        name: "System",
        search: undefined,
      },
      {
        link: "/system/members",
        name: "Staff",
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
        <PageHeader.Title>Staff list</PageHeader.Title>
        <PageHeader.Action>
          <Link to="/system/members/new-user">
            <Button className="gap-2">
              <PlusIcon />
              Add staff
            </Button>
          </Link>
        </PageHeader.Action>
      </PageHeader>

      <Filter />

      <TableStaff />
    </>
  )
}
