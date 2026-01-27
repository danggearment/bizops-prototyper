import { cn } from "@gearment/ui3"
import { BanIcon, ImageIcon, TrashIcon } from "lucide-react"
import Image from "../image/image"

interface Props {
  url?: string
  onDelete?: () => void
  onSelect?: () => void
  disabled?: boolean
  enabledSelect?: boolean
  error?: boolean
}
export default function BoxImage({
  url,
  onDelete,
  onSelect,
  disabled,
  enabledSelect = true,
  error,
}: Props) {
  return (
    <div
      className={cn(
        "w-[80px] relative group h-[80px] items-center overflow-hidden justify-center bg-gray-1 border border-border rounded-lg inline-flex",
        url ? "" : "cursor-pointer border-dashed",
        disabled && "bg-gray-3 pointer-events-none",
        !enabledSelect && "pointer-events-none",
        error && "border-red",
      )}
      onClick={!url ? onSelect : undefined}
    >
      {disabled && (
        <div className="flex flex-col justify-center items-center">
          <BanIcon className=" fill-secondary-text" />
          <span className="body-small text-[10px]">Unavailable</span>
        </div>
      )}
      {!disabled &&
        (url ? (
          <>
            <Image
              width={80}
              className="group-hover:blur-sm h-full"
              url={url}
            />
            <div className="absolute top-0 left-0 gap-1 bottom-0 right-0 group-hover:flex hidden items-center justify-center ">
              <button onClick={onSelect} className="p-1 rounded-full bg-gray-1">
                <ImageIcon size={14} />
              </button>
              <button onClick={onDelete} className="p-1 rounded-full bg-gray-1">
                <TrashIcon size={16} />
              </button>
            </div>
          </>
        ) : (
          <ImageIcon size={24} />
        ))}
    </div>
  )
}
