import { ButtonIconCopy } from "@gearment/ui3"
import { formatShortenText } from "@gearment/utils"

export default function ShortText({
  text,
  startLength = 10,
  endLength = 10,
  allowCopy = false,
}: {
  text: string
  startLength?: number
  endLength?: number
  allowCopy?: boolean
}) {
  return (
    <div className="inline-flex items-center gap-1">
      {formatShortenText(text, startLength, endLength)}
      {text.length > 0 && allowCopy && (
        <ButtonIconCopy size="sm" copyValue={text} />
      )}
    </div>
  )
}
