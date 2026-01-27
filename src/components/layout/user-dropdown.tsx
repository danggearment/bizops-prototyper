import user from "@/assets/images/avatar/image-01.jpg"
import { useMutationIam } from "@/services/connect-rpc/transport.tsx"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { getErrorMessage } from "@/utils/handle-error"
import { staffLogout } from "@gearment/nextapi/api/iam/v1/staff_account-StaffAccountAPI_connectquery"
import { toast } from "@gearment/ui3"
import { Link, useNavigate } from "@tanstack/react-router"

const UserDropdown = () => {
  const [setOpen, setClose] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])
  const navigate = useNavigate()

  const muttation = useMutationIam(staffLogout, {
    onSuccess: () => {
      navigate({
        to: "/login",
      })
      setClose()
      window.location.reload()
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Sign out",
        description: error.rawMessage,
      })
    },
  })

  const handleOpenModal = () => {
    setOpen({
      type: "error",
      title: "Sign out",
      description: `Do you want to sign out?`,
      onConfirm: async () => {
        try {
          await muttation.mutateAsync({})
          localStorage.clear()
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Sign out",
            description: getErrorMessage(error),
          })
        }
      },
    })
  }
  return (
    <div className="group relative">
      <Link to="/" className="flex items-center">
        <div className="h-12 w-full max-w-[48px] cursor-pointer rounded-full">
          <img
            src={user}
            alt="avatar"
            className="h-full w-full rounded-full object-cover object-center"
          />
        </div>
      </Link>

      <div className="invisible absolute right-0 top-[120%] z-50 mt-3 w-[200px] space-y-2 rounded bg-white p-3 opacity-0 shadow-card-2 duration-200 group-hover:visible group-hover:top-full group-hover:opacity-100 dark:bg-dark-2">
        <button
          onClick={handleOpenModal}
          className="block w-full text-left rounded px-4 py-2 text-sm font-medium text-body-color hover:bg-gray-2 hover:text-primary dark:text-dark-6 dark:hover:bg-dark"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

export default UserDropdown
