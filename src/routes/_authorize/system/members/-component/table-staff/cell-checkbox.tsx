import { Checkbox } from "@gearment/ui3"

export default function CellCheckbox({
  ...props
}: React.ComponentProps<typeof Checkbox>) {
  return (
    <div className="flex justify-center">
      <Checkbox {...props} />
    </div>
  )
}
