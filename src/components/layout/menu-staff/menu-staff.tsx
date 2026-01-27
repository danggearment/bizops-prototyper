import { useMutationIam } from "@/services/connect-rpc/transport.tsx"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { useNotificationModal } from "@/services/modals/modal-notification"
import { handleClearSession } from "@/utils"
import { staffLogout } from "@gearment/nextapi/api/iam/v1/staff_account-StaffAccountAPI_connectquery"
import { DropdownMenuItem, DropdownMenuSeparator, toast } from "@gearment/ui3"
import { InfoIcon, LockIcon, LogOutIcon } from "lucide-react"

interface Props {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>
  setOpenModalChangePassword: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MenuStaff({
  setOpenMenu,
  setOpenModalChangePassword,
}: Props) {
  const [setOpenConfirm] = useConfirmModal((state) => [state.setOpen])
  const [setOpenNotification, onCloseNotification] = useNotificationModal(
    (state) => [state.setOpen, state.onClose],
  )
  const mutation = useMutationIam(staffLogout, {
    onSuccess: () => {
      handleClearSession()
      window.location.href = `/login`
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Sign out",
        description: error.rawMessage,
      })
    },
  })

  const handleLogout = () => {
    setOpenMenu(false)
    setOpenConfirm({
      type: "error",
      title: "Logout",
      description: "Do you want to logout?",
      onConfirm: () => {
        mutation.mutateAsync({})
      },
    })
  }

  const handleChangePassword = () => {
    setOpenMenu(false)
    setOpenModalChangePassword(true)
  }

  const handleAbout = () => {
    setOpenMenu(false)
    setOpenNotification({
      title: "About",
      description: (
        <div>
          <p>App version {import.meta.env.VITE_VERSION}</p>
        </div>
      ),
      OK: "Close",
      onConfirm: () => {
        onCloseNotification()
      },
    })
  }

  const MenuItems = [
    {
      icon: LockIcon,
      text: "Change password",
      onClick: handleChangePassword,
    },
    {
      icon: InfoIcon,
      text: "About",
      onClick: handleAbout,
    },
    {
      type: "divider",
    },
    {
      className:
        "text-destructive hover:bg-destructive/5 dark:hover:bg-destructive/5",
      icon: LogOutIcon,
      text: "Logout",
      onClick: handleLogout,
    },
  ]
  return (
    <>
      {MenuItems.map((item, index) => {
        if (item.type === "divider") {
          return <DropdownMenuSeparator key={index} />
        }

        return (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            className={item.className}
          >
            {item.icon && <item.icon size={16} className={item.className} />}
            {item.text}
          </DropdownMenuItem>
        )
      })}
    </>
  )
}
