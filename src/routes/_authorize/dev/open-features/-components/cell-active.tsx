import { useMutationIam } from "@/services/connect-rpc/transport"
import { Flag } from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { queryClient } from "@/services/react-query"
import {
  staffListFlag,
  staffUpdateFlag,
} from "@gearment/nextapi/api/iam/v1/user_admin-UserAccountAdminAPI_connectquery"
import { Switch } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"

export default function CellActive(props: CellContext<Flag, any>) {
  const [setOpenConfirm, onClose] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])
  const { variations } = props.row.original
  const mutation = useMutationIam(staffUpdateFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [staffListFlag.service.typeName, staffListFlag.name],
      })
    },
  })

  const handleUpdateFlag = async (checked: boolean) => {
    setOpenConfirm({
      type: "info",
      title: "Update flag active",
      description:
        "Do you wish to proceed with changing the active of this flag?",
      onConfirm: async () => {
        await mutation.mutateAsync({
          ...props.row.original,
          variations: {
            ...variations,
            falseVar: {
              ...variations?.falseVar,
              enable: checked,
            },
          },
          defaultRule: { percentage: { falseVar: 100, trueVar: 0 } },
        })
        onClose()
      },
    })
  }

  const disabled = mutation.isPending

  return (
    <Switch
      checked={variations?.falseVar?.enable || false}
      onCheckedChange={handleUpdateFlag}
      disabled={disabled}
    />
  )
}
