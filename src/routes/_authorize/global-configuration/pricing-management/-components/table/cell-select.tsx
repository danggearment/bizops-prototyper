import { Checkbox } from "@gearment/ui3"

interface CellSelectProps {
  checked: boolean
  disabled: boolean
  onCheckedChange: (checked: boolean) => void
}

export default function CellSelect({
  checked,
  disabled,
  onCheckedChange,
}: CellSelectProps) {
  return (
    <div className="px-4 py-2">
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </div>
  )
}
