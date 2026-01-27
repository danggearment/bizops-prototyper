import ImageAvatar from "@/components/common/image/image-avatar"
import LayoutTeam from "@/components/layout-team"
import {
  useMutationIam,
  useQueryIam,
  useQueryPod,
} from "@/services/connect-rpc/transport.tsx"
import { TeamStatus } from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { queryClient } from "@/services/react-query"
import {
  staffBlockTeam,
  staffUnBlockTeam,
} from "@gearment/nextapi/api/iam/v1/team-TeamAPI_connectquery"
import { staffGetTeamDetail } from "@gearment/nextapi/api/iam/v1/user_admin-UserAccountAdminAPI_connectquery.ts"
import { staffListProductPriceTierKey } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { Button, PageHeader, toast } from "@gearment/ui3"
import { createFileRoute, useParams } from "@tanstack/react-router"
import { LockIcon, UnlockIcon } from "lucide-react"
import { useMemo } from "react"
import { getConfirmBlockTeamDescription } from "./-component/confirm-block-team/confirm-block-team"
import LegalInformation from "./-component/legal-information/legal-information"
import MainDetails from "./-component/main-details/main-details"
import OtherTeams from "./-component/other-teams/other-teams"
import ReturnAddress from "./-component/return-address/return-address"
import TeamMembers from "./-component/team-members/team-members"

export const Route = createFileRoute(
  "/_authorize/system/teams/$teamId/details/",
)({
  beforeLoad: () => ({
    breadcrumb: [
      {
        name: "System",
        link: "/system/teams",
      },
      {
        name: "Teams",
        link: "/system/teams",
      },
      {
        name: "Team details",
        link: "#",
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = useParams({
    from: "/_authorize/system/teams/$teamId/details/",
  })

  const { data } = useQueryIam(staffGetTeamDetail, {
    teamId: params.teamId,
  })
  const { data: priceKeys, isLoading } = useQueryPod(
    staffListProductPriceTierKey,
    {},
  )

  const tierLevel = useMemo(() => {
    if (!data?.tierId) return "Bronze"
    return priceKeys?.keys?.find((key) => key.tierId === data.tierId)?.tierName
  }, [priceKeys, data])

  const [setOpenConfirm, onCloseConfirm] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const mutationBlockTeam = useMutationIam(staffBlockTeam, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          staffGetTeamDetail.service.typeName,
          staffGetTeamDetail.name,
        ],
      })
      toast({
        variant: "success",
        title: "Block team",
        description: "Team blocked successfully",
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Block team",
        description: error.rawMessage || "Failed to block team",
      })
    },
  })

  const mutationUnblockTeam = useMutationIam(staffUnBlockTeam, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          staffGetTeamDetail.service.typeName,
          staffGetTeamDetail.name,
        ],
      })
      toast({
        variant: "success",
        title: "Unblock team",
        description: "Team unblocked successfully",
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Unblock team",
        description: error.rawMessage || "Failed to unblock team",
      })
    },
  })

  const handleBlockTeam = () => {
    const teamOwner = data?.teamMembers?.find((member) => !!member.isTeamOwner)
    const ownerName = teamOwner?.userEmail
    const joinedDate = teamOwner?.createdAt

    setOpenConfirm({
      title: (
        <div className="flex items-center gap-2">
          <LockIcon className="text-destructive" size={20} />
          <span>Block Team</span>
        </div>
      ),
      description: getConfirmBlockTeamDescription({
        teamName: data?.teamName,
        ownerName,
        joinedDate,
      }),
      confirmText: "Block",
      type: "error",
      onConfirm: async () => {
        await mutationBlockTeam.mutateAsync({
          teamId: params.teamId,
        })
        onCloseConfirm()
      },
    })
  }

  const handleUnblockTeam = () => {
    setOpenConfirm({
      title: (
        <div className="flex items-center gap-2">
          <UnlockIcon className="text-primary" size={20} />
          <span>Unblock Team</span>
        </div>
      ),
      description: "This team will regain full access to the system.",
      confirmText: "Unblock",
      onConfirm: async () => {
        await mutationUnblockTeam.mutateAsync({
          teamId: params.teamId,
        })
        onCloseConfirm()
      },
    })
  }

  const isBlocked = useMemo(() => {
    return data?.status === TeamStatus.BLOCKED
  }, [data?.status])

  return (
    <>
      <LayoutTeam>
        <PageHeader>
          <PageHeader.Title>Team details</PageHeader.Title>
        </PageHeader>

        <div className="flex flex-col rounded-xl gap-4">
          <div className="bg-background p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <ImageAvatar
                  className="w-[48px] h-[48px] rounded border"
                  url={data?.profileImageUrl || ""}
                  alt={data?.teamName}
                  name={params.teamId}
                />

                <p className="font-semibold text-xl">{data?.teamName}</p>
              </div>
              {!isBlocked && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBlockTeam}
                  disabled={mutationBlockTeam.isPending}
                >
                  Block
                </Button>
              )}

              {isBlocked && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleUnblockTeam}
                  disabled={mutationUnblockTeam.isPending}
                >
                  Unblock
                </Button>
              )}
            </div>
            <MainDetails
              status={data?.status}
              email={data?.verifiedEmail}
              tierLevel={isLoading ? "" : tierLevel}
              wallet={data?.wallet}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col flex-1 gap-4 ">
              <OtherTeams otherTeams={data?.otherTeams || []} />
              <TeamMembers teamMembers={data?.teamMembers || []} />
            </div>
          </div>
          <div className="flex gap-4">
            <LegalInformation teamID={params.teamId} />
            <ReturnAddress teamID={params.teamId} />
          </div>
        </div>
      </LayoutTeam>
    </>
  )
}
