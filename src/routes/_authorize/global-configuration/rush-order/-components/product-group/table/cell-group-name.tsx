import { useNotificationModal } from "@/services/modals/modal-notification"
import { truncateWithEllipsis } from "@/utils/format-string"

type Props = {
  text: string
  maxLength?: number
}

export default function CellGroupName({ text, maxLength = 40 }: Props) {
  const [setOpen, onClose] = useNotificationModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const handleViewMore = () => {
    setOpen({
      title: "",
      OK: "Close",
      description: (
        <div className="w-full mx-auto break-words text-sm">
          <div className="font-medium">{text}</div>
        </div>
      ),
      onConfirm: () => {
        onClose()
      },
    })
  }

  const truncatedText = truncateWithEllipsis(text, maxLength)
  const showViewMore = text.length > maxLength

  return (
    <div className="flex items-center space-x-2 text-sm max-w-70">
      <p className="flex-1 truncate font-medium">{truncatedText}</p>
      {showViewMore && (
        <button
          onClick={handleViewMore}
          className="text-primary hover:text-primary/80 text-sm whitespace-nowrap cursor-pointer"
        >
          view more
        </button>
      )}
    </div>
  )
}
