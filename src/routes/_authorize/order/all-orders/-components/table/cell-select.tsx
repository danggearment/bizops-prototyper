import { Checkbox } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"

interface Props
  extends CellContext<any, any>,
    React.ComponentProps<typeof Checkbox> {}

export default function CellSelect({ ...props }: Props) {
  return (
    <div className="flex justify-center">
      <Checkbox {...props} />
    </div>
  )
}
