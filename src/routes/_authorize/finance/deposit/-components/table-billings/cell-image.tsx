import Image from "@/components/common/image/image"
import { DepositRequest_Short } from "@/services/connect-rpc/types"
import { useNotificationModal } from "@/services/modals/modal-notification"
import { Button } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"

export default function CellImage(
  props: CellContext<DepositRequest_Short, any>,
) {
  const fileUrls = props.getValue<string[]>()
  const hasFileUrls = fileUrls && fileUrls.length > 0
  const [setOpen, onClose] = useNotificationModal((state) => [
    state.setOpen,
    state.onClose,
  ])
  const handleViewImage = () => {
    setOpen({
      title: "",
      OK: "Close",
      description: (
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {fileUrls.map((url) => (
            <div key={url} className="mx-auto">
              <Image responsive="w" url={url} />
            </div>
          ))}
        </div>
      ),
      onConfirm: () => {
        onClose()
      },
    })
  }
  return (
    <Button
      variant="link"
      onClick={handleViewImage}
      className={hasFileUrls ? "text-primary" : "text-gray-500"}
      disabled={!hasFileUrls}
    >
      {hasFileUrls ? "View" : "--"}
    </Button>
  )
}
