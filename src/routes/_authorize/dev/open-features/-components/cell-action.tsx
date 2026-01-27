import {
  staffListFlag,
  staffUpdateFlag,
} from "@gearment/nextapi/api/iam/v1/user_admin-UserAccountAdminAPI_connectquery"
import { CellContext } from "@tanstack/react-table"
import { PenLineIcon } from "lucide-react"
import { useMutationIam } from "@/services/connect-rpc/transport"
import { Flag } from "@/services/connect-rpc/types"
import {
  FlagType,
  useOpenFeatureModal,
} from "@/services/modals/modal-open-feature"
import { queryClient } from "@/services/react-query"

export default function CellAction(props: CellContext<Flag, any>) {
  const { flag, variations, targeting } = props.row.original
  const [actions] = useOpenFeatureModal((state) => [state.actions])

  const whitelist = targeting?.[0]?.query
    ? targeting[0].query
        .match(/"([^"]+)"/g)
        ?.map((email) => email.replace(/"/g, ""))
        .join(", ") || ""
    : ""

  const mutation = useMutationIam(staffUpdateFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [staffListFlag.service.typeName, staffListFlag.name],
      })
      actions.onClose()
    },
  })

  const handleSubmit = async (values: FlagType) => {
    const queryEmail = values.whitelist
      .split(", ")
      .map((email) => `"${email}"`)
      .join(", ")

    await mutation.mutateAsync({
      ...props.row.original,
      flag: values.flagName,
      variations: {
        ...variations,
        falseVar: {
          enable: values.defaultActive,
          version: values.defaultVersion,
        },
        trueVar: { ...variations?.trueVar, version: values.whitelistVersion },
      },
      defaultRule: { percentage: { falseVar: 100, trueVar: 0 } },
      targeting: [{ query: `email in [${queryEmail}]`, variation: "trueVar" }],
    })
  }

  return (
    <>
      <PenLineIcon
        size={16}
        onClick={() =>
          actions.onOpen({
            title: "Edit flag feature",
            defaultValues: {
              flagName: flag,
              whitelist,
              whitelistVersion: variations?.trueVar?.version,
              defaultVersion: variations?.falseVar?.version,
              defaultActive: variations?.falseVar?.enable || false,
            },
            onSave: handleSubmit,
          })
        }
      />
    </>
  )
}
