import { TeamSearchSchema } from "@/schemas/schemas/team"
import { ButtonIconCopy } from "@gearment/ui3"
import { Link, useLocation } from "@tanstack/react-router"

export default function CellTeam({
  teamId,
  teamName,
  teamOwnerEmail,
  createdByEmail,
}: {
  teamId: string
  teamName: string
  teamOwnerEmail?: string
  createdByEmail?: string
}) {
  const location = useLocation()

  return (
    <>
      <Link
        to={"/system/teams/$teamId/details"}
        params={{ teamId }}
        state={{
          ...location,
        }}
        className="hover:text-primary"
      >
        {teamName}
      </Link>
      <div className="flex items-center gap-1 text-foreground/50">
        <Link
          to={"/system/teams/$teamId/details"}
          params={{ teamId }}
          state={{
            ...location,
          }}
          className="hover:text-primary"
        >
          {teamId}
        </Link>
        <ButtonIconCopy size="sm" copyValue={teamId} />
      </div>

      <div className="flex items-center gap-1 text-foreground/50">
        {createdByEmail
          ? "Created by: "
          : teamOwnerEmail
            ? "Team owner: "
            : null}
        {(createdByEmail || teamOwnerEmail) && (
          <EmailLink email={createdByEmail || teamOwnerEmail || ""} />
        )}
      </div>
    </>
  )
}

function EmailLink({ email }: { email: string }) {
  const location = useLocation()

  return (
    <>
      <Link
        to={"/system/teams"}
        search={() =>
          TeamSearchSchema.parse({
            searchText: email,
          })
        }
        state={{
          ...location,
        }}
        className="hover:text-primary"
      >
        {email}
      </Link>
      <ButtonIconCopy size="sm" copyValue={email} />
    </>
  )
}
